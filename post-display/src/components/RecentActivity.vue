<template>
  <div class="card recent-activity">
    <div class="card__title">
      实时动态
      <span class="card__subtitle">系统运行日志</span>
    </div>
    <div class="recent-activity__list">
      <div
        v-for="item in visibleActivities"
        :key="item.time + item.content"
        class="recent-activity__item"
      >
        <span class="recent-activity__time">{{ item.time }}</span>
        <span class="recent-activity__dot" :class="`recent-activity__dot--${item.type}`"></span>
        <span class="recent-activity__content">{{ item.content }}</span>
      </div>
    </div>
    <button v-if="activities.length > visibleCount" class="collapse-toggle" @click="expanded = !expanded">
      {{ expanded ? '收起 ▲' : `展开全部 ${activities.length} 条 ▼` }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  activities: Array,
  visibleCount: { type: Number, default: 8 }
})

const expanded = ref(false)

const visibleActivities = computed(() =>
  expanded.value ? props.activities : props.activities.slice(0, props.visibleCount)
)
</script>

<style scoped>
.recent-activity__list {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  max-height: 220px;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.recent-activity__item {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-size: 0.85rem;
  line-height: 1.4;
}

.recent-activity__time {
  color: var(--muted);
  font-family: "Courier New", monospace;
  font-size: 0.75rem;
  white-space: nowrap;
  min-width: 40px;
}

.recent-activity__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 0.35rem;
  flex-shrink: 0;
  background: var(--muted);
}

.recent-activity__dot--info {
  background: #3b82f6;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
}

.recent-activity__dot--warning {
  background: #f59e0b;
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);
}

.recent-activity__dot--success {
  background: #22c55e;
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
}

.recent-activity__content {
  color: var(--text);
}

.recent-activity__list::-webkit-scrollbar {
  width: 4px;
}

.recent-activity__list::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 2px;
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
