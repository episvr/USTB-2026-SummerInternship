<template>
  <div class="panel" style="grid-column: span 3;">
    <div class="panel-header">
      <div class="panel-title">
        <span class="panel-dot"></span>
        <h3>数据完整性</h3>
      </div>
      <span class="panel-sub">{{ data?.hourCount || 0 }} 小时 × {{ data?.hostCount || 0 }} 台主机</span>
    </div>
    <div class="panel-body">
      <div class="quality-grid" v-if="data">
        <div class="q-item">
          <div class="q-value">{{ data.hourCount }}</div>
          <div class="q-label">时间窗口（小时）</div>
        </div>
        <div class="q-item">
          <div class="q-value">{{ data.hostCount }}</div>
          <div class="q-label">纳入主机</div>
        </div>
        <div class="q-item">
          <div class="q-value" :style="{ color: diskColor }">{{ data.diskCompleteness }}%</div>
          <div class="q-label">
            <span class="q-dot" :style="{ background: diskColor }"></span>
            磁盘完整率
          </div>
        </div>
        <div class="q-item">
          <div class="q-value" :style="{ color: prefColor }">{{ data.prefCompleteness }}%</div>
          <div class="q-label">
            <span class="q-dot" :style="{ background: prefColor }"></span>
            性能完整率
          </div>
        </div>
      </div>
      <div ref="chartRef" style="height:180px;margin-top:4px;"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({ data: Object, perMod: Object })
const chartRef = ref(null)
let chart = null

const diskColor = computed(() => (props.data?.diskCompleteness || 0) > 80 ? '#10b981' : '#f59e0b')
const prefColor = computed(() => (props.data?.prefCompleteness || 0) > 80 ? '#10b981' : '#f59e0b')

const modArray = computed(() => {
  if (!props.perMod) return []
  return Object.entries(props.perMod)
    .map(([mod, v]) => ({ mod, ...v }))
    .sort((a, b) => a.rate - b.rate)
})

const option = computed(() => ({
  tooltip: {
    trigger: 'axis', axisPointer: { type: 'shadow' },
    backgroundColor: 'rgba(11,17,32,0.9)',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  grid: { left: 120, right: 30, top: 5, bottom: 20 },
  xAxis: {
    type: 'value', name: '完整率 %', max: 100,
    nameTextStyle: { color: '#94a3b8', fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)', type: 'dashed' } },
    axisLabel: { color: '#94a3b8' },
  },
  yAxis: {
    type: 'category', data: modArray.value.map(d => d.mod).reverse(),
    axisLabel: { fontSize: 9, color: '#94a3b8' },
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    splitLine: { show: false },
  },
  series: [{
    type: 'bar',
    data: modArray.value.map(d => d.rate).reverse(),
    barWidth: '55%',
    itemStyle: {
      borderRadius: [0, 3, 3, 0],
      color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: '#ef4444' },
        { offset: 0.5, color: '#f59e0b' },
        { offset: 1, color: '#10b981' },
      ])
    },
  }],
  backgroundColor: 'transparent',
}))

function initChart() {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value, 'dark')
  chart.setOption(option.value, true)
}

function resize() { chart?.resize() }

onMounted(() => {
  nextTick(() => {
    initChart()
    window.addEventListener('resize', resize)
  })
})
onUnmounted(() => {
  chart?.dispose()
  window.removeEventListener('resize', resize)
})

watch(option, (o) => { if (chart && o) chart.setOption(o, true) }, { deep: true })
</script>

<style scoped>
.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
}
.panel-dot {
  width: 4px;
  height: 16px;
  border-radius: 2px;
  background: linear-gradient(180deg, #10b981, #34d399);
  flex-shrink: 0;
}
.quality-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.q-item {
  background: rgba(255,255,255,0.03);
  border-radius: 8px;
  padding: 10px;
  text-align: center;
}
.q-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 20px;
  font-weight: 700;
  color: #e8edf5;
  line-height: 1.2;
}
.q-label {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.q-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
</style>
