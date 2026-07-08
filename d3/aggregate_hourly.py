import csv
import datetime
from collections import defaultdict

DATA_DIR = '/home/epi/Project/sumintern/d3'

def parse_tsv(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        return list(csv.DictReader(f, delimiter='\t'))

def ts_to_dt(ms):
    return datetime.datetime.fromtimestamp(int(ms) / 1000)

def ts_to_hour(ms):
    return ts_to_dt(ms).strftime('%Y-%m-%d %H:00')

hosts = {h['hostid']: h for h in parse_tsv(f'{DATA_DIR}/host_detail.dat')}
mods = {m['mod']: m for m in parse_tsv(f'{DATA_DIR}/mod_detail.dat')}
disk_rows = parse_tsv(f'{DATA_DIR}/disk_tsar.dat')
pref_rows = parse_tsv(f'{DATA_DIR}/pref_tsar.dat')

# ===== 1. human.csv =====
with open(f'{DATA_DIR}/human.csv', 'w', encoding='utf-8', newline='') as f:
    w = csv.writer(f)
    w.writerow(['时间', '主机名', '负责人', '型号', '机房', '机柜', '类型', '指标', '指标描述', '单位', '分组', '值'])
    for rows in [disk_rows, pref_rows]:
        for r in rows:
            h = hosts.get(r['hostid'], {})
            m = mods.get(r['mod'], {})
            dt = ts_to_dt(r['ts'])
            w.writerow([
                dt, h.get('hostname', ''), h.get('owner', ''), h.get('model', ''),
                h.get('location1', ''), h.get('location2', ''),
                r['type'], r['mod'], m.get('desc', ''), m.get('unit', ''), r['tag'], r['value']
            ])

total = sum(1 for _ in open(f'{DATA_DIR}/human.csv')) - 1
print(f'human.csv: {total} 行')

# ===== 2. analyze.csv =====
disk_keys = ['rqm', 'read', 'write', 'avgrq', 'await', 'util', 'svctm']
pref_keys = ['cpu_usage', 'mem_used']
col_names = [
    '每秒合并读请求数', '每秒读取扇区数', '每秒写入扇区数',
    '平均请求扇区大小', '平均IO等待时间ms', '使用率%', '平均服务时间ms',
    'CPU使用率%', '已用内存MB'
]

hourly = defaultdict(lambda: {k: [] for k in disk_keys + pref_keys})
for r in disk_rows:
    h = ts_to_hour(r['ts'])
    for k in disk_keys:
        if r['mod'].endswith(k):
            hourly[h][k].append(float(r['value']))
for r in pref_rows:
    if r['mod'] in pref_keys:
        hourly[ts_to_hour(r['ts'])][r['mod']].append(float(r['value']))

with open(f'{DATA_DIR}/analyze.csv', 'w', encoding='utf-8', newline='') as f:
    w = csv.writer(f)
    w.writerow(['时间'] + [f'{i}.{n}' for i, n in enumerate(col_names, 1)])
    keys = disk_keys + pref_keys
    for h in sorted(hourly):
        row = [h]
        for k in keys:
            vs = hourly[h][k]
            row.append(round(sum(vs) / len(vs), 2) if vs else '')
        w.writerow(row)

total = sum(1 for _ in open(f'{DATA_DIR}/analyze.csv')) - 1
print(f'analyze.csv: {total} 行')
print('完成')
