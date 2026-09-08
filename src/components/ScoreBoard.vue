<template>
  <div class="scoreboard">
    <div
      v-for="(entry, index) in entries"
      :key="entry.id"
      class="sb-row anim-fadeInUp"
      :style="{ animationDelay: `${index * 0.07}s` }"
    >
      <div class="sb-rank">
        <span v-if="index === 0">🥇</span>
        <span v-else-if="index === 1">🥈</span>
        <span v-else-if="index === 2">🥉</span>
        <span v-else class="sb-num">{{ index + 1 }}</span>
      </div>
      <div class="sb-avatar">{{ initials(entry.name) }}</div>
      <div class="sb-info">
        <div class="sb-name">{{ entry.name }}</div>
        <div class="score-bar">
          <div
            class="score-bar-fill"
            :style="{ width: maxScore > 0 ? (entry.totalScore / maxScore * 100) + '%' : '0%' }"
          />
        </div>
      </div>
      <div class="sb-pts">{{ entry.totalScore }}<span class="pts-unit"> pts</span></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  entries: { type: Array, required: true },
})

const maxScore = computed(() => Math.max(...props.entries.map(e => e.totalScore), 1))

function initials(name) {
  return (name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}
</script>

<style scoped>
.scoreboard { display: flex; flex-direction: column; gap: 0.5rem; }

.sb-row {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.8rem 1rem;
  background: var(--dark-mid);
  border-radius: var(--radius);
  border: 1px solid var(--white-dim);
}

.sb-rank { font-size: 1.3rem; width: 2rem; text-align: center; flex-shrink: 0; }
.sb-num  { font-weight: 800; color: var(--white-muted); font-size: 1rem; }

.sb-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--dark-soft);
  border: 2px solid var(--green);
  display: flex; align-items: center; justify-content: center;
  font-weight: 900; font-size: 0.8rem; color: var(--green);
  flex-shrink: 0;
}

.sb-info    { flex: 1; min-width: 0; }
.sb-name    { font-weight: 700; margin-bottom: 0.3rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sb-pts     { font-size: 1.2rem; font-weight: 900; color: var(--green); white-space: nowrap; }
.pts-unit   { font-size: 0.65rem; color: var(--white-muted); font-weight: 600; }
</style>
