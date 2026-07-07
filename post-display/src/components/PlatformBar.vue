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
  data: Array
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
    animationDurationUpdate: 800,
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: {
      left: '3%',
      right: '8%',
      bottom: '3%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#94a3b8', formatter: '{value}%' }
    },
    yAxis: {
      type: 'category',
      data: props.data.map(d => d.name),
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94a3b8' }
    },
    series: [{
      type: 'bar',
      data: props.data.map(d => ({
        value: d.value,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: '#3b82f6' },
              { offset: 1, color: '#8b5cf6' }
            ]
          }
        }
      })),
      barWidth: '55%',
      label: {
        show: true,
        position: 'right',
        color: '#e2e8f0',
        formatter: '{c}%'
      },
      itemStyle: { borderRadius: [0, 6, 6, 0] }
    }]
  }, true)
}

const handleResize = () => chart?.resize()

onMounted(initChart)
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})

watch(() => props.data, setOption, { deep: true })
</script>

<style scoped>
.chart {
  width: 100%;
  height: 220px;
}
</style>
