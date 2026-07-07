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
}

export const trendData = {
  dates: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
  posts: [
    120, 85, 60, 45, 38, 55, 180, 420, 680, 820, 760, 890,
    950, 880, 790, 720, 680, 910, 1150, 980, 720, 540, 320, 180
  ],
  sensitive: [
    8, 5, 3, 2, 4, 6, 12, 21, 34, 28, 31, 42,
    38, 29, 24, 19, 22, 35, 48, 41, 30, 18, 12, 9
  ],
  engagement: [
    45, 32, 22, 18, 15, 25, 68, 145, 230, 280, 260, 310,
    330, 295, 260, 235, 220, 300, 410, 340, 250, 185, 110, 62
  ],
}

export const sentimentData = {
  positive: 62,
  neutral: 24,
  negative: 14,
}

export const sentimentTrend = {
  dates: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  positive: [58, 61, 63, 60, 65, 70, 68],
  neutral: [26, 25, 23, 27, 24, 22, 23],
  negative: [16, 14, 14, 13, 11, 8, 9],
}

export const platformData = [
  { name: 'Web 端', value: 42.5 },
  { name: 'iOS App', value: 31.2 },
  { name: 'Android', value: 18.6 },
  { name: '小程序', value: 7.7 },
]

export const topicRadar = {
  indicators: [
    { name: '政治', max: 100 },
    { name: '经济', max: 100 },
    { name: '科技', max: 100 },
    { name: '社会', max: 100 },
    { name: '娱乐', max: 100 },
    { name: '健康', max: 100 },
  ],
  data: [78, 65, 82, 58, 72, 45],
}

export const activityHeatmap = [
  ['周一', '00:00', 12], ['周一', '04:00', 5], ['周一', '08:00', 45], ['周一', '12:00', 78], ['周一', '16:00', 62], ['周一', '20:00', 95],
  ['周二', '00:00', 15], ['周二', '04:00', 6], ['周二', '08:00', 48], ['周二', '12:00', 82], ['周二', '16:00', 65], ['周二', '20:00', 91],
  ['周三', '00:00', 10], ['周三', '04:00', 7], ['周三', '08:00', 52], ['周三', '12:00', 85], ['周三', '16:00', 68], ['周三', '20:00', 88],
  ['周四', '00:00', 18], ['周四', '04:00', 5], ['周四', '08:00', 50], ['周四', '12:00', 80], ['周四', '16:00', 70], ['周四', '20:00', 93],
  ['周五', '00:00', 22], ['周五', '04:00', 8], ['周五', '08:00', 55], ['周五', '12:00', 88], ['周五', '16:00', 72], ['周五', '20:00', 96],
  ['周六', '00:00', 35], ['周六', '04:00', 12], ['周六', '08:00', 62], ['周六', '12:00', 95], ['周六', '16:00', 85], ['周六', '20:00', 110],
  ['周日', '00:00', 38], ['周日', '04:00', 15], ['周日', '08:00', 68], ['周日', '12:00', 102], ['周日', '16:00', 90], ['周日', '20:00', 115],
]

export const topUsers = [
  { name: '财经观察员', posts: 128, followers: 89200, influence: 96 },
  { name: '科技前沿', posts: 96, followers: 65400, influence: 91 },
  { name: '民生热线', posts: 84, followers: 123000, influence: 94 },
  { name: '体育快讯', posts: 72, followers: 45600, influence: 82 },
  { name: '健康科普', posts: 65, followers: 38700, influence: 78 },
]

export const keywordRank = [
  { word: '人工智能', count: 12450, trend: 'up' },
  { word: '股市', count: 9820, trend: 'up' },
  { word: '奥运', count: 8760, trend: 'down' },
  { word: '新能源汽车', count: 7540, trend: 'up' },
  { word: '教育改革', count: 6890, trend: 'stable' },
  { word: '房价', count: 6210, trend: 'up' },
  { word: '医疗', count: 5980, trend: 'stable' },
  { word: '环保', count: 4320, trend: 'down' },
]

