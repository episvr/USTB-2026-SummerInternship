import { faker } from '@faker-js/faker/locale/zh_CN'

faker.seed(42)

const TAG_NAMES = [
  'politics', 'economy', 'technology', 'sports', 'health', 'environment',
  'education', 'entertainment', 'security', 'culture', 'finance', 'travel',
  'food', 'fashion', 'automotive', 'military', 'gaming', 'movie', 'music',
  'literature', 'law', 'agriculture', 'energy', 'space', 'history',
]

const SENTIMENTS = ['positive', 'neutral', 'negative']

const LEVELS = ['low', 'medium', 'high']

const STATUSES = ['blocked', 'reviewing', 'resolved']

const SOURCES = ['web', 'ios', 'android', 'mini']

const REPORTERS = ['AI自动', '用户举报', '人工巡检', '企业举报']

const TYPES = ['text', 'image', 'video', 'audio']

const ACTIVITY_HOURS = [
  '00:00', '02:00', '04:00', '06:00', '08:00', '10:00',
  '12:00', '14:00', '16:00', '18:00', '20:00', '22:00',
]

const ACTIVITY_DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

const CATEGORIES = [
  { name: '科技', weight: 23.2 },
  { name: '财经', weight: 17.3 },
  { name: '社会', weight: 15.9 },
  { name: '娱乐', weight: 13.0 },
  { name: '健康', weight: 10.0 },
  { name: '教育', weight: 7.9 },
  { name: '体育', weight: 6.8 },
  { name: '环境', weight: 5.8 },
]

const KEYWORD_POOL = [
  { word: '人工智能', category: '科技' }, { word: '股市行情', category: '财经' },
  { word: '奥运赛事', category: '体育' }, { word: '新能源汽车', category: '科技' },
  { word: '教育改革', category: '教育' }, { word: '房价走势', category: '财经' },
  { word: '医疗保障', category: '健康' }, { word: '就业形势', category: '社会' },
  { word: '环境保护', category: '环境' }, { word: '乡村振兴', category: '社会' },
  { word: '芯片突破', category: '科技' }, { word: '食品安全', category: '健康' },
  { word: '文化旅游', category: '文化' }, { word: '网络诈骗', category: '安全' },
  { word: '养老政策', category: '社会' }, { word: '航天探索', category: '科技' },
  { word: '跨境电商', category: '财经' }, { word: '电子竞技', category: '娱乐' },
  { word: '短视频', category: '娱乐' }, { word: '熬夜危害', category: '健康' },
  { word: '量子计算', category: '科技' }, { word: '人民币汇率', category: '财经' },
  { word: '人口普查', category: '社会' }, { word: '高考改革', category: '教育' },
  { word: '中美贸易', category: '财经' }, { word: '元宇宙', category: '科技' },
  { word: '数字人民币', category: '财经' }, { word: '碳中和', category: '环境' },
  { word: '房地产税', category: '财经' }, { word: '预制菜', category: '美食' },
  { word: '直播带货', category: '娱乐' }, { word: '家庭教育', category: '教育' },
  { word: '抑郁症', category: '健康' }, { word: '网约车', category: '社会' },
  { word: '双碳目标', category: '环境' }, { word: '生物医药', category: '健康' },
  { word: '地缘政治', category: '政治' }, { word: '台海局势', category: '政治' },
  { word: '6G技术', category: '科技' }, { word: '脑机接口', category: '科技' },
]

const TRENDS = ['up', 'down', 'stable']

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function picks(arr, min, max) {
  const n = faker.number.int({ min, max })
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

function weightedIndex(weights) {
  const total = weights.reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i]
    if (r <= 0) return i
  }
  return weights.length - 1
}

function randomHourMinute() {
  return `${String(faker.number.int({ min: 0, max: 23 })).padStart(2, '0')}:${String(faker.number.int({ min: 0, max: 59 })).padStart(2, '0')}`
}

