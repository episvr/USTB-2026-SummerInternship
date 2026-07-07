<template>
  <div class="dashboard">
    <header class="dashboard__header">
      <div>
        <h1 class="dashboard__title">Post Display Dashboard</h1>
        <p class="dashboard__subtitle">帖子数量 · 标签分布 · 敏感舆论管控</p>
      </div>
      <div class="dashboard__time">{{ currentTime }}</div>
    </header>

    <section class="dashboard__grid">
      <StatCard
        icon="📊"
        label="总帖数"
        :value="stats.totalPosts"
        variant="primary"
        trend="↑ 3.2% 较上周"
      />
      <StatCard
        icon="📝"
        label="今日发帖"
        :value="stats.todayPosts"
        variant="accent"
        trend="↑ 8.1% 较昨日"
      />
      <StatCard
        icon="⚠️"
        label="敏感帖数"
        :value="stats.sensitivePosts"
        variant="warning"
      />
      <StatCard
        icon="🔒"
        label="待处理"
        :value="stats.pendingReview"
        variant="danger"
      />
    </section>

    <section class="dashboard__main">
      <TrendChart
        title="发帖趋势监控"
        :dates="trendData.dates"
        :posts="trendData.posts"
        :sensitive="trendData.sensitive"
      />
      <SentimentChart
        title="舆情情感分布"
        :data="sentimentData"
      />
    </section>

    <section class="dashboard__bottom">
      <TagCloud :tags="tagData" />
      <SensitiveMonitor :posts="sensitivePosts" />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import StatCard from './components/StatCard.vue'
import TrendChart from './components/TrendChart.vue'
import SentimentChart from './components/SentimentChart.vue'
import TagCloud from './components/TagCloud.vue'
import SensitiveMonitor from './components/SensitiveMonitor.vue'
import {
  mockStats as stats,
  trendData,
  sentimentData,
  tagData,
  sensitivePosts
} from './mock/data.js'

const currentTime = ref('')
let timer = null

const updateTime = () => {
  currentTime.value = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.card__subtitle {
  font-size: 0.75rem;
  color: var(--muted);
  margin-left: 0.5rem;
  text-transform: none;
  font-weight: 400;
}
</style>
