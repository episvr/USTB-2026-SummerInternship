<template>
  <div class="card top-users">
    <div class="card__title">
      活跃创作者
      <span class="card__subtitle">发帖影响力排行</span>
    </div>
    <div class="top-users__list">
      <div
        v-for="(user, index) in visibleUsers"
        :key="user.name"
        class="top-users__item"
      >
        <div class="top-users__left">
          <span class="top-users__rank">{{ index + 1 }}</span>
          <div class="top-users__info">
            <span class="top-users__name">{{ user.name }}</span>
            <span class="top-users__meta">{{ user.posts }} 帖 / {{ user.followers.toLocaleString() }} 粉丝</span>
          </div>
        </div>
        <div class="top-users__right">
          <div class="top-users__bar">
            <div
              class="top-users__bar-fill"
              :style="{ width: `${user.influence}%` }"
            ></div>
          </div>
          <span class="top-users__score">{{ user.influence }}</span>
        </div>
      </div>
    </div>
    <button v-if="users.length > visibleCount" class="collapse-toggle" @click="expanded = !expanded">
      {{ expanded ? '收起 ▲' : `展开全部 ${users.length} 人 ▼` }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  users: Array,
  visibleCount: { type: Number, default: 8 }
})

const expanded = ref(false)

const visibleUsers = computed(() =>
  expanded.value ? props.users : props.users.slice(0, props.visibleCount)
)
</script>

<style scoped>
.top-users__list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.top-users__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.top-users__left {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  flex: 1;
  min-width: 0;
}

.top-users__rank {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(100, 130, 255, 0.1);
  color: var(--primary);
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

.top-users__info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.top-users__name {
  font-size: 0.9rem;
  color: var(--text);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.top-users__meta {
  font-size: 0.75rem;
  color: var(--muted);
}

.top-users__right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 120px;
  flex-shrink: 0;
}

.top-users__bar {
  flex: 1;
  height: 6px;
  background: rgba(100, 130, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.top-users__bar-fill {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transition: width 0.6s ease;
}

.top-users__score {
  font-size: 0.8rem;
  color: var(--primary);
  font-family: "Courier New", monospace;
  min-width: 24px;
  text-align: right;
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
