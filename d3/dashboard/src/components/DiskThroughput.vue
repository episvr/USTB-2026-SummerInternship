<template>
  <ChPanel title="磁盘吞吐量趋势" sub="每秒读写扇区 + 合并读请求" half chartId="diskThroughput" :option="option" :height="300" />
</template>

<script setup>
import { computed } from 'vue'
import * as echarts from 'echarts'
import ChPanel from './ChPanel.vue'

const props = defineProps({ data: Array })

const option = computed(() => ({
  color: ['#409eff', '#10b981', '#8b5cf6'],
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(11,17,32,0.9)',
    borderColor: 'rgba(255,255,255,0.08)',
    textStyle: { color: '#e8edf5', fontSize: 12 },
  },
  legend: {
    data: ['每秒读取扇区', '每秒写入扇区', '合并读请求/s'],
    bottom: 0,
    textStyle: { color: '#94a3b8', fontSize: 11 },
  },
  grid: { left: 55, right: 25, top: 25, bottom: 44 },
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
      name: '每秒读取扇区', type: 'line', data: props.data.map(d => d.avgRead),
      connectNulls: true, smooth: true, symbol: 'none', lineStyle: { width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(64,158,255,0.25)' },
          { offset: 1, color: 'rgba(64,158,255,0.02)' },
        ])
      },
    },
    {
      name: '每秒写入扇区', type: 'line', data: props.data.map(d => d.avgWrite),
      connectNulls: true, smooth: true, symbol: 'none', lineStyle: { width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(16,185,129,0.2)' },
          { offset: 1, color: 'rgba(16,185,129,0.02)' },
        ])
      },
    },
    {
      name: '合并读请求/s', type: 'line', data: props.data.map(d => d.avgRqm),
      connectNulls: true, smooth: true, symbol: 'none', lineStyle: { width: 2, type: 'dashed' },
    },
  ],
  backgroundColor: 'transparent',
}))
</script>
