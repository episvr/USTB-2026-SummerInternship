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
  indicators: Array,
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
    tooltip: { trigger: 'item' },
    radar: {
      indicator: props.indicators,
      shape: 'polygon',
      splitNumber: 4,
      axisName: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#334155' } },
      splitArea: {
        areaStyle: {
          color: ['rgba(59,130,246,0.02)', 'rgba(59,130,246,0.06)', 'rgba(59,130,246,0.1)', 'rgba(59,130,246,0.14)']
        }
      },
      axisLine: { lineStyle: { color: '#334155' } }
    },
    series: [{
      type: 'radar',
      data: [{
        value: props.data,
        name: '话题热度',
        areaStyle: {
          color: 'rgba(139, 92, 246, 0.3)'
        },
        lineStyle: { color: '#8b5cf6', width: 2 },
        itemStyle: { color: '#8b5cf6' },
        symbol: 'circle',
        symbolSize: 6
      }]
    }]
  }, true)
}

const handleResize = () => chart?.resize()

onMounted(initChart)
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})

watch(() => [props.indicators, props.data], setOption, { deep: true })
</script>

<style scoped>
.chart {
  width: 100%;
  height: 260px;
}
</style>
