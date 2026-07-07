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

const hours = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

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
    tooltip: {
      position: 'top',
      formatter: (p) => `${p.name}<br/>活跃度: <b>${p.data[2]}</b>`
    },
    grid: {
      left: '12%',
      right: '5%',
      top: '5%',
      bottom: '15%'
    },
    xAxis: {
      type: 'category',
      data: hours,
      splitArea: { show: true },
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94a3b8' }
    },
    yAxis: {
      type: 'category',
      data: days,
      splitArea: { show: true },
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94a3b8' }
    },
    visualMap: {
      min: 0,
      max: 250,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      inRange: {
        color: ['#0d1733', '#3b82f6', '#8b5cf6', '#ef4444']
      },
      textStyle: { color: '#94a3b8' }
    },
    series: [{
      name: '活跃度',
      type: 'heatmap',
      data: props.data,
      label: { show: false },
      itemStyle: {
        borderRadius: 4,
        borderColor: '#0d1733',
        borderWidth: 2
      },
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' }
      }
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
  height: 260px;
}
</style>
