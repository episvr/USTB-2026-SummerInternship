import csv
import os
from datetime import datetime, timezone
from psycopg2.extras import execute_values
from .db import get_conn, init_db, table_empty

DATA_DIR = os.getenv("DATA_DIR", "/data")

def parse_tsv(path):
    rows = []
    with open(path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter='\t')
        for row in reader:
            rows.append(row)
    return rows

def import_all():
    init_db()

    conn = get_conn()
    cur = conn.cursor()

    if not table_empty("metrics"):
        cur.close()
        conn.close()
        return

    hosts = parse_tsv(os.path.join(DATA_DIR, "host_detail.dat"))
    for h in hosts:
        cur.execute(
            "INSERT INTO hosts (hostid, hostname, owner, model, location1, location2) VALUES (%s,%s,%s,%s,%s,%s) ON CONFLICT DO NOTHING",
            (h.get('hostid'), h.get('hostname'), h.get('owner'), h.get('model'), h.get('location1'), h.get('location2'))
        )

    mods = parse_tsv(os.path.join(DATA_DIR, "mod_detail.dat"))
    for m in mods:
        cur.execute(
            "INSERT INTO modules (mod, type, description, unit, tag) VALUES (%s,%s,%s,%s,%s) ON CONFLICT DO NOTHING",
            (m.get('mod'), m.get('type'), m.get('desc'), m.get('unit'), m.get('tag'))
        )

    def import_metrics(filename, mtype):
        path = os.path.join(DATA_DIR, filename)
        rows = parse_tsv(path)
        batch = []
        for r in rows:
            ts_ms = int(r['ts'])
            ts = datetime.fromtimestamp(ts_ms / 1000.0, tz=timezone.utc)
            batch.append((mtype, r['hostid'], ts, r['mod'], float(r['value']), r.get('tag', '')))
            if len(batch) >= 10000:
                execute_values(cur,
                    "INSERT INTO metrics (type, hostid, ts, mod, value, tag) VALUES %s",
                    batch, template="(%s, %s, %s, %s, %s, %s)"
                )
                batch.clear()
                conn.commit()
        if batch:
            execute_values(cur,
                "INSERT INTO metrics (type, hostid, ts, mod, value, tag) VALUES %s",
                batch, template="(%s, %s, %s, %s, %s, %s)"
            )
        conn.commit()

    import_metrics("disk_tsar.dat", "disk")
    import_metrics("pref_tsar.dat", "pref")

    cur.close()
    conn.close()
