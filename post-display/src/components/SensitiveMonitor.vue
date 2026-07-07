<template>
  <div class="card sensitive-monitor">
    <div class="card__title">
      敏感舆论监控
      <span class="card__subtitle">近 24 小时重点管控帖文</span>
    </div>
    <div class="sensitive-monitor__table-wrap">
      <table class="sensitive-monitor__table">
        <thead>
          <tr>
            <th>编号</th>
            <th>标题</th>
            <th>标签</th>
            <th>级别</th>
            <th>状态</th>
            <th>触达</th>
            <th>时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in visiblePosts" :key="post.id">
            <td class="sensitive-monitor__id">{{ post.id }}</td>
            <td class="sensitive-monitor__title">{{ post.title }}</td>
            <td>
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="sensitive-monitor__tag"
              >
                {{ tag }}
              </span>
            </td>
            <td>
              <span
                class="sensitive-monitor__level"
                :class="`sensitive-monitor__level--${post.level}`"
              >
                {{ levelText(post.level) }}
              </span>
            </td>
            <td>
              <span
                class="sensitive-monitor__status"
                :class="`sensitive-monitor__status--${post.status}`"
              >
                {{ statusText(post.status) }}
              </span>
            </td>
            <td class="sensitive-monitor__reach">{{ post.reach.toLocaleString() }}</td>
            <td class="sensitive-monitor__time">{{ post.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <button v-if="posts.length > visibleCount" class="collapse-toggle" @click="expanded = !expanded">
      {{ expanded ? '收起 ▲' : `展开全部 ${posts.length} 条 ▼` }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  posts: Array,
  visibleCount: { type: Number, default: 8 }
})

const expanded = ref(false)

const visiblePosts = computed(() =>
  expanded.value ? props.posts : props.posts.slice(0, props.visibleCount)
)

const levelText = (level) => {
  const map = { low: '低', medium: '中', high: '高' }
  return map[level] || level
}

const statusText = (status) => {
  const map = { blocked: '已拦截', reviewing: '审核中', resolved: '已处置' }
  return map[status] || status
}
</script>

<style scoped>
.sensitive-monitor__table-wrap {
  overflow-x: auto;
}

.sensitive-monitor__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  min-width: 700px;
}

.sensitive-monitor__table th,
.sensitive-monitor__table td {
  padding: 0.8rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.sensitive-monitor__table th {
  color: var(--muted);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.05em;
  background: rgba(100, 130, 255, 0.04);
}

.sensitive-monitor__table tr:hover td {
  background: rgba(100, 130, 255, 0.04);
}

.sensitive-monitor__id {
  font-family: "Courier New", monospace;
  color: var(--muted);
  white-space: nowrap;
}

.sensitive-monitor__title {
  color: var(--text);
  font-weight: 500;
}

.sensitive-monitor__tag {
  display: inline-block;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  background: rgba(100, 130, 255, 0.1);
  color: var(--primary);
  font-size: 0.75rem;
  margin-right: 0.35rem;
}

.sensitive-monitor__level,
.sensitive-monitor__status {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.sensitive-monitor__level--low {
  background: rgba(34, 197, 94, 0.12);
  color: var(--success);
}

.sensitive-monitor__level--medium {
  background: rgba(245, 158, 11, 0.12);
  color: var(--warning);
}

.sensitive-monitor__level--high {
  background: rgba(239, 68, 68, 0.12);
  color: var(--danger);
}

.sensitive-monitor__status--blocked {
  background: rgba(239, 68, 68, 0.12);
  color: var(--danger);
}

.sensitive-monitor__status--reviewing {
  background: rgba(245, 158, 11, 0.12);
  color: var(--warning);
}

.sensitive-monitor__status--resolved {
  background: rgba(34, 197, 94, 0.12);
  color: var(--success);
}

.sensitive-monitor__reach {
  font-family: "Courier New", monospace;
  white-space: nowrap;
}

.sensitive-monitor__time {
  color: var(--muted);
  white-space: nowrap;
}

.collapse-toggle {
  align-self: center;
  background: none;
  border: 1px solid var(--border);
  color: var(--primary);
  font-size: 0.8rem;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  margin-top: 0.25rem;
}

.collapse-toggle:hover {
  background: rgba(59, 130, 246, 0.1);
}
</style>
