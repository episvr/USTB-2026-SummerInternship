<template>
  <ChPanel title="磁盘使用率分布（全部采样点）" sub="所有磁盘的 util 指标" half chartId="metricDist" :option="option" :height="320" />
</template>

<script setup>
import { computed } from 'vue'
import * as echarts from 'echarts'
import ChPanel from './ChPanel.vue'
import { getMetricDistribution } from '../parser.js'

const props = defineProps({ values: { type: Array, default: () => [] } })

const dist = computed(() => getMetricDistribution(props.values.filter(v => v != null && !isNaN(v)), 20))

const option = computed(() => ({
  tooltip: {
    trigger: 'axis', axisPointer: { type: 'shadow' },
    backgroundColor: 'rgba(11,17,32,0.9)',
    borderColor: 'rgba(255,255,255,0.08)',
    formatter: params => `${params[0].axisValue}<br />采样点数: <strong>${params[0].value}</strong>`,
  },
  grid: { left: 60, right: 20, top: 15, bottom: 50 },
  xAxis: {
    type: 'category',
    data: dist.value.map(d => d.range),
    axisLabel: { rotate: 45, fontSize: 9, color: '#94a3b8' },
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    splitLine: { show: false },
  },
  yAxis: {
    type: 'value', name: '采样点数',
    nameTextStyle: { color: '#94a3b8', fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)', type: 'dashed' } },
    axisLabel: { color: '#94a3b8' },
  },
  series: [{
    type: 'bar',
    data: dist.value.map(d => d.count),
    barWidth: '75%',
    itemStyle: {
      borderRadius: [2, 2, 0, 0],
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#10b981' },
        { offset: 0.5, color: '#f59e0b' },
        { offset: 1, color: '#ef4444' },
      ])
    },
  }],
  backgroundColor: 'transparent',
}))
</script>
