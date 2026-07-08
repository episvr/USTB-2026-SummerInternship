<template>
  <div class="stat-card" :class="{ updated }">
    <div class="stat-icon" :style="{ background: `${color}22` }">
      <span :style="{ filter: 'brightness(1.2)' }">{{ icon }}</span>
    </div>
    <div class="stat-body">
      <div class="stat-label">{{ label }}</div>
      <div class="stat-value" :style="{ color }">{{ formatted }}</div>
      <div class="stat-bar" :style="{ background: `${color}33` }">
        <div class="stat-bar-fill" :style="{ width: barWidth, background: `linear-gradient(90deg, ${color}, ${color}88)` }"></div>
      </div>
      <div class="stat-sub" v-if="sub">{{ sub }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  label: String, value: [String, Number], sub: String,
  icon: { type: String, default: '📊' },
  color: { type: String, default: '#409eff' },
  barWidth: { type: String, default: '60%' },
})

const updated = ref(false)
watch(() => props.value, () => {
  updated.value = true
  setTimeout(() => updated.value = false, 600)
})

const formatted = computed(() => {
  if (typeof props.value === 'number') {
    if (props.value > 1e6) return (props.value / 1e6).toFixed(1) + 'M'
    if (props.value > 1e3) return (props.value / 1e3).toFixed(1) + 'K'
    return props.value.toLocaleString()
  }
  return props.value ?? '-'
})
</script>

<style scoped>
.stat-bar {
  height: 2px;
  border-radius: 1px;
  margin: 5px 0 3px;
  overflow: hidden;
}
.stat-bar-fill {
  height: 100%;
  border-radius: 1px;
  transition: width 0.6s ease;
}
</style>