export const tagData = [
  { name: 'politics', count: 8430, sentiment: 'negative' },
  { name: 'economy', count: 6210, sentiment: 'neutral' },
  { name: 'technology', count: 5890, sentiment: 'positive' },
  { name: 'sports', count: 4520, sentiment: 'positive' },
  { name: 'health', count: 3980, sentiment: 'neutral' },
  { name: 'environment', count: 3150, sentiment: 'negative' },
  { name: 'education', count: 2870, sentiment: 'positive' },
  { name: 'entertainment', count: 2540, sentiment: 'neutral' },
  { name: 'security', count: 1920, sentiment: 'negative' },
  { name: 'culture', count: 1680, sentiment: 'positive' },
  { name: 'finance', count: 1450, sentiment: 'neutral' },
  { name: 'travel', count: 1120, sentiment: 'positive' },
  { name: 'food', count: 980, sentiment: 'positive' },
  { name: 'fashion', count: 760, sentiment: 'neutral' },
  { name: 'automotive', count: 650, sentiment: 'neutral' },
]

export const recentActivity = [
  { time: '14:35', content: '系统拦截 1 条涉及政治谣言的帖文', type: 'warning' },
  { time: '14:32', content: '用户「民生热线」发布热点话题，触达 12.5 万人', type: 'info' },
  { time: '14:28', content: 'AI 模型检测到 3 条疑似敏感内容，已转人工复核', type: 'warning' },
  { time: '14:25', content: '「人工智能」关键词热度突破 12,000', type: 'success' },
  { time: '14:18', content: '审核团队处置完成 5 条违规内容', type: 'success' },
  { time: '14:10', content: '新增 156 位活跃用户，主要来自 iOS 端', type: 'info' },
  { time: '14:05', content: '系统完成全量数据扫描，无新增高风险事件', type: 'success' },
  { time: '13:58', content: '网络谣言传播监测帖文进入复审流程', type: 'warning' },
]

export const sensitivePosts = [
  {
    id: 'S-1024',
    title: '关于某地突发事件的讨论',
    tags: ['politics', 'security'],
    sentiment: 'negative',
    level: 'high',
    status: 'blocked',
    time: '2026-07-07 14:32',
    reach: 125000,
  },
  {
    id: 'S-1023',
    title: '网络谣言传播监测',
    tags: ['health', 'politics'],
    sentiment: 'negative',
    level: 'medium',
    status: 'reviewing',
    time: '2026-07-07 13:58',
    reach: 67000,
  },
  {
    id: 'S-1022',
    title: '群体聚集性事件相关帖文',
    tags: ['security', 'politics'],
    sentiment: 'negative',
    level: 'high',
    status: 'blocked',
    time: '2026-07-07 12:15',
    reach: 210000,
  },
  {
    id: 'S-1021',
    title: '涉及名人隐私的讨论',
    tags: ['entertainment'],
    sentiment: 'neutral',
    level: 'low',
    status: 'reviewing',
    time: '2026-07-07 11:42',
    reach: 34000,
  },
  {
    id: 'S-1020',
    title: '不实医疗信息传播',
    tags: ['health'],
    sentiment: 'negative',
    level: 'medium',
    status: 'resolved',
    time: '2026-07-07 10:20',
    reach: 89000,
  },
  {
    id: 'S-1019',
    title: '极端言论监控',
    tags: ['politics', 'culture'],
    sentiment: 'negative',
    level: 'high',
    status: 'blocked',
    time: '2026-07-07 09:05',
    reach: 156000,
  },
  {
    id: 'S-1018',
    title: '情绪化煽动内容',
    tags: ['politics'],
    sentiment: 'negative',
    level: 'medium',
    status: 'reviewing',
    time: '2026-07-07 08:33',
    reach: 78000,
  },
  {
    id: 'S-1017',
    title: '恶意诋毁企业形象',
    tags: ['economy', 'finance'],
    sentiment: 'negative',
    level: 'medium',
    status: 'reviewing',
    time: '2026-07-07 08:12',
    reach: 45000,
  },
  {
    id: 'S-1016',
    title: '虚假招聘信息扩散',
    tags: ['education'],
    sentiment: 'neutral',
    level: 'low',
    status: 'resolved',
    time: '2026-07-07 07:45',
    reach: 23000,
  },
  {
    id: 'S-1015',
    title: '非法活动召集帖',
    tags: ['security', 'politics'],
    sentiment: 'negative',
    level: 'high',
    status: 'blocked',
    time: '2026-07-07 06:20',
    reach: 189000,
  },
]
