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
  value: Number
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
    series: [{
      type: 'gauge',
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      splitNumber: 10,
      itemStyle: { color: getColor(props.value) },
      progress: {
        show: true,
        width: 18
      },
      pointer: { show: false },
      axisLine: {
        lineStyle: { width: 18, color: [[1, '#1e293b']] }
      },
      axisTick: { show: false },
      splitLine: {
        length: 10,
        lineStyle: { width: 2, color: '#94a3b8' }
      },
      axisLabel: {
        distance: 20,
        color: '#94a3b8',
        fontSize: 10
      },
      anchor: { show: false },
      title: {
        show: true,
        offsetCenter: [0, '40%'],
        color: '#94a3b8',
        fontSize: 12
      },
      detail: {
        valueAnimation: true,
        fontSize: 36,
        fontWeight: 'bold',
        offsetCenter: [0, '10%'],
        formatter: '{value}',
        color: '#e2e8f0'
      },
      data: [{ value: props.value, name: '风险指数' }]
    }]
  }, true)
}

const getColor = (val) => {
  if (val >= 80) return '#ef4444'
  if (val >= 60) return '#f59e0b'
  return '#22c55e'
}

const handleResize = () => chart?.resize()

onMounted(initChart)
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})

watch(() => props.value, setOption)
</script>

<style scoped>
.chart {
  width: 100%;
  height: 240px;
}
</style>
