import os
import psycopg2
import psycopg2.extras

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://monitor:monitor123@localhost:5432/monitor")

def get_conn():
    return psycopg2.connect(DATABASE_URL)

def init_db():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS hosts (
            hostid VARCHAR(50) PRIMARY KEY,
            hostname VARCHAR(200),
            owner VARCHAR(200),
            model VARCHAR(200),
            location1 VARCHAR(200),
            location2 VARCHAR(200)
        );
        CREATE TABLE IF NOT EXISTS modules (
            mod VARCHAR(100) PRIMARY KEY,
            type VARCHAR(20),
            description VARCHAR(500),
            unit VARCHAR(50),
            tag VARCHAR(100)
        );
        CREATE TABLE IF NOT EXISTS metrics (
            id BIGSERIAL PRIMARY KEY,
            type VARCHAR(10),
            hostid VARCHAR(50),
            ts TIMESTAMP,
            mod VARCHAR(100),
            value DOUBLE PRECISION,
            tag VARCHAR(100)
        );
        CREATE INDEX IF NOT EXISTS idx_metrics_type_ts ON metrics(type, ts);
        CREATE INDEX IF NOT EXISTS idx_metrics_type_mod ON metrics(type, mod);
        CREATE INDEX IF NOT EXISTS idx_metrics_type_host ON metrics(type, hostid);
        CREATE INDEX IF NOT EXISTS idx_metrics_mod_ts ON metrics(mod, ts);
    """)
    conn.commit()
    cur.close()
    conn.close()

def table_empty(table):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(f"SELECT COUNT(*) FROM {table}")
    cnt = cur.fetchone()[0]
    cur.close()
    conn.close()
    return cnt == 0

def stats(hours=None):
    conn = get_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    def type_filter(t):
        if not hours:
            return ""
        return f"AND ts >= (SELECT MAX(ts) FROM metrics WHERE type='{t}') - INTERVAL '{hours} hours'"

    wh = ""
    if hours:
        wh = f"WHERE ts >= (SELECT MAX(ts) FROM metrics) - INTERVAL '{hours} hours'"

    cur.execute(f"""
        SELECT
            (SELECT COUNT(*) FROM hosts) AS total_hosts,
            (SELECT COUNT(*) FROM modules) AS total_mods,
            (SELECT COUNT(*) FROM modules WHERE type='disk') AS disk_mods_count,
            (SELECT COUNT(*) FROM modules WHERE type='pref') AS pref_mods_count,
            (SELECT COUNT(*) FROM metrics WHERE type='disk' {type_filter('disk')}) AS disk_points,
            (SELECT COUNT(*) FROM metrics WHERE type='pref' {type_filter('pref')}) AS pref_points,
            (SELECT COUNT(*) FROM metrics WHERE type='disk' {type_filter('disk')}) +
            (SELECT COUNT(*) FROM metrics WHERE type='pref' {type_filter('pref')}) AS total_points,
            EXTRACT(EPOCH FROM MIN(ts)) * 1000 AS time_start,
            EXTRACT(EPOCH FROM MAX(ts)) * 1000 AS time_end
        FROM metrics m
        {wh}
    """)
    row = cur.fetchone()
    for k in ('time_start', 'time_end'):
        if row[k]: row[k] = int(row[k])
    cur.close()
    conn.close()
    return row

def disk_trend(hours=None):
    conn = get_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    time_filter = "" if not hours else "AND m.ts >= (SELECT MAX(ts) FROM metrics WHERE type='disk') - INTERVAL '%s hours'" % hours
    cur.execute(f"""
        SELECT
            to_char(date_trunc('hour', m.ts), 'YYYY-MM-DD HH24:MI') AS hour,
            AVG(CASE WHEN m.mod LIKE '%%_util' THEN m.value END) AS avg_util,
            AVG(CASE WHEN m.mod LIKE '%%_await' THEN m.value END) AS avg_await,
            AVG(CASE WHEN m.mod LIKE '%%_rqm' THEN m.value END) AS avg_rqm,
            AVG(CASE WHEN m.mod LIKE '%%_read' THEN m.value END) AS avg_read,
            AVG(CASE WHEN m.mod LIKE '%%_write' THEN m.value END) AS avg_write
        FROM metrics m
        WHERE m.type='disk' {time_filter}
        GROUP BY date_trunc('hour', m.ts)
        ORDER BY date_trunc('hour', m.ts)
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

