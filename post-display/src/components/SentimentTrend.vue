<template>
  <div class="card">
    <div class="card__title">{{ title }}</div>
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  title: String,
  dates: Array,
  positive: Array,
  neutral: Array,
  negative: Array
})

const chartRef = ref(null)
let chart = null

const initChart = () => {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value, 'dark')
  setOption()
  window.addEventListener('resize', handleResize)
}

const setOption = () => {
  if (!chart) return
  chart.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['正面', '中性', '负面'],
      textStyle: { color: '#94a3b8' },
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '18%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: props.dates,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94a3b8' }
    },
    yAxis: {
      type: 'value',
      max: 100,
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#94a3b8', formatter: '{value}%' }
    },
    series: [
      {
        name: '正面',
        type: 'line',
        smooth: true,
        stack: 'total',
        areaStyle: { color: 'rgba(34, 197, 94, 0.3)' },
        lineStyle: { color: '#22c55e' },
        itemStyle: { color: '#22c55e' },
        data: props.positive
      },
      {
        name: '中性',
        type: 'line',
        smooth: true,
        stack: 'total',
        areaStyle: { color: 'rgba(100, 116, 139, 0.3)' },
        lineStyle: { color: '#64748b' },
        itemStyle: { color: '#64748b' },
        data: props.neutral
      },
      {
        name: '负面',
        type: 'line',
        smooth: true,
        stack: 'total',
        areaStyle: { color: 'rgba(239, 68, 68, 0.3)' },
        lineStyle: { color: '#ef4444' },
        itemStyle: { color: '#ef4444' },
        data: props.negative
      }
    ]
  }, true)
}

const handleResize = () => chart?.resize()

onMounted(initChart)
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})

watch(() => [props.dates, props.positive, props.neutral, props.negative], setOption, { deep: true })
</script>

<style scoped>
.chart {
  width: 100%;
  height: 240px;
}
</style>
