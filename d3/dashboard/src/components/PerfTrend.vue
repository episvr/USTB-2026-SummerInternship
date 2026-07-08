<template>
  <ChPanel title="CPU & 内存趋势（按小时聚合）" sub="CPU 使用率 · 已用内存" full chartId="perfTrend" :option="option" :height="320" />
</template>

<script setup>
import { computed } from 'vue'
import * as echarts from 'echarts'
import ChPanel from './ChPanel.vue'

const props = defineProps({ data: Array })

const option = computed(() => ({
  color: ['#f59e0b', '#8b5cf6'],
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(11,17,32,0.9)',
    borderColor: 'rgba(255,255,255,0.08)',
    textStyle: { color: '#e8edf5', fontSize: 12 },
  },
  legend: {
    data: ['CPU使用率%', '已用内存MB'],
    bottom: 0,
    textStyle: { color: '#94a3b8', fontSize: 11 },
  },
  grid: { left: 60, right: 70, top: 30, bottom: 44 },
  xAxis: {
    type: 'category',
    data: props.data.map(d => d.hour.slice(5)),
    axisLabel: { rotate: 35, fontSize: 10, color: '#94a3b8' },
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    splitLine: { show: false },
  },
  yAxis: [
    {
      type: 'value', name: 'CPU %',
      nameTextStyle: { color: '#94a3b8', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)', type: 'dashed' } },
      axisLabel: { color: '#94a3b8' },
      max: 100,
    },
    {
      type: 'value', name: '内存 MB', position: 'right',
      nameTextStyle: { color: '#94a3b8', fontSize: 10 },
      splitLine: { show: false },
      axisLabel: { color: '#94a3b8' },
    },
  ],
  series: [
    {
      name: 'CPU使用率%', type: 'line', data: props.data.map(d => d.avgCpu),
      connectNulls: true, smooth: true, symbol: 'none', lineStyle: { width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(245,158,11,0.3)' },
          { offset: 1, color: 'rgba(245,158,11,0.02)' },
        ])
      },
    },
    {
      name: '已用内存MB', type: 'line', yAxisIndex: 1, data: props.data.map(d => d.avgMem),
      connectNulls: true, smooth: true, symbol: 'none', lineStyle: { width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(139,92,246,0.3)' },
          { offset: 1, color: 'rgba(139,92,246,0.02)' },
        ])
      },
    },
  ],
  backgroundColor: 'transparent',
}))
</script>
