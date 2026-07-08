const API_BASE = import.meta.env.VITE_API_BASE || '/api'

async function apiGet(path, params = {}) {
  const qs = Object.entries(params)
    .filter(([, v]) => v != null && v !== '' && v !== undefined)
    .map(([k, v]) => `${k}=${v}`)
    .join('&')
  const url = `${API_BASE}${path}${qs ? '?' + qs : ''}`
  const r = await fetch(url)
  if (!r.ok) throw new Error(`API ${path}: ${r.status}`)
  return r.json()
}

export async function loadData(hours = null) {
  const param = hours ? { hours } : {}

  const [statsRaw, diskTrendRaw, prefTrendRaw, hostRankRaw, heatmapRaw, scatterRaw, completenessRaw, hostsRaw, modsRaw] =
    await Promise.all([
      apiGet('/stats', param),
      apiGet('/disk/trend', param),
      apiGet('/pref/trend', param),
      apiGet('/disk/host-ranking'),
      apiGet('/disk/heatmap'),
      apiGet('/disk/scatter'),
      apiGet('/completeness', param),
      apiGet('/hosts'),
      apiGet('/modules'),
    ])

  const stats = {
    totalHosts: statsRaw.total_hosts,
    totalMods: statsRaw.total_mods,
    diskModsCount: statsRaw.disk_mods_count,
    prefModsCount: statsRaw.pref_mods_count,
    diskPoints: statsRaw.disk_points,
    prefPoints: statsRaw.pref_points,
    totalPoints: statsRaw.total_points,
    timeStart: new Date(statsRaw.time_start),
    timeEnd: new Date(statsRaw.time_end),
  }

  const diskUtilTrend = diskTrendRaw.data.map(d => ({
    hour: d.hour,
    avgUtil: d.avg_util,
    avgAwait: d.avg_await,
    avgRqm: d.avg_rqm,
    avgRead: d.avg_read,
    avgWrite: d.avg_write,
  }))

  const cpuMemTrend = prefTrendRaw.data.map(d => ({
    hour: d.hour,
    avgCpu: d.avg_cpu,
    avgMem: d.avg_mem,
  }))

  const hostDiskStats = hostRankRaw.data.map(d => ({
    hostid: d.hostid,
    hostname: d.hostname,
    owner: d.owner,
    model: d.model,
    location1: d.location1,
    location2: d.location2,
    avg: d.avg,
  }))

  const diskUtilHeatmap = {
    hosts: heatmapRaw.hosts,
    hours: heatmapRaw.hours,
    data: heatmapRaw.data,
    valueMin: heatmapRaw.valueMin,
    valueMax: heatmapRaw.valueMax,
  }

  const diskUtilScatter = scatterRaw.data.map(d => ({
    util: d.util,
    await: d.await,
  }))

  const completeness = completenessRaw

  const hosts = hostsRaw.data.map(d => ({
    hostid: d.hostid,
    hostname: d.hostname,
    owner: d.owner,
    model: d.model,
    location1: d.location1,
    location2: d.location2,
  }))

  const mods = modsRaw.data.map(d => ({
    mod: d.mod,
    type: d.type,
    desc: d.description,
    unit: d.unit,
    tag: d.tag,
  }))

  const hostMap = new Map(hosts.map(h => [h.hostid, h]))
  const modMap = new Map(mods.map(m => [m.mod, m]))

  return { hosts, mods, hostMap, modMap, stats, diskUtilTrend, cpuMemTrend, hostDiskStats, diskUtilHeatmap, diskUtilScatter, completeness }
}

export function getMetricDistribution(values, bins = 20) {
  if (!values || values.length === 0) return []
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const binWidth = range / bins
  const dist = Array.from({ length: bins }, (_, i) => {
    const lo = min + i * binWidth
    const hi = lo + binWidth
    const count = values.filter(v => v >= lo && (i === bins - 1 ? v <= hi : v < hi)).length
    return { range: `${lo.toFixed(1)}-${hi.toFixed(1)}`, count, lo, hi }
  })
  return dist
}
