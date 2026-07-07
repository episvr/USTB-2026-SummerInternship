import { faker } from '@faker-js/faker/locale/zh_CN'

faker.seed()

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

const TITLE_TEMPLATES = [
  () => `关于${faker.helpers.arrayElement(['某地突发事件', '近期社会热点', '网络谣言', '群体性事件', '公共安全事件'])}的讨论`,
  () => `${faker.helpers.arrayElement(['网络谣言', '虚假信息', '恶意炒作', '情绪化煽动', '极端言论'])}${faker.helpers.arrayElement(['传播监测', '扩散分析', '舆情追踪', '影响评估'])}`,
  () => `涉及${faker.helpers.arrayElement(['名人隐私', '企业商誉', '未成年人', '公共安全', '国家安全'])}的${faker.helpers.arrayElement(['讨论', '内容', '信息', '帖文'])}`,
  () => `${faker.helpers.arrayElement(['不实', '虚假', '误导性', '恶意'])}${faker.helpers.arrayElement(['医疗信息', '招聘信息', '金融信息', '教育信息', '健康信息'])}${faker.helpers.arrayElement(['传播', '扩散', '蔓延'])}`,
  () => `${faker.helpers.arrayElement(['恶意诋毁', '人身攻击', '造谣诽谤', '煽动对立', '地域歧视'])}${faker.helpers.arrayElement(['企业形象', '个人名誉', '群体关系', '社会秩序'])}`,
  () => `${faker.helpers.arrayElement(['非法活动', '赌博推广', '诈骗信息', '钓鱼链接', '恶意软件'])}${faker.helpers.arrayElement(['召集帖', '推广文', '传播链', '下载页'])}`,
  () => `${faker.helpers.arrayElement(['AI生成', '深度伪造', '篡改剪辑', '虚假合成'])}${faker.helpers.arrayElement(['新闻报道', '视频内容', '音频内容', '图片信息'])}`,
  () => `${faker.helpers.arrayElement(['群体聚集', '非法集会', '集体投诉', '联合举报'])}相关${faker.helpers.arrayElement(['帖文', '信息', '预警', '通报'])}`,
]

const ACTIVITY_ACTIONS = [
  { template: (t) => `系统拦截 1 条涉及${faker.helpers.arrayElement(['政治谣言', '虚假信息', '恶意攻击', '非法广告', '诈骗链接'])}的帖文，来源 IP ${t}`, type: 'warning' },
  { template: () => `用户「${faker.helpers.arrayElement(['民生热线', '财经观察员', '科技前沿', '体育快讯', '健康科普', '娱乐八卦', '法治在线', '国际时事'])}」发布热点话题，触达 ${faker.number.int({ min: 3, max: 30 })}.${faker.number.int({ min: 0, max: 9 })} 万人`, type: 'info' },
  { template: (t) => `AI 模型检测到 ${faker.number.int({ min: 1, max: 5 })} 条疑似敏感内容，已转人工复核队列`, type: 'warning' },
  { template: () => `「${faker.helpers.arrayElement(KEYWORD_POOL).word}」关键词热度突破 ${faker.number.int({ min: 5, max: 20 })}000，较昨日增长 ${faker.number.int({ min: 5, max: 30 })}%`, type: 'success' },
  { template: () => `新增 ${faker.number.int({ min: 20, max: 200 })} 条关于「${faker.helpers.arrayElement(KEYWORD_POOL).word}」的讨论帖文`, type: 'info' },
  { template: () => `审核团队处置完成 ${faker.number.int({ min: 3, max: 12 })} 条违规内容，平均用时 ${faker.number.int({ min: 2, max: 8 })} 分 ${faker.number.int({ min: 0, max: 59 })} 秒`, type: 'success' },
  { template: () => `「${faker.helpers.arrayElement(KEYWORD_POOL).word}」实时热度上升至第${faker.number.int({ min: 1, max: 10 })}位，讨论量激增`, type: 'info' },
  { template: () => `新增 ${faker.number.int({ min: 50, max: 500 })} 位活跃用户，主要来自 ${faker.helpers.arrayElement(['iOS', 'Android', 'Web', '小程序'])} 端，占比 ${faker.number.int({ min: 45, max: 75 })}%`, type: 'info' },
  { template: () => `${faker.helpers.arrayElement(['华东', '华南', '华北', '华中', '西南'])}地区用户活跃度上升 ${faker.number.int({ min: 5, max: 20 })}%，可能受当地活动影响`, type: 'info' },
  { template: () => `AI 情感分析模型完成本轮训练，准确率提升 ${(Math.random() * 2 + 0.3).toFixed(1)}%`, type: 'success' },
  { template: () => `${faker.helpers.arrayElement(['教育', '科技', '健康', '财经', '体育'])}类内容今日发帖量突破 ${faker.number.int({ min: 800, max: 2500 })} 条，创${faker.helpers.arrayElement(['本周', '本月', '本季'])}新高`, type: 'success' },
  { template: () => `${faker.number.int({ min: 1, max: 5 })} 条历史帖文因举报触发复核，正在调取全文内容`, type: 'warning' },
  { template: () => `机器人用户识别系统拦截 ${faker.number.int({ min: 5, max: 30 })} 条自动发帖`, type: 'warning' },
  { template: () => `${faker.helpers.arrayElement(['健康科普', '财经资讯', '科技前沿', '教育在线'])}类帖文互动率今日达 ${faker.number.int({ min: 15, max: 35 })}%，${faker.helpers.arrayElement(['高于均值', '低于均值', '与昨日持平'])}`, type: 'success' },
  { template: () => `检测到 ${faker.number.int({ min: 1, max: 5 })} 个新注册账号发布相同内容，标记为可疑账号`, type: 'warning' },
  { template: () => `舆情预警系统发出${faker.helpers.arrayElement(['黄色', '橙色', '红色'])}预警：某话题讨论量快速上升`, type: 'warning' },
  { template: () => `「${faker.helpers.arrayElement(KEYWORD_POOL).word}」主题内容今日增长明显，环比 +${faker.number.int({ min: 10, max: 50 })}%`, type: 'info' },
]

