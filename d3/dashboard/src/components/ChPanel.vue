<template>
  <div class="panel panel-chart" :style="{ gridColumn: full ? 'span 6' : half ? 'span 3' : 'span 1' }">
    <div class="panel-header">
      <div class="panel-title">
        <span class="panel-dot"></span>
        <h3>{{ title }}</h3>
      </div>
      <span class="panel-sub" v-if="sub">{{ sub }}</span>
    </div>
    <div class="panel-body" ref="chartRef" :style="{ height: height + 'px' }">
      <slot v-if="!chartId"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  title: String, sub: String,
  full: { type: Boolean, default: false },
  half: { type: Boolean, default: false },
  chartId: String,
  option: Object,
  height: { type: Number, default: 280 },
})
const chartRef = ref(null)
let chart = null

function initChart() {
  if (!chartRef.value || !props.chartId) return
  chart = echarts.init(chartRef.value, 'dark')
  if (props.option) chart.setOption(props.option, true)
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

watch(() => props.option, (o) => {
  if (chart && o) {
    chart.setOption(o, true)
  }
}, { deep: true })

watch(() => props.chartId, () => {
  chart?.dispose()
  nextTick(() => initChart())
})
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
  background: linear-gradient(180deg, #409eff, #00d4ff);
  flex-shrink: 0;
}
</style>
