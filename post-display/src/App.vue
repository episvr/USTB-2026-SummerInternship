<template>
  <div v-if="loading" class="dashboard__loading">
    <div class="dashboard__loading-spinner"></div>
    <p>加载中...</p>
  </div>
  <div v-else class="dashboard">
    <header class="dashboard__header">
      <div>
        <h1 class="dashboard__title">Post Display 数据大屏</h1>
        <p class="dashboard__subtitle">全站帖文 · 舆情态势 · 敏感管控 · 用户行为</p>
      </div>
      <div class="dashboard__time">{{ currentTime }}</div>
    </header>

    <section class="dashboard__stats">
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
        trend="↓ 5 条 较昨日"
      />
      <StatCard
        icon="🔒"
        label="待处理"
        :value="stats.pendingReview"
        variant="danger"
      />
      <StatCard
        icon="👥"
        label="活跃用户"
        :value="stats.activeUsers"
        variant="success"
        trend="↑ 2.4% 较上周"
      />
      <StatCard
        icon="🤖"
        label="AI 识别率"
        :value="stats.aiDetectRate"
        variant="info"
        trend="%"
      />
    </section>

    <section class="dashboard__main">
      <div class="dashboard__main-hero">
        <TrendChart
          hero
          title="24 小时发帖趋势监控"
          :dates="trendData.dates"
          :posts="trendData.posts"
          :sensitive="trendData.sensitive"
        />
      </div>
      <SentimentChart
        title="舆情情感分布"
        :data="sentimentData"
      />
      <RiskGauge
        title="综合风险指数"
        :value="stats.riskScore"
      />
    </section>

    <section class="dashboard__row">
      <SentimentTrend
        title="情感趋势走势"
        :dates="sentimentTrend.dates"
        :positive="sentimentTrend.positive"
        :neutral="sentimentTrend.neutral"
        :negative="sentimentTrend.negative"
      />
      <ActivityHeatmap
        title="用户活跃热力图"
        :data="activityHeatmap"
      />
      <PlatformBar
        title="内容来源平台占比"
        :data="platformData"
      />
    </section>

    <section class="dashboard__row-4">
      <TagCloud :tags="tagData" />
      <KeywordRank :keywords="keywordRank" />
      <TopUsers :users="topUsers" />
      <RecentActivity :activities="recentActivity" />
    </section>

    <section class="dashboard__bottom">
      <TopicRadar
        title="话题维度分析"
        :indicators="topicRadar.indicators"
        :data="topicRadar.data"
      />
      <SensitiveMonitor :posts="sensitivePosts" />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import StatCard from './components/StatCard.vue'
import TrendChart from './components/TrendChart.vue'
import SentimentChart from './components/SentimentChart.vue'
import RiskGauge from './components/RiskGauge.vue'
import SentimentTrend from './components/SentimentTrend.vue'
import ActivityHeatmap from './components/ActivityHeatmap.vue'
import PlatformBar from './components/PlatformBar.vue'
import TagCloud from './components/TagCloud.vue'
import KeywordRank from './components/KeywordRank.vue'
import TopUsers from './components/TopUsers.vue'
import RecentActivity from './components/RecentActivity.vue'
import TopicRadar from './components/TopicRadar.vue'
import SensitiveMonitor from './components/SensitiveMonitor.vue'
import { fetchAllDashboardData } from './api.js'

const stats = ref({})
const trendData = ref({ dates: [], posts: [], sensitive: [] })
const sentimentData = ref({ positive: 0, neutral: 0, negative: 0 })
const sentimentTrend = ref({ dates: [], positive: [], neutral: [], negative: [] })
const activityHeatmap = ref([])
const platformData = ref([])
const topicRadar = ref({ indicators: [], data: [] })
const keywordRank = ref([])
const topUsers = ref([])
const recentActivity = ref([])
const tagData = ref([])
const sensitivePosts = ref([])

const loading = ref(true)
const currentTime = ref('')
let timer = null
let refreshTimer = null

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

const loadData = async () => {
  try {
    const data = await fetchAllDashboardData()
    stats.value = data.stats
    trendData.value = data.trendData
    sentimentData.value = data.sentimentData
    sentimentTrend.value = data.sentimentTrend
    activityHeatmap.value = data.activityHeatmap
    platformData.value = data.platformData
    topicRadar.value = data.topicRadar
    keywordRank.value = data.keywordRank
    topUsers.value = data.topUsers
    recentActivity.value = data.recentActivity
    tagData.value = data.tagData
    sensitivePosts.value = data.sensitivePosts
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  loadData()
  refreshTimer = setInterval(loadData, 15000)
})

onUnmounted(() => {
  clearInterval(timer)
  clearInterval(refreshTimer)
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

.dashboard__loading {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--muted);
  font-size: 1.1rem;
}

.dashboard__loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
