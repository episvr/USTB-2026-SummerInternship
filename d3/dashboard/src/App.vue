<template>
  <div v-if="loading" class="loading-screen">
    <div class="loader">
      <div class="loader-ring"></div>
      <div class="loader-text">正在加载数据中心数据...</div>
      <div class="loader-sub">PostgreSQL 实时聚合 · FastAPI 后端服务</div>
    </div>
  </div>
  <div v-else-if="error" class="loading-screen">
    <div class="loader error">
      <div class="loader-icon">⚠️</div>
      <div class="loader-text">{{ error }}</div>
    </div>
  </div>
  <template v-else>
    <header class="dash-header">
      <div class="header-left">
        <div class="header-logo">◈</div>
        <h1>数据中心监控大屏</h1>
      </div>
      <div class="header-info">
        <div class="range-selector">
          <span class="range-label">时段</span>
          <button v-for="opt in timeOptions" :key="opt.value"
            :class="['range-btn', { active: timeRange === opt.value }]"
            @click="switchRange(opt.value)">{{ opt.label }}</button>
        </div>
        <span class="info-item">📊 {{ stats.totalPoints.toLocaleString() }} 条记录</span>
        <span class="info-item">📅 {{ dateRange }}</span>
        <span class="dat-badge">🐘 PG + API</span>
      </div>
    </header>

    <section class="dash-grid">
      <StatCard label="监控主机" :value="stats.totalHosts" icon="🖥" color="#409eff" sub="覆盖全部机房" />
      <StatCard label="采集指标" :value="stats.totalMods" icon="📊" color="#67c23a" :sub="`磁盘 ${stats.diskModsCount} + 性能 ${stats.prefModsCount}`" />
      <StatCard label="磁盘采样点" :value="stats.diskPoints" icon="💾" color="#e6a23c" sub="disk_tsar.dat" />
      <StatCard label="性能采样点" :value="stats.prefPoints" icon="⚡" color="#f56c6c" sub="pref_tsar.dat" />
      <StatCard label="数据完整性" :value="`${completeness.diskCompleteness || 0}%`" icon="✅" color="#00d4ff" :sub="`磁盘 ${completeness.diskCompleteness || 0}% · 性能 ${completeness.prefCompleteness || 0}%`" />
      <StatCard label="时间跨度" :value="timeSpan" icon="📅" color="#a78bfa" :sub="dateRange" />
    </section>

    <section class="dash-grid">
      <DiskTrend :data="diskUtilTrend" />
      <DiskThroughput :data="diskUtilTrend" />
    </section>

    <section class="dash-grid">
      <DiskHeatmap :data="diskUtilHeatmap" />
    </section>

    <section class="dash-grid">
      <HostRanking :data="hostDiskStats" />
      <UtilAwaitScatter :data="diskUtilScatter" />
    </section>

    <section class="dash-grid">
      <PerfTrend :data="cpuMemTrend" />
      <DataQuality :data="completeness" :perMod="completeness.perMod" />
    </section>

    <section class="dash-grid">
      <MetricBrowser :hosts="hosts" :mods="mods" style="grid-column: span 6;" />
    </section>
  </template>
</template>

<script setup>
import { ref, computed } from 'vue'
import { loadData } from './parser.js'
import StatCard from './components/StatCard.vue'
import ChPanel from './components/ChPanel.vue'
import DiskTrend from './components/DiskTrend.vue'
import DiskThroughput from './components/DiskThroughput.vue'
import DiskHeatmap from './components/DiskHeatmap.vue'
import PerfTrend from './components/PerfTrend.vue'
import HostRanking from './components/HostRanking.vue'
import MetricDist from './components/MetricDist.vue'
import DataQuality from './components/DataQuality.vue'
import UtilAwaitScatter from './components/UtilAwaitScatter.vue'
import MetricBrowser from './components/MetricBrowser.vue'

const loading = ref(true)
const error = ref(null)

const hosts = ref([])
const mods = ref([])
const stats = ref({})
const diskUtilTrend = ref([])
const cpuMemTrend = ref([])
const hostDiskStats = ref([])
const diskUtilHeatmap = ref({})
const diskUtilScatter = ref([])
const completeness = ref({})

const timeOptions = [
  { label: '24h', value: '24h' },
  { label: '3d', value: '3d' },
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
  { label: '全部', value: 'all' },
]
const timeRange = ref('7d')

const hourMap = { '24h': 24, '3d': 72, '7d': 168, '30d': 720 }

async function fetchData(hours) {
  loading.value = true
  error.value = null
  try {
    const data = await loadData(hours)
    hosts.value = data.hosts
    mods.value = data.mods
    stats.value = data.stats
    diskUtilTrend.value = data.diskUtilTrend
    cpuMemTrend.value = data.cpuMemTrend
    hostDiskStats.value = data.hostDiskStats
    diskUtilHeatmap.value = data.diskUtilHeatmap
    diskUtilScatter.value = data.diskUtilScatter
    completeness.value = data.completeness
  } catch (e) {
    error.value = '数据加载失败: ' + e.message
  } finally {
    loading.value = false
  }
}

function switchRange(val) {
  timeRange.value = val
  fetchData(hourMap[val] || null)
}

const timeSpan = computed(() => {
  const s = stats.value.timeStart
  if (!s) return '-'
  const diff = stats.value.timeEnd - s
  const totalHours = Math.round(diff / (1000 * 60 * 60))
  const days = Math.floor(totalHours / 24)
  const hours = totalHours % 24
  if (days >= 30) return `${Math.floor(days / 30)} 月 ${days % 30} 天`
  if (days > 0) return `${days} 天 ${hours} 小时`
  return `${hours} 小时`
})

const dateRange = computed(() => {
  const s = stats.value.timeStart
  if (!s) return '无数据'
  const e = stats.value.timeEnd
  const pad = n => String(n).padStart(2, '0')
  return `${s.getFullYear()}-${pad(s.getMonth()+1)}-${pad(s.getDate())} ~ ${e.getFullYear()}-${pad(e.getMonth()+1)}-${pad(e.getDate())}`
})

fetchData(168)
</script>

<style>
.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: var(--bg);
  background-image: var(--bg-gradient);
}
.loader {
  text-align: center;
}
.loader-ring {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(64,158,255,0.1);
  border-top-color: #409eff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 20px;
}
@keyframes spin { to { transform: rotate(360deg); } }
.loader-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 8px;
}
.loader-sub {
  font-size: 13px;
  color: var(--text-muted);
}
.loader.error .loader-icon {
  font-size: 36px;
  margin-bottom: 16px;
}
.loader.error .loader-text {
  color: var(--danger);
}
</style>