function randomDateWithin(daysBack) {
  const d = new Date()
  d.setDate(d.getDate() - faker.number.int({ min: 0, max: daysBack }))
  d.setHours(faker.number.int({ min: 0, max: 23 }))
  d.setMinutes(faker.number.int({ min: 0, max: 59 }))
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// ──────────────────────────────────────────────
// 1. basic stats
// ──────────────────────────────────────────────
export const mockStats = {
  totalPosts: 124587,
  todayPosts: 3421,
  sensitivePosts: 186,
  pendingReview: 42,
  processedToday: 89,
  totalUsers: 892014,
  activeUsers: 124300,
  newUsers: 892,
  avgHandleTime: '4m 32s',
  engagementRate: 18.6,
  aiDetectRate: 94.2,
  riskScore: 72,
  totalComments: 489200,
  totalShares: 215600,
  totalLikes: 1253000,
  peakHourlyPosts: 1150,
  avgResponseTime: '2.3s',
  serverLoad: 68,
  apiCalls: 45800,
  moderationQueue: 73,
  autoBlockRate: 91.5,
  falsePositiveRate: 3.2,
  userSatisfaction: 87.4,
  dailyActiveUsers: 124300,
  weeklyActiveUsers: 498000,
  monthlyActiveUsers: 712000,
  retentionRate: 72.8,
  avgSessionDuration: '8m 45s',
  crossPlatformRatio: 34.2,
  todayPeak: '14:00',
  yesterdayPosts: 3280,
  weekAvgPosts: 3540,
}

// ──────────────────────────────────────────────
// 2. 24h trend
// ──────────────────────────────────────────────
export const trendData = {
  dates: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`),
  posts: [
    120, 85, 60, 45, 38, 55, 180, 420, 680, 820, 760, 890,
    950, 880, 790, 720, 680, 910, 1150, 980, 720, 540, 320, 180,
  ],
  sensitive: [
    8, 5, 3, 2, 4, 6, 12, 21, 34, 28, 31, 42,
    38, 29, 24, 19, 22, 35, 48, 41, 30, 18, 12, 9,
  ],
  engagement: [
    45, 32, 22, 18, 15, 25, 68, 145, 230, 280, 260, 310,
    330, 295, 260, 235, 220, 300, 410, 340, 250, 185, 110, 62,
  ],
  comments: [
    18, 12, 8, 5, 4, 9, 28, 62, 98, 125, 115, 140,
    150, 130, 115, 105, 100, 135, 180, 150, 110, 80, 48, 25,
  ],
  shares: [
    8, 5, 3, 2, 1, 4, 12, 28, 45, 55, 50, 65,
    70, 60, 50, 42, 38, 58, 85, 65, 48, 35, 20, 10,
  ],
}

// ──────────────────────────────────────────────
// 3. sentiment data
// ──────────────────────────────────────────────
export const sentimentData = {
  positive: 62,
  neutral: 24,
  negative: 14,
}

// ──────────────────────────────────────────────
// 4. sentiment trend (14 days)
// ──────────────────────────────────────────────
const SENTIMENT_DAYS = 14
const now = new Date()
const sentimentDates = Array.from({ length: SENTIMENT_DAYS }, (_, i) => {
  const d = new Date(now)
  d.setDate(d.getDate() - (SENTIMENT_DAYS - 1 - i))
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
})

let lastPos = 62, lastNeu = 24, lastNeg = 14
export const sentimentTrend = {
  dates: sentimentDates,
  positive: Array.from({ length: SENTIMENT_DAYS }, () => {
    lastPos = Math.max(50, Math.min(75, lastPos + faker.number.int({ min: -3, max: 3 })))
    return lastPos
  }),
  neutral: Array.from({ length: SENTIMENT_DAYS }, () => {
    lastNeu = Math.max(15, Math.min(35, lastNeu + faker.number.int({ min: -2, max: 2 })))
    return lastNeu
  }),
  negative: Array.from({ length: SENTIMENT_DAYS }, () => {
    lastNeg = Math.max(5, Math.min(25, lastNeg + faker.number.int({ min: -2, max: 2 })))
    return lastNeg
  }),
}

// ──────────────────────────────────────────────
// 5. sentiment by category
// ──────────────────────────────────────────────
export const sentimentByCategory = CATEGORIES.map(({ name }) => ({
  category: name,
  positive: faker.number.int({ min: 15, max: 75 }),
  neutral: faker.number.int({ min: 15, max: 45 }),
  negative: faker.number.int({ min: 3, max: 60 }),
}))

// ──────────────────────────────────────────────
// 6. platform distribution
// ──────────────────────────────────────────────
export const platformData = [
  { name: 'Web 端', value: 32.5 },
  { name: 'iOS App', value: 28.2 },
  { name: 'Android', value: 21.6 },
  { name: '小程序', value: 10.7 },
  { name: 'H5 页面', value: 4.8 },
  { name: 'PC 客户端', value: 2.2 },
]

// ──────────────────────────────────────────────
// 7. platform trend (12 weeks)
// ──────────────────────────────────────────────
export const platformTrend = Array.from({ length: 12 }, (_, i) => ({
  week: `第${25 + i}周`,
  web: faker.number.int({ min: 28, max: 36 }),
  ios: faker.number.int({ min: 25, max: 32 }),
  android: faker.number.int({ min: 18, max: 25 }),
  mini: faker.number.int({ min: 8, max: 14 }),
  h5: faker.number.int({ min: 3, max: 7 }),
  pc: faker.number.int({ min: 1, max: 5 }),
}))

// ──────────────────────────────────────────────
// 8. topic radar
// ──────────────────────────────────────────────
export const topicRadar = {
  indicators: [
    { name: '政治', max: 100 },
    { name: '经济', max: 100 },
    { name: '科技', max: 100 },
    { name: '社会', max: 100 },
    { name: '娱乐', max: 100 },
    { name: '健康', max: 100 },
    { name: '教育', max: 100 },
    { name: '环境', max: 100 },
  ],
  data: [78, 65, 82, 58, 72, 45, 38, 52],
}

// ──────────────────────────────────────────────
// 9. topic month trend (6 months)
// ──────────────────────────────────────────────
export const topicMonthTrend = Array.from({ length: 6 }, (_, i) => ({
  month: `${2 + i}月`,
  politics: faker.number.int({ min: 55, max: 85 }),
  economy: faker.number.int({ min: 50, max: 75 }),
  tech: faker.number.int({ min: 60, max: 90 }),
  social: faker.number.int({ min: 40, max: 65 }),
  entertainment: faker.number.int({ min: 55, max: 80 }),
  health: faker.number.int({ min: 35, max: 60 }),
}))

// ──────────────────────────────────────────────
// 10. activity heatmap (7d x 12 slots)
// ──────────────────────────────────────────────
export const activityHeatmap = (() => {
  const result = []
  ACTIVITY_DAYS.forEach((day, di) => {
    const dayBase = [15, 20, 10, 18, 25, 38, 42][di]
    const dayAmp = [8, 9, 7, 10, 12, 15, 18][di]
    ACTIVITY_HOURS.forEach((hour, hi) => {
      const hourBase = [5, 2, 1, 3, 6, 8, 7, 9, 6, 5, 7, 4][hi % 12]
      const variance = faker.number.int({ min: -3, max: 3 })
      result.push([day, hour, Math.max(0, dayBase + hourBase * dayAmp + variance)])
    })
  })
  return result
})()

// ──────────────────────────────────────────────
// 11. user geo distribution
// ──────────────────────────────────────────────
export const userGeoDistribution = [
  { region: '华东', users: 325000, percentage: 28.5 },
  { region: '华南', users: 218000, percentage: 19.1 },
  { region: '华北', users: 195000, percentage: 17.1 },
  { region: '华中', users: 142000, percentage: 12.4 },
  { region: '西南', users: 118000, percentage: 10.3 },
  { region: '东北', users: 72000, percentage: 6.3 },
  { region: '西北', users: 48000, percentage: 4.2 },
  { region: '港澳台', users: 24000, percentage: 2.1 },
]

// ──────────────────────────────────────────────
// 12. user age distribution
// ──────────────────────────────────────────────
export const userAgeDistribution = [
  { age: '18岁以下', percentage: 8 },
  { age: '18-24岁', percentage: 28 },
  { age: '25-34岁', percentage: 35 },
  { age: '35-44岁', percentage: 18 },
  { age: '45-54岁', percentage: 8 },
  { age: '55岁以上', percentage: 3 },
]

// ──────────────────────────────────────────────
// 13. top users (30 users)
// ──────────────────────────────────────────────
export const topUsers = Array.from({ length: 30 }, () => ({
  name: faker.person.fullName(),
  posts: faker.number.int({ min: 20, max: 150 }),
  followers: faker.number.int({ min: 5000, max: 150000 }),
  influence: faker.number.int({ min: 45, max: 99 }),
})).sort((a, b) => b.influence - a.influence)

// ──────────────────────────────────────────────
// 14. top users this week (20 users)
// ──────────────────────────────────────────────
export const topUsersWeek = Array.from({ length: 20 }, (_, i) => ({
  name: faker.person.fullName(),
  posts: faker.number.int({ min: 8, max: 35 }),
  engagement: faker.number.int({ min: 8000, max: 45000 }),
  rank: i + 1,
}))

// ──────────────────────────────────────────────
// 15. hourly distribution
// ──────────────────────────────────────────────
const HOUR_LABELS = [
  '00-02', '02-04', '04-06', '06-08', '08-10', '10-12',
  '12-14', '14-16', '16-18', '18-20', '20-22', '22-24',
]
const HOUR_BASE = [5.3, 2.5, 1.3, 5.3, 18.1, 24.8, 22.2, 17.0, 14.0, 19.9, 26.9, 13.2]
export const hourlyDistribution = HOUR_LABELS.map((hour, i) => ({
  hour,
  posts: Math.round(3421 * HOUR_BASE[i] / 100),
  percentage: HOUR_BASE[i],
}))

// ──────────────────────────────────────────────
// 16. keyword rank (40 keywords)
// ──────────────────────────────────────────────
export const keywordRank = KEYWORD_POOL.map(k => ({
  ...k,
  count: faker.number.int({ min: 800, max: 15000 }),
  trend: pick(TRENDS),
})).sort((a, b) => b.count - a.count)

// ──────────────────────────────────────────────
// 17. category breakdown
// ──────────────────────────────────────────────
export const categoryBreakdown = CATEGORIES.map(({ name, weight }) => ({
  name,
  posts: Math.round(124587 * weight / 100),
  percentage: weight,
  engagement: faker.number.int({ min: 40000, max: 200000 }),
}))

// ──────────────────────────────────────────────
// 18. tags (all TAG_NAMES with generated data)
// ──────────────────────────────────────────────
export const tagData = TAG_NAMES.map(name => ({
  name,
  count: faker.number.int({ min: 100, max: 10000 }),
  sentiment: pick(SENTIMENTS),
})).sort((a, b) => b.count - a.count)

// ──────────────────────────────────────────────
// 19. recent activity (50 entries)
// ──────────────────────────────────────────────
const ACTIVITY_ACTIONS = [
  { template: (t) => `系统拦截 1 条涉及${pick(['政治谣言', '虚假信息', '恶意攻击', '非法广告', '诈骗链接'])}的帖文，来源 IP ${t}`, type: 'warning' },
  { template: () => `用户「${pick(['民生热线', '财经观察员', '科技前沿', '体育快讯', '健康科普', '娱乐八卦', '法治在线', '国际时事'])}」发布热点话题，触达 ${faker.number.int({ min: 3, max: 30 })}.${faker.number.int({ min: 0, max: 9 })} 万人`, type: 'info' },
  { template: (t) => `AI 模型检测到 ${faker.number.int({ min: 1, max: 5 })} 条疑似敏感内容，已转人工复核队列`, type: 'warning' },
  { template: () => `「${pick(KEYWORD_POOL).word}」关键词热度突破 ${faker.number.int({ min: 5, max: 20 })}000，较昨日增长 ${faker.number.int({ min: 5, max: 30 })}%`, type: 'success' },
  { template: () => `新增 ${faker.number.int({ min: 20, max: 200 })} 条关于「${pick(KEYWORD_POOL).word}」的讨论帖文`, type: 'info' },
  { template: () => `审核团队处置完成 ${faker.number.int({ min: 3, max: 12 })} 条违规内容，平均用时 ${faker.number.int({ min: 2, max: 8 })} 分 ${faker.number.int({ min: 0, max: 59 })} 秒`, type: 'success' },
  { template: () => `「${pick(KEYWORD_POOL).word}」实时热度上升至第${faker.number.int({ min: 1, max: 10 })}位，讨论量激增`, type: 'info' },
  { template: () => `新增 ${faker.number.int({ min: 50, max: 500 })} 位活跃用户，主要来自 ${pick(['iOS', 'Android', 'Web', '小程序'])} 端，占比 ${faker.number.int({ min: 45, max: 75 })}%`, type: 'info' },
  { template: () => `${pick(['华东', '华南', '华北', '华中', '西南'])}地区用户活跃度上升 ${faker.number.int({ min: 5, max: 20 })}%，可能受当地活动影响`, type: 'info' },
  { template: () => `AI 情感分析模型完成本轮训练，准确率提升 ${(Math.random() * 2 + 0.3).toFixed(1)}%`, type: 'success' },
  { template: () => `${pick(['教育', '科技', '健康', '财经', '体育'])}类内容今日发帖量突破 ${faker.number.int({ min: 800, max: 2500 })} 条，创${pick(['本周', '本月', '本季'])}新高`, type: 'success' },
  { template: () => `${faker.number.int({ min: 1, max: 5 })} 条历史帖文因举报触发复核，正在调取全文内容`, type: 'warning' },
  { template: () => `机器人用户识别系统拦截 ${faker.number.int({ min: 5, max: 30 })} 条自动发帖`, type: 'warning' },
  { template: () => `${pick(['健康科普', '财经资讯', '科技前沿', '教育在线'])}类帖文互动率今日达 ${faker.number.int({ min: 15, max: 35 })}%，${pick(['高于均值', '低于均值', '与昨日持平'])}`, type: 'success' },
  { template: () => `检测到 ${faker.number.int({ min: 1, max: 5 })} 个新注册账号发布相同内容，标记为可疑账号`, type: 'warning' },
  { template: () => `舆情预警系统发出${pick(['黄色', '橙色', '红色'])}预警：某话题讨论量快速上升`, type: 'warning' },
  { template: () => `「${pick(KEYWORD_POOL).word}」主题内容今日增长明显，环比 +${faker.number.int({ min: 10, max: 50 })}%`, type: 'info' },
]

export const recentActivity = Array.from({ length: 50 }, (_, i) => {
  const action = pick(ACTIVITY_ACTIONS)
  const time = randomHourMinute()
  return {
    time,
    content: action.template(faker.internet.ip()),
    type: action.type,
  }
}).sort((a, b) => b.time.localeCompare(a.time))

// ──────────────────────────────────────────────
// 20. week trend (8 days)
// ──────────────────────────────────────────────
export const weekTrend = Array.from({ length: 8 }, (_, i) => {
  const d = new Date(now)
  d.setDate(d.getDate() - (7 - i))
  return {
    date: `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`,
    posts: faker.number.int({ min: 3000, max: 4400 }),
    sensitive: faker.number.int({ min: 155, max: 230 }),
    engagement: faker.number.int({ min: 15000, max: 28000 }),
  }
})

// ──────────────────────────────────────────────
// 21. sensitive posts (50 posts)
// ──────────────────────────────────────────────
const TITLE_TEMPLATES = [
  () => `关于${pick(['某地突发事件', '近期社会热点', '网络谣言', '群体性事件', '公共安全事件'])}的讨论`,
  () => `${pick(['网络谣言', '虚假信息', '恶意炒作', '情绪化煽动', '极端言论'])}${pick(['传播监测', '扩散分析', '舆情追踪', '影响评估'])}`,
  () => `涉及${pick(['名人隐私', '企业商誉', '未成年人', '公共安全', '国家安全'])}的${pick(['讨论', '内容', '信息', '帖文'])}`,
  () => `${pick(['不实', '虚假', '误导性', '恶意'])}${pick(['医疗信息', '招聘信息', '金融信息', '教育信息', '健康信息'])}${pick(['传播', '扩散', '蔓延'])}`,
  () => `${pick(['恶意诋毁', '人身攻击', '造谣诽谤', '煽动对立', '地域歧视'])}${pick(['企业形象', '个人名誉', '群体关系', '社会秩序'])}}`,
  () => `${pick(['非法活动', '赌博推广', '诈骗信息', '钓鱼链接', '恶意软件'])}${pick(['召集帖', '推广文', '传播链', '下载页'])}`,
  () => `${pick(['AI生成', '深度伪造', '篡改剪辑', '虚假合成'])}${pick(['新闻报道', '视频内容', '音频内容', '图片信息'])}`,
  () => `${pick(['群体聚集', '非法集会', '集体投诉', '联合举报'])}相关${pick(['帖文', '信息', '预警', '通报'])}`,
]

export const sensitivePosts = Array.from({ length: 50 }, (_, i) => ({
  id: `S-${1024 - i}`,
  title: pick(TITLE_TEMPLATES)(),
  tags: picks(TAG_NAMES, 1, 3),
  sentiment: pick(SENTIMENTS),
  level: pick(LEVELS),
  status: pick(STATUSES),
  time: randomDateWithin(2),
  reach: faker.number.int({ min: 10000, max: 250000 }),
  reporter: pick(REPORTERS),
  source: pick(SOURCES),
  duration: `${faker.number.int({ min: 0, max: 8 })}h ${faker.number.int({ min: 0, max: 59 })}m`,
}))

// ──────────────────────────────────────────────
// 22. moderation queue (30 entries)
// ──────────────────────────────────────────────
export const moderationQueue = Array.from({ length: 30 }, (_, i) => ({
  id: `Q-${String(452 - i).padStart(4, '0')}`,
  type: pick(TYPES),
  risk: pick(LEVELS),
  submitted: randomHourMinute(),
  assignee: `审核组-${pick(['A', 'B', 'C', 'D'])}`,
}))

// ──────────────────────────────────────────────
// 23. alert history (30 entries)
// ──────────────────────────────────────────────
const ALERT_TYPES = ['高危', '警告', '信息']
const ALERT_CONTENTS = [
  () => `境外 IP 发布政治谣言被拦截`,
  () => `CDN 节点流量异常，已自动扩容`,
  () => `${pick(['奥运', '两会', '亚运', '国庆'])}话题内容审核策略已更新`,
  () => `${pick(['黄色', '橙色', '红色'])}预警：${pick(['某社会话题', '某娱乐事件', '某经济传闻'])}讨论量快速上升`,
  () => `钓鱼链接大规模传播被拦截`,
  () => `系统自检完成，所有服务运行正常`,
  () => `AI 检测模型返回延迟超过 ${faker.number.int({ min: 1, max: 5 })}s`,
  () => `批量注册机器人账号被识别封禁`,
  () => `每日数据备份任务启动`,
  () => `${pick(['某娱乐话题', '某社会议题', '某体育赛事'])}出现大量水军刷帖`,
  () => `内容审核人力排班调整完成`,
  () => `${pick(['极端言论', '虚假信息', '诈骗链接'])}帖子 ${faker.number.int({ min: 5, max: 30 })} 分钟内传播 ${faker.number.int({ min: 5, max: 25 })} 万次`,
  () => `${pick(['实时数据管道', '数据库主从', '消息队列', '缓存服务'])}延迟恢复正常`,
  () => `「${pick(KEYWORD_POOL).word}」话题突发，启动应急审核机制`,
  () => `检测到 ${pick(['DDoS攻击', 'CC攻击', '爬虫泛滥', '撞库攻击'])}，已启用防护策略`,
]
const STATUSES_ALERT = ['已处置', '已恢复', '观察中', '已完成']

export const alertHistory = Array.from({ length: 30 }, () => ({
  time: randomHourMinute(),
  type: pick(ALERT_TYPES),
  content: pick(ALERT_CONTENTS)(),
  status: pick(STATUSES_ALERT),
})).sort((a, b) => b.time.localeCompare(a.time))

// ──────────────────────────────────────────────
// 24. server health
// ──────────────────────────────────────────────
export const serverHealth = {
  cpu: faker.number.int({ min: 25, max: 92 }),
  memory: faker.number.int({ min: 40, max: 90 }),
  disk: faker.number.int({ min: 30, max: 85 }),
  networkIn: faker.number.int({ min: 100, max: 500 }),
  networkOut: faker.number.int({ min: 200, max: 800 }),
  requestRate: faker.number.int({ min: 800, max: 3500 }),
  uptime: `${faker.number.int({ min: 3, max: 60 })}d ${faker.number.int({ min: 0, max: 23 })}h ${faker.number.int({ min: 0, max: 59 })}m`,
  activeConnections: faker.number.int({ min: 1000, max: 6000 }),
  errorRate: +(Math.random() * 0.5).toFixed(3),
  avgLatency: faker.number.int({ min: 15, max: 120 }),
  cacheHitRate: +(Math.random() * 15 + 80).toFixed(1),
  dbConnections: faker.number.int({ min: 50, max: 250 }),
}

// ──────────────────────────────────────────────
// 25. daily comparison
// ──────────────────────────────────────────────
export const dailyComparison = [
  { metric: '今日', posts: 3421, sensitive: 186, engagement: 19850, users: 124300 },
  { metric: '昨日', posts: 3280, sensitive: 172, engagement: 18500, users: 118600 },
  { metric: '上周同天', posts: 3150, sensitive: 195, engagement: 17200, users: 112000 },
  { metric: '上月同天', posts: 2980, sensitive: 210, engagement: 15800, users: 105800 },
]

// ──────────────────────────────────────────────
// 26. weekly report
// ──────────────────────────────────────────────
export const weeklyReport = {
  totalPosts: 24780,
  avgPosts: 3540,
  totalSensitive: 1305,
  avgSensitive: 186,
  peakDay: '周六',
  peakPosts: 4120,
  troughDay: '周二',
  troughPosts: 3240,
  totalEngagement: 150600,
  avgEngagement: 21514,
  totalAlerts: 42,
  resolvedAlerts: 38,
  avgResponseTime: '4m 15s',
  topCategory: '科技',
  growthRate: 8.2,
}

// ──────────────────────────────────────────────
// 27. generate large post list (200 posts)
// ──────────────────────────────────────────────
export const postList = Array.from({ length: 200 }, (_, i) => ({
  id: `P-${String(25000 + i).padStart(6, '0')}`,
  title: faker.lorem.sentence({ min: 5, max: 15 }),
  author: faker.person.fullName(),
  category: pick(CATEGORIES).name,
  tags: picks(TAG_NAMES, 1, 4),
  sentiment: pick(SENTIMENTS),
  likes: faker.number.int({ min: 0, max: 50000 }),
  comments: faker.number.int({ min: 0, max: 5000 }),
  shares: faker.number.int({ min: 0, max: 2000 }),
  reach: faker.number.int({ min: 100, max: 200000 }),
  createdAt: faker.date.between({ from: '2026-01-01', to: '2026-07-07' }).toISOString(),
  platform: pick(SOURCES),
  isSensitive: Math.random() < 0.08,
}))

// ──────────────────────────────────────────────
// 28. user list (150 users)
// ──────────────────────────────────────────────
export const userList = Array.from({ length: 150 }, () => ({
  id: `U-${String(faker.number.int({ min: 10000, max: 99999 }))}`,
  name: faker.person.fullName(),
  age: faker.number.int({ min: 14, max: 72 }),
  region: pick(userGeoDistribution).region,
  platform: pick(SOURCES),
  posts: faker.number.int({ min: 0, max: 500 }),
  followers: faker.number.int({ min: 0, max: 50000 }),
  joinDate: faker.date.between({ from: '2024-01-01', to: '2026-07-07' }).toISOString(),
  lastActive: faker.date.recent({ days: 7 }).toISOString(),
  isVerified: Math.random() < 0.05,
}))

// ──────────────────────────────────────────────
// 29. emotion intensity by hour (24h array for chart)
// ──────────────────────────────────────────────
export const emotionIntensity = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  intensity: faker.number.int({ min: 5, max: 95 }),
  volume: faker.number.int({ min: 20, max: 1000 }),
}))

// ──────────────────────────────────────────────
// 30. cross-reference: posts per category per day (7 days)
// ──────────────────────────────────────────────
export const categoryDailyPosts = CATEGORIES.map(({ name }) => ({
  category: name,
  daily: Array.from({ length: 7 }, () => faker.number.int({ min: 50, max: 500 })),
}))
