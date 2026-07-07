<template>
  <div class="stat-card">
    <div class="stat-card__icon" :class="`stat-card__icon--${variant}`">
      {{ icon }}
    </div>
    <div class="stat-card__body">
      <span class="stat-card__label">{{ label }}</span>
      <span class="stat-card__value">{{ formattedValue }}</span>
      <span v-if="trend" class="stat-card__trend">{{ trend }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: String,
  label: String,
  value: [Number, String],
  variant: {
    type: String,
    default: 'primary'
  },
  trend: String
})

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString()
  }
  return props.value
})
</script>

<style scoped>
.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
}

.stat-card__icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.stat-card__icon--primary {
  background: rgba(59, 130, 246, 0.12);
  color: var(--primary);
}

.stat-card__icon--accent {
  background: rgba(139, 92, 246, 0.12);
  color: var(--accent);
}

.stat-card__icon--warning {
  background: rgba(245, 158, 11, 0.12);
  color: var(--warning);
}

.stat-card__icon--success {
  background: rgba(34, 197, 94, 0.12);
  color: var(--success);
}

.stat-card__icon--info {
  background: rgba(6, 182, 212, 0.12);
  color: #06b6d4;
}

.stat-card__icon--danger {
  background: rgba(239, 68, 68, 0.12);
  color: var(--danger);
}

.stat-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-card__label {
  font-size: 0.8rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-card__value {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text);
  font-family: "Courier New", monospace;
}

.stat-card__trend {
  font-size: 0.75rem;
  color: var(--success);
  margin-top: 0.2rem;
}
</style>
