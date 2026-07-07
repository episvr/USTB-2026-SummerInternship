<template>
  <div class="card keyword-rank">
    <div class="card__title">
      热搜关键词
      <span class="card__subtitle">按讨论量排序</span>
    </div>
    <div class="keyword-rank__list">
      <div
        v-for="(item, index) in visibleKeywords"
        :key="item.word"
        class="keyword-rank__item"
      >
        <span class="keyword-rank__rank" :class="`keyword-rank__rank--${index + 1}`">
          {{ index + 1 }}
        </span>
        <span class="keyword-rank__word">{{ item.word }}</span>
        <span class="keyword-rank__count">{{ item.count.toLocaleString() }}</span>
        <span class="keyword-rank__trend" :class="`keyword-rank__trend--${item.trend}`">
          {{ trendIcon(item.trend) }}
        </span>
      </div>
    </div>
    <button v-if="keywords.length > visibleCount" class="collapse-toggle" @click="expanded = !expanded">
      {{ expanded ? '收起 ▲' : `展开全部 ${keywords.length} 条 ▼` }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  keywords: Array,
  visibleCount: { type: Number, default: 10 }
})

const expanded = ref(false)

const visibleKeywords = computed(() =>
  expanded.value ? props.keywords : props.keywords.slice(0, props.visibleCount)
)

const trendIcon = (trend) => {
  const map = { up: '↑', down: '↓', stable: '−' }
  return map[trend] || trend
}
</script>

<style scoped>
.keyword-rank__list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.keyword-rank__item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.55rem 0.7rem;
  background: rgba(100, 130, 255, 0.04);
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: background 0.15s;
}

.keyword-rank__item:hover {
  background: rgba(100, 130, 255, 0.08);
}

.keyword-rank__rank {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  background: rgba(148, 163, 184, 0.3);
}

.keyword-rank__rank--1 {
  background: #ef4444;
}

.keyword-rank__rank--2 {
  background: #f59e0b;
}

.keyword-rank__rank--3 {
  background: #3b82f6;
}

.keyword-rank__word {
  flex: 1;
  font-size: 0.9rem;
  color: var(--text);
}

.keyword-rank__count {
  font-family: "Courier New", monospace;
  font-size: 0.8rem;
  color: var(--muted);
}

.keyword-rank__trend {
  font-size: 0.85rem;
  width: 20px;
  text-align: center;
}

.keyword-rank__trend--up {
  color: var(--success);
}

.keyword-rank__trend--down {
  color: var(--danger);
}

.keyword-rank__trend--stable {
  color: var(--muted);
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
}

.collapse-toggle:hover {
  background: rgba(59, 130, 246, 0.1);
}
</style>
