<template>
  <header class="game-header">
    <div class="header-logo">THIEUPEL</div>
    <div class="header-right">
      <div v-if="showRound" class="header-round">
        M{{ game.round }}<span v-if="game.totalRounds > 0">/{{ game.totalRounds }}</span>
      </div>
      <div v-if="showPhase" class="phase-indicator">{{ phaseLabel }}</div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '../stores/game.js'

defineProps({
  showRound: { type: Boolean, default: false },
  showPhase: { type: Boolean, default: false },
})

const game = useGameStore()

const phaseLabels = {
  roleReveal: 'Distribution',
  clue: 'Indices',
  vote: 'Vote',
  voteResults: 'Résultats',
  reveal: 'Révélation',
}

const phaseLabel = computed(() => phaseLabels[game.phase] || '')
</script>

<style scoped>
.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1.25rem;
}

.header-logo {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: -0.5px;
  color: var(--green);
}

.header-right { display: flex; align-items: center; gap: 0.6rem; }

.header-round {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--white-muted);
  background: var(--dark-mid);
  border: 1px solid var(--white-dim);
  border-radius: 999px;
  padding: 0.3rem 0.75rem;
}
</style>
