<template>
  <ChPanel title="磁盘使用率 vs IO 等待" sub="逐小时散点 · 可观察相关性" half chartId="utilAwaitScatter" :option="option" :height="300" />
</template>

<script setup>
import { computed } from 'vue'
import * as echarts from 'echarts'
import ChPanel from './ChPanel.vue'

const props = defineProps({ data: Array })

const option = computed(() => ({
  color: ['#6366f1'],
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(11,17,32,0.9)',
    borderColor: 'rgba(255,255,255,0.08)',
    textStyle: { color: '#e8edf5', fontSize: 12 },
    formatter: params => `使用率: <strong>${params.value[0]}%</strong><br />IO等待: <strong>${params.value[1]}ms</strong>`,
  },
  grid: { left: 55, right: 25, top: 25, bottom: 30 },
  xAxis: {
    type: 'value', name: '磁盘使用率 %',
    nameTextStyle: { color: '#94a3b8', fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)', type: 'dashed' } },
    axisLabel: { color: '#94a3b8', fontSize: 10 },
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
  },
  yAxis: {
    type: 'value', name: 'IO等待 ms',
    nameTextStyle: { color: '#94a3b8', fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)', type: 'dashed' } },
    axisLabel: { color: '#94a3b8', fontSize: 10 },
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
  },
  series: [{
    type: 'scatter',
    data: props.data.map(d => [d.util, d.await]),
    symbolSize: 6,
    itemStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
        { offset: 0, color: '#6366f1' },
        { offset: 1, color: '#ec4899' },
      ]),
      opacity: 0.7,
    },
  }],
  backgroundColor: 'transparent',
}))
</script>