def pref_trend(hours=None):
    conn = get_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    time_filter = "" if not hours else "AND m.ts >= (SELECT MAX(ts) FROM metrics WHERE type='pref') - INTERVAL '%s hours'" % hours
    cur.execute(f"""
        SELECT
            to_char(date_trunc('hour', m.ts), 'YYYY-MM-DD HH24:MI') AS hour,
            AVG(CASE WHEN m.mod = 'cpu_usage' THEN m.value END) AS avg_cpu,
            AVG(CASE WHEN m.mod = 'mem_used' THEN m.value END) AS avg_mem
        FROM metrics m
        WHERE m.type='pref' {time_filter}
        GROUP BY date_trunc('hour', m.ts)
        ORDER BY date_trunc('hour', m.ts)
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

def host_ranking(hours=None):
    conn = get_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    time_filter = "" if not hours else "AND m.ts >= (SELECT MAX(ts) FROM metrics WHERE type='disk') - INTERVAL '%s hours'" % hours
    cur.execute(f"""
        SELECT h.hostid, h.hostname, h.owner, h.model, h.location1, h.location2,
            AVG(m.value) AS sda_util
        FROM metrics m
        JOIN hosts h ON h.hostid = m.hostid
        WHERE m.type='disk' AND m.mod LIKE '%%_util' {time_filter}
        GROUP BY h.hostid, h.hostname, h.owner, h.model, h.location1, h.location2
        ORDER BY sda_util DESC
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    for r in rows:
        for k in ('sda_util',): r[k] = round(r[k], 2) if r[k] else None
        r['avg'] = {'sda_util': r.pop('sda_util')}
    return rows

def disk_heatmap(hours=None):
    conn = get_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cur.execute("SELECT hostid, hostname FROM hosts")
    host_map = {r["hostid"]: r["hostname"] for r in cur.fetchall()}

    time_filter = "" if not hours else "AND m.ts >= (SELECT MAX(ts) FROM metrics WHERE type='disk') - INTERVAL '%s hours'" % hours
    cur.execute(f"""
        SELECT
            to_char(date_trunc('hour', m.ts), 'YYYY-MM-DD HH24:MI') AS hour,
            m.hostid,
            AVG(m.value) AS avg_val
        FROM metrics m
        WHERE m.type='disk' AND m.mod LIKE '%%_util' {time_filter}
        GROUP BY date_trunc('hour', m.ts), m.hostid
        ORDER BY date_trunc('hour', m.ts), m.hostid
    """)
    raw = cur.fetchall()
    cur.close()
    conn.close()

    hostnames = []
    host_order = {}
    for h in sorted(host_map.keys()):
        name = host_map.get(h, h)
        hostnames.append(name)
        host_order[h] = name

    hours_set = []
    hour_index = {}
    row_map = {}
    for r in raw:
        hh = r['hour']
        if hh not in hour_index:
            hour_index[hh] = len(hours_set)
            hours_set.append(hh)
        key = f"{hh}|{r['hostid']}"
        row_map[key] = round(r['avg_val'], 1)

    data = []
    values = []
    for hh in hours_set:
        for hid, hname in host_order.items():
            key = f"{hh}|{hid}"
            v = row_map.get(key)
            data.append([hh, hname, v])
            if v is not None:
                values.append(v)

    return {
        "hosts": hostnames,
        "hours": hours_set,
        "data": data,
        "valueMin": min(values) if values else 0,
        "valueMax": max(values) if values else 100,
    }

def disk_scatter(hours=None):
    conn = get_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    time_filter = "" if not hours else "AND m.ts >= (SELECT MAX(ts) FROM metrics WHERE type='disk') - INTERVAL '%s hours'" % hours
    cur.execute(f"""
        WITH hourly AS (
            SELECT date_trunc('hour', m.ts) AS hour, m.hostid,
                AVG(CASE WHEN m.mod LIKE '%%_util' THEN m.value END) AS util,
                AVG(CASE WHEN m.mod LIKE '%%_await' THEN m.value END) AS await
            FROM metrics m
            WHERE m.type='disk' {time_filter}
            GROUP BY date_trunc('hour', m.ts), m.hostid
        )
        SELECT round(util::numeric, 2) AS util, round(await::numeric, 2) AS await
        FROM hourly
        WHERE util IS NOT NULL AND await IS NOT NULL
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [{"util": float(r["util"]), "await": float(r["await"])} for r in rows]

def completeness(hours=None):
    conn = get_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    time_filter_ts = "" if not hours else "ts >= (SELECT MAX(ts) FROM metrics) - INTERVAL '%s hours'" % hours
    cutoff_sql = "" if not hours else "AND m.ts >= (SELECT MAX(ts) FROM metrics) - INTERVAL '%s hours'" % hours

    cur.execute(f"""
        SELECT type,
            COUNT(DISTINCT date_trunc('hour', ts)) AS hour_count,
            COUNT(DISTINCT hostid) AS host_count,
            COUNT(DISTINCT mod) AS mod_count,
            COUNT(DISTINCT (date_trunc('hour', ts), hostid, mod)) AS actual_cells
        FROM metrics m
        WHERE {time_filter_ts + ' AND' if time_filter_ts else ''} 1=1
        GROUP BY type
    """)
    type_stats = cur.fetchall()

    cur.execute(f"""
        SELECT type, mod FROM modules ORDER BY type, mod
    """)
    all_mods = cur.fetchall()
    cur.close()
    conn.close()

    mods_by_type = {}
    for r in all_mods:
        mods_by_type.setdefault(r['type'], []).append(r['mod'])

    result = {"perMod": {}}
    for ts in type_stats:
        typ = ts['type']
        hc = ts['hour_count']
        hstc = ts['host_count']
        mc = ts['mod_count']
        actual = ts['actual_cells']
        expected = hc * hstc * len(mods_by_type.get(typ, []))
        rate = round(actual / expected * 100, 1) if expected else 0
        result[f"{typ}Completeness"] = rate
        result[f"{typ}Actual"] = actual
        result[f"{typ}Total"] = expected

        for m in mods_by_type.get(typ, []):
            conn = get_conn()
            c = conn.cursor()
            c.execute(f"""
                SELECT COUNT(*) FROM (
                    SELECT DISTINCT date_trunc('hour', ts), hostid
                    FROM metrics WHERE mod = %s AND type = %s {cutoff_sql.replace('m.', '') if cutoff_sql else ''}
                ) sub
            """, (m, typ))
            m_actual = c.fetchone()[0]
            c.close()
            conn.close()
            m_total = hc * hstc
            m_rate = round(m_actual / m_total * 100, 1) if m_total else 0
            result["perMod"][m] = {"total": m_total, "actual": m_actual, "rate": m_rate}

    result["hourCount"] = type_stats[0]['hour_count'] if type_stats else 0
    result["hostCount"] = type_stats[0]['host_count'] if type_stats else 0
    return result

def get_all_hosts():
    conn = get_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT * FROM hosts ORDER BY hostid")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

def get_all_modules():
    conn = get_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT * FROM modules ORDER BY mod")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows
