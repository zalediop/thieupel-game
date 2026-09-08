<template>
  <div
    class="vote-card"
    :class="{ 'vote-card--active': selected }"
    @click="$emit('select')"
  >
    <div class="vc-avatar">{{ initials }}</div>
    <div class="vc-name">{{ player.name }}</div>
    <div class="vc-check">
      <span v-if="selected">✓</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  player: { type: Object, required: true },
  selected: { type: Boolean, default: false },
})

defineEmits(['select'])

const initials = computed(() =>
  (props.player.name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
)
</script>

<style scoped>
.vote-card {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.9rem 1rem;
  background: var(--dark-mid);
  border: 2px solid var(--white-dim);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all var(--transition);
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.vote-card--active {
  border-color: var(--green);
  background: var(--green-dim);
}

.vc-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--dark-soft);
  border: 2px solid var(--white-dim);
  display: flex; align-items: center; justify-content: center;
  font-weight: 900; font-size: 0.9rem; color: var(--white-muted);
  flex-shrink: 0;
  transition: all var(--transition);
}

.vote-card--active .vc-avatar {
  border-color: var(--green);
  color: var(--green);
}

.vc-name { flex: 1; font-weight: 700; font-size: 1rem; }

.vc-check {
  width: 26px; height: 26px; border-radius: 50%;
  border: 2px solid var(--white-dim);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.85rem; font-weight: 900; color: var(--dark);
  background: transparent;
  transition: all var(--transition);
}

.vote-card--active .vc-check {
  background: var(--green);
  border-color: var(--green);
}
</style>
