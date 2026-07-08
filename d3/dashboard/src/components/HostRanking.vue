<template>
  <ChPanel title="主机排行 Top 10（平均磁盘使用率）" sub="按 sda_util 降序" half chartId="hostRank" :option="option" :height="320" />
</template>

<script setup>
import { computed } from 'vue'
import * as echarts from 'echarts'
import ChPanel from './ChPanel.vue'

const props = defineProps({ data: Array })

const top = computed(() => {
  const valid = props.data.filter(h => h.avg.sda_util != null)
  valid.sort((a, b) => b.avg.sda_util - a.avg.sda_util)
  return valid.slice(0, 10)
})

const option = computed(() => ({
  tooltip: {
    trigger: 'axis', axisPointer: { type: 'shadow' },
    backgroundColor: 'rgba(11,17,32,0.9)',
    borderColor: 'rgba(255,255,255,0.08)',
    formatter: params => {
      const d = params[0]
      return `<strong>${d.axisValue}</strong><br />平均使用率: <strong>${d.value}%</strong>`
    },
  },
  grid: { left: 110, right: 30, top: 10, bottom: 20 },
  xAxis: {
    type: 'value', name: '使用率 %', max: 100,
    nameTextStyle: { color: '#94a3b8', fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)', type: 'dashed' } },
    axisLabel: { color: '#94a3b8' },
  },
  yAxis: {
    type: 'category',
    data: top.value.map(d => d.hostname).reverse(),
    axisLabel: { fontSize: 10, color: '#e8edf5' },
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    splitLine: { show: false },
  },
  series: [{
    type: 'bar',
    data: top.value.map(d => d.avg.sda_util).reverse(),
    barWidth: '60%',
    itemStyle: {
      borderRadius: [0, 4, 4, 0],
      color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: '#3b82f6' },
        { offset: 0.5, color: '#6366f1' },
        { offset: 1, color: '#8b5cf6' },
      ])
    },
    label: {
      show: true,
      position: 'right',
      formatter: '{c}%',
      fontSize: 11,
      color: '#94a3b8',
      fontWeight: 600,
    },
  }],
  backgroundColor: 'transparent',
}))
</script>
