<template>
  <ChPanel title="磁盘使用率 & IO 等待" sub="sda_util · sda_await 按小时聚合趋势" half chartId="diskTrend" :option="option" :height="300" />
</template>

<script setup>
import { computed } from 'vue'
import * as echarts from 'echarts'
import ChPanel from './ChPanel.vue'

const props = defineProps({ data: Array })

const option = computed(() => ({
  color: ['#f59e0b', '#ef4444'],
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(11,17,32,0.9)',
    borderColor: 'rgba(255,255,255,0.08)',
    textStyle: { color: '#e8edf5', fontSize: 12 },
  },
  legend: {
    data: ['磁盘使用率%', 'IO等待ms'],
    bottom: 0,
    textStyle: { color: '#94a3b8', fontSize: 11 },
  },
  grid: { left: 50, right: 20, top: 25, bottom: 44 },
  xAxis: {
    type: 'category',
    data: props.data.map(d => d.hour.slice(5)),
    axisLabel: { rotate: 30, fontSize: 9, color: '#94a3b8', interval: 2 },
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    splitLine: { show: false },
  },
  yAxis: {
    type: 'value',
    nameTextStyle: { color: '#94a3b8', fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)', type: 'dashed' } },
    axisLabel: { color: '#94a3b8' },
  },
  series: [
    {
      name: '磁盘使用率%', type: 'line', data: props.data.map(d => d.avgUtil),
      connectNulls: true, smooth: true, symbol: 'none', lineStyle: { width: 2.5 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(245,158,11,0.3)' },
          { offset: 1, color: 'rgba(245,158,11,0.02)' },
        ])
      },
    },
    {
      name: 'IO等待ms', type: 'line', data: props.data.map(d => d.avgAwait),
      connectNulls: true, smooth: true, symbol: 'none', lineStyle: { width: 2.5 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(239,68,68,0.2)' },
          { offset: 1, color: 'rgba(239,68,68,0.02)' },
        ])
      },
    },
  ],
  backgroundColor: 'transparent',
}))
</script>
