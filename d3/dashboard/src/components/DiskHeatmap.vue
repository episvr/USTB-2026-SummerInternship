<template>
  <ChPanel title="磁盘使用率热力图（主机 × 时间）" sub="颜色越深表示磁盘越繁忙" full chartId="diskHeatmap" :option="option" :height="320" />
</template>

<script setup>
import { computed } from 'vue'
import * as echarts from 'echarts'
import ChPanel from './ChPanel.vue'

const props = defineProps({ data: Object })

const option = computed(() => {
  const d = props.data
  if (!d || !d.data || !d.data.length) return {}
  const hosts = d.hosts
  const hours = d.hours
  const maxVal = Math.max(d.valueMax, 1)
  return {
    tooltip: {
      position: 'top',
      backgroundColor: 'rgba(11,17,32,0.95)',
      borderColor: 'rgba(255,255,255,0.08)',
      textStyle: { color: '#e8edf5', fontSize: 12 },
      formatter: params => `${params.value[1]} @ ${params.value[0]}<br />磁盘使用率: <strong>${params.value[2]}%</strong>`,
    },
    grid: { left: 85, right: 30, top: 10, bottom: 50 },
    xAxis: {
      type: 'category', data: hours.map(h => h.slice(5)),
      splitArea: { show: true, areaStyle: { color: ['rgba(255,255,255,0.01)', 'rgba(255,255,255,0.02)'] } },
      axisLabel: { rotate: 40, fontSize: 9, color: '#94a3b8', interval: 3 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    },
    yAxis: {
      type: 'category', data: hosts,
      splitArea: { show: true, areaStyle: { color: ['rgba(255,255,255,0.01)', 'rgba(255,255,255,0.02)'] } },
      axisLabel: { fontSize: 10, color: '#e8edf5' },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    },
    visualMap: {
      min: 0, max: maxVal,
      calculable: true,
      orient: 'horizontal',
      left: 'center', bottom: 0,
      textStyle: { color: '#94a3b8', fontSize: 10 },
      inRange: {
        color: ['#0c4a6e', '#0369a1', '#0ea5e9', '#f59e0b', '#ef4444', '#7f1d1d'],
      },
    },
    series: [{
      type: 'heatmap',
      data: d.data.filter(v => v[2] != null).map(v => [v[0].slice(5), v[1], v[2]]),
      label: { show: false },
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' },
      },
    }],
    backgroundColor: 'transparent',
  }
})
</script>
