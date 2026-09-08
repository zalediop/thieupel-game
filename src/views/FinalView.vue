<template>
  <div class="view">
    <div class="final-header anim-fadeInUp">
      <div class="brand-logo" style="font-size:2.5rem">THIEUPEL</div>
      <h2 class="mt-1">FIN DE PARTIE</h2>
      <p class="text-muted">{{ game.round }} manche{{ game.round !== 1 ? 's' : '' }} jouée{{ game.round !== 1 ? 's' : '' }}</p>
    </div>

    <!-- Classement -->
    <div class="anim-fadeInUp delay-1">
      <div class="section-title">Classement final</div>
      <ScoreBoard :entries="game.sortedScores" />
    </div>

    <!-- Titres -->
    <div class="anim-fadeInUp delay-2">
      <div class="section-title">Titres & récompenses</div>
      <div class="titles-list">
        <div v-for="t in titles" :key="t.label" class="title-row">
          <div class="title-ico">{{ t.emoji }}</div>
          <div>
            <div class="title-lbl">{{ t.label }}</div>
            <div class="title-win">{{ t.winner || '—' }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="anim-fadeInUp delay-3">
      <div class="section-title">Statistiques</div>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-val">{{ game.round }}</div>
          <div class="stat-lbl">Manches</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">{{ totalElim }}</div>
          <div class="stat-lbl">Éliminations</div>
        </div>
        <div class="stat-card" style="grid-column: span 2">
          <div class="stat-val" style="font-size:1.2rem">{{ topScorer?.name || '—' }}</div>
          <div class="stat-lbl">Meilleur score — {{ topScorer?.totalScore || 0 }} pts</div>
        </div>
      </div>
    </div>

    <div class="spacer" />

    <div class="final-actions anim-fadeInUp delay-5">
      <button class="btn btn--primary btn--lg" @click="newGame">NOUVELLE PARTIE</button>
      <button class="btn btn--secondary" @click="replay">Rejouer avec les mêmes joueurs</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ScoreBoard from '../components/ScoreBoard.vue'
import { useGameStore } from '../stores/game.js'

const game = useGameStore()

const ct = computed(() => game.computeTitles())

const titles = computed(() => [
  { emoji: '🎖', label: 'Meilleur citoyen',    winner: ct.value.bestCitizen },
  { emoji: '🕵', label: 'Meilleur Undercover', winner: ct.value.bestUndercover },
  { emoji: '🎭', label: 'Meilleur bluffeur',   winner: ct.value.bestBluffer },
  { emoji: '🔍', label: 'Meilleur détective',  winner: ct.value.bestDetective },
])

const totalElim  = computed(() => game.roundHistory.filter(r => r.eliminatedId !== null).length)
const topScorer  = computed(() => game.sortedScores[0] || null)

function newGame() {
  game.resetGame()
  game.goToPhase('setup')
}

function replay() {
  const names = game.playerNames.slice()
  const uc = game.numUndercover
  const mw = game.numMrWhite
  const rounds = game.totalRounds
  game.resetGame()
  game.setPlayerNames(names)
  game.setConfig({ totalRounds: rounds, numUndercover: uc, numMrWhite: mw })
  game.startGame()
}
</script>

<style scoped>
.final-header { text-align: center; }

.titles-list { display: flex; flex-direction: column; gap: 0.5rem; }

.title-row {
  display: flex; align-items: center; gap: 1rem;
  padding: 0.85rem 1rem;
  background: var(--dark-mid);
  border: 1px solid var(--white-dim);
  border-radius: var(--radius);
}

.title-ico  { font-size: 1.6rem; flex-shrink: 0; }
.title-lbl  { font-size: 0.72rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--white-muted); }
.title-win  { font-size: 1.05rem; font-weight: 800; }

.stats-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;
}

.stat-card {
  background: var(--dark-mid);
  border: 1px solid var(--white-dim);
  border-radius: var(--radius);
  padding: 1rem; text-align: center;
}

.stat-val {
  font-size: 1.6rem; font-weight: 900;
  color: var(--green); word-break: break-word;
}

.stat-lbl {
  font-size: 0.72rem; font-weight: 700;
  color: var(--white-muted); text-transform: uppercase;
  letter-spacing: 0.5px; margin-top: 0.2rem;
}

.final-actions { display: flex; flex-direction: column; gap: 0.75rem; }
</style>