function randomDateWithin(daysBack) {
  const d = new Date()
  d.setDate(d.getDate() - faker.number.int({ min: 0, max: daysBack }))
  d.setHours(faker.number.int({ min: 0, max: 23 }))
  d.setMinutes(faker.number.int({ min: 0, max: 59 }))
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function randomHourMinute() {
  return `${String(faker.number.int({ min: 0, max: 23 })).padStart(2, '0')}:${String(faker.number.int({ min: 0, max: 59 })).padStart(2, '0')}`
}

function picks(arr, min, max) {
  const n = faker.number.int({ min, max })
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

// Helper to simulate network delay
function delay(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function fetchStats() {
  await delay(faker.number.int({ min: 50, max: 200 }))
  return {
    totalPosts: faker.number.int({ min: 120000, max: 130000 }),
    todayPosts: faker.number.int({ min: 3000, max: 3800 }),
    sensitivePosts: faker.number.int({ min: 150, max: 220 }),
    pendingReview: faker.number.int({ min: 30, max: 60 }),
    activeUsers: faker.number.int({ min: 110000, max: 135000 }),
    aiDetectRate: faker.number.float({ min: 90, max: 98, fractionDigits: 1 }),
    riskScore: faker.number.int({ min: 55, max: 85 }),
  }
}

export async function fetchTrendData() {
  await delay(faker.number.int({ min: 50, max: 200 }))
  const basePosts = [120, 85, 60, 45, 38, 55, 180, 420, 680, 820, 760, 890, 950, 880, 790, 720, 680, 910, 1150, 980, 720, 540, 320, 180]
  const baseSensitive = [8, 5, 3, 2, 4, 6, 12, 21, 34, 28, 31, 42, 38, 29, 24, 19, 22, 35, 48, 41, 30, 18, 12, 9]
  const jitter = () => faker.number.int({ min: -15, max: 15 })
  return {
    dates: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`),
    posts: basePosts.map(v => Math.max(0, v + jitter())),
    sensitive: baseSensitive.map(v => Math.max(0, v + faker.number.int({ min: -3, max: 3 }))),
  }
}

export async function fetchSentimentData() {
  await delay(faker.number.int({ min: 30, max: 150 }))
  const positive = faker.number.int({ min: 55, max: 70 })
  const neutral = faker.number.int({ min: 15, max: 30 })
  return {
    positive,
    neutral,
    negative: Math.max(5, 100 - positive - neutral),
  }
}

export async function fetchSentimentTrend() {
  await delay(faker.number.int({ min: 30, max: 150 }))
  const days = 14
  const now = new Date()
  const dates = Array.from({ length: days }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (days - 1 - i))
    return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
  })
  let lastPos = 62, lastNeu = 24, lastNeg = 14
  return {
    dates,
    positive: Array.from({ length: days }, () => {
      lastPos = Math.max(50, Math.min(75, lastPos + faker.number.int({ min: -3, max: 3 })))
      return lastPos
    }),
    neutral: Array.from({ length: days }, () => {
      lastNeu = Math.max(15, Math.min(35, lastNeu + faker.number.int({ min: -2, max: 2 })))
      return lastNeu
    }),
    negative: Array.from({ length: days }, () => {
      lastNeg = Math.max(5, Math.min(25, lastNeg + faker.number.int({ min: -2, max: 2 })))
      return lastNeg
    }),
  }
}

export async function fetchActivityHeatmap() {
  await delay(faker.number.int({ min: 50, max: 200 }))
  const result = []
  ACTIVITY_DAYS.forEach((day, di) => {
    const dayBase = [15, 20, 10, 18, 25, 38, 42][di]
    const dayAmp = [8, 9, 7, 10, 12, 15, 18][di]
    ACTIVITY_HOURS.forEach((hour, hi) => {
      const hourBase = [5, 2, 1, 3, 6, 8, 7, 9, 6, 5, 7, 4][hi % 12]
      result.push([hour, day, Math.max(0, dayBase + hourBase * dayAmp + faker.number.int({ min: -3, max: 3 }))])
    })
  })
  return result
}

export async function fetchPlatformData() {
  await delay(faker.number.int({ min: 30, max: 150 }))
  return [
    { name: 'Web 端', value: faker.number.float({ min: 28, max: 36, fractionDigits: 1 }) },
    { name: 'iOS App', value: faker.number.float({ min: 24, max: 32, fractionDigits: 1 }) },
    { name: 'Android', value: faker.number.float({ min: 18, max: 25, fractionDigits: 1 }) },
    { name: '小程序', value: faker.number.float({ min: 8, max: 14, fractionDigits: 1 }) },
    { name: 'H5 页面', value: faker.number.float({ min: 3, max: 7, fractionDigits: 1 }) },
    { name: 'PC 客户端', value: faker.number.float({ min: 1, max: 4, fractionDigits: 1 }) },
  ]
}

export async function fetchTopicRadar() {
  await delay(faker.number.int({ min: 30, max: 150 }))
  return {
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
    data: [
      faker.number.int({ min: 60, max: 90 }),
      faker.number.int({ min: 55, max: 80 }),
      faker.number.int({ min: 70, max: 95 }),
      faker.number.int({ min: 45, max: 70 }),
      faker.number.int({ min: 60, max: 85 }),
      faker.number.int({ min: 35, max: 60 }),
      faker.number.int({ min: 30, max: 55 }),
      faker.number.int({ min: 40, max: 65 }),
    ],
  }
}

export async function fetchKeywordRank() {
  await delay(faker.number.int({ min: 50, max: 200 }))
  return KEYWORD_POOL.map(k => ({
    ...k,
    count: faker.number.int({ min: 800, max: 15000 }),
    trend: faker.helpers.arrayElement(TRENDS),
  })).sort((a, b) => b.count - a.count)
}

export async function fetchTopUsers() {
  await delay(faker.number.int({ min: 50, max: 200 }))
  return Array.from({ length: 30 }, () => ({
    name: faker.person.fullName(),
    posts: faker.number.int({ min: 20, max: 150 }),
    followers: faker.number.int({ min: 5000, max: 150000 }),
    influence: faker.number.int({ min: 45, max: 99 }),
  })).sort((a, b) => b.influence - a.influence)
}

export async function fetchRecentActivity() {
  await delay(faker.number.int({ min: 50, max: 200 }))
  return Array.from({ length: 50 }, (_, i) => {
    const action = faker.helpers.arrayElement(ACTIVITY_ACTIONS)
    const time = randomHourMinute()
    return {
      time,
      content: action.template(faker.internet.ip()),
      type: action.type,
    }
  }).sort((a, b) => b.time.localeCompare(a.time))
}

export async function fetchTagData() {
  await delay(faker.number.int({ min: 30, max: 150 }))
  return TAG_NAMES.map(name => ({
    name,
    count: faker.number.int({ min: 100, max: 10000 }),
    sentiment: faker.helpers.arrayElement(SENTIMENTS),
  })).sort((a, b) => b.count - a.count)
}

export async function fetchSensitivePosts() {
  await delay(faker.number.int({ min: 50, max: 200 }))
  return Array.from({ length: 50 }, (_, i) => ({
    id: `S-${1024 - i}`,
    title: faker.helpers.arrayElement(TITLE_TEMPLATES)(),
    tags: picks(TAG_NAMES, 1, 3),
    sentiment: faker.helpers.arrayElement(SENTIMENTS),
    level: faker.helpers.arrayElement(LEVELS),
    status: faker.helpers.arrayElement(STATUSES),
    time: randomDateWithin(2),
    reach: faker.number.int({ min: 10000, max: 250000 }),
    reporter: faker.helpers.arrayElement(REPORTERS),
    source: faker.helpers.arrayElement(SOURCES),
    duration: `${faker.number.int({ min: 0, max: 8 })}h ${faker.number.int({ min: 0, max: 59 })}m`,
  }))
}

export async function fetchAllDashboardData() {
  const [
    stats,
    trendData,
    sentimentData,
    sentimentTrend,
    activityHeatmap,
    platformData,
    topicRadar,
    keywordRank,
    topUsers,
    recentActivity,
    tagData,
    sensitivePosts,
  ] = await Promise.all([
    fetchStats(),
    fetchTrendData(),
    fetchSentimentData(),
    fetchSentimentTrend(),
    fetchActivityHeatmap(),
    fetchPlatformData(),
    fetchTopicRadar(),
    fetchKeywordRank(),
    fetchTopUsers(),
    fetchRecentActivity(),
    fetchTagData(),
    fetchSensitivePosts(),
  ])

  return {
    stats,
    trendData,
    sentimentData,
    sentimentTrend,
    activityHeatmap,
    platformData,
    topicRadar,
    keywordRank,
    topUsers,
    recentActivity,
    tagData,
    sensitivePosts,
  }
}
