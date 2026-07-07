export const mockStats = {
  totalPosts: 124587,
  todayPosts: 3421,
  sensitivePosts: 186,
  pendingReview: 42,
  processedToday: 89,
}

export const trendData = {
  dates: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
  posts: [320, 180, 560, 890, 720, 950, 430],
  sensitive: [12, 8, 21, 34, 28, 41, 18],
}

export const sentimentData = {
  positive: 62,
  neutral: 24,
  negative: 14,
}

export const tagData = [
  { name: ' politics', count: 8430, sentiment: 'negative' },
  { name: 'economy', count: 6210, sentiment: 'neutral' },
  { name: 'technology', count: 5890, sentiment: 'positive' },
  { name: 'sports', count: 4520, sentiment: 'positive' },
  { name: 'health', count: 3980, sentiment: 'neutral' },
  { name: 'environment', count: 3150, sentiment: 'negative' },
  { name: 'education', count: 2870, sentiment: 'positive' },
  { name: 'entertainment', count: 2540, sentiment: 'neutral' },
  { name: 'security', count: 1920, sentiment: 'negative' },
  { name: 'culture', count: 1680, sentiment: 'positive' },
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
]
