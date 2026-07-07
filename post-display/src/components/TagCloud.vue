<template>
  <div class="card tag-cloud">
    <div class="card__title">热门标签
      <span class="card__subtitle">按讨论量排序</span>
    </div>
    <div class="tag-cloud__list">
      <div
        v-for="tag in tags"
        :key="tag.name"
        class="tag"
        :class="`tag--${tag.sentiment}`"
      >
        <span class="tag__name">#{{ tag.name }}</span>
        <span class="tag__count">{{ tag.count.toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tags: Array
})
</script>

<style scoped>
.tag-cloud__list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  background: rgba(100, 130, 255, 0.08);
  border: 1px solid var(--border);
  font-size: 0.85rem;
  transition: transform 0.15s, background 0.15s;
}

.tag:hover {
  transform: translateY(-2px);
  background: rgba(100, 130, 255, 0.15);
}

.tag--positive {
  border-color: rgba(34, 197, 94, 0.3);
  color: var(--success);
}

.tag--neutral {
  border-color: rgba(100, 116, 139, 0.3);
  color: var(--muted);
}

.tag--negative {
  border-color: rgba(239, 68, 68, 0.3);
  color: var(--danger);
}

.tag__count {
  font-size: 0.75rem;
  opacity: 0.8;
  font-family: "Courier New", monospace;
}
</style>
