<template>
  <div class="view">
    <GameHeader :show-round="true" />

    <div class="anim-fadeInUp">
      <h2>Résultat — Manche {{ game.round }}</h2>
    </div>

    <!-- Victoire -->
    <div v-if="victory" class="victory-banner anim-scaleIn delay-1" :class="'vb--' + victory.winner">
      <p class="vb-title">{{ victoryTitle }}</p>
      <p class="vb-desc">{{ victoryDesc }}</p>
    </div>

    <!-- Points de manche -->
    <div class="anim-fadeInUp delay-2">
      <div class="section-title">Points gagnés cette manche</div>
      <div class="pts-list">
        <div
          v-for="(e, i) in ptEntries"
          :key="e.id"
          class="pts-row"
          :style="{ animationDelay: `${i * 0.06}s` }"
        >
          <div class="pt-avatar">{{ initials(e.name) }}</div>
          <div class="pt-info">
            <span class="pt-name">{{ e.name }}</span>
            <span class="badge badge--neutral" style="font-size:0.65rem">{{ roleLabel(e.role) }}</span>
          </div>
          <div class="pt-pts" :class="{ 'pt-pts--pos': e.pts > 0 }">
            +{{ e.pts }}
          </div>
        </div>
      </div>
    </div>

    <!-- Classement -->
    <div class="anim-fadeInUp delay-3">
      <div class="section-title">Classement actuel</div>
      <ScoreBoard :entries="game.sortedScores" />
    </div>

    <div class="spacer" />

    <div class="alive-note anim-fadeInUp delay-4">
      {{ aliveCount }} joueur{{ aliveCount !== 1 ? 's' : '' }} encore en jeu
    </div>

    <div class="rr-actions anim-fadeInUp delay-5">
      <button class="btn btn--primary btn--lg" @click="next">
        {{ isLast || victory ? 'CLASSEMENT FINAL' : 'MANCHE SUIVANTE' }}
      </button>
      <button class="btn btn--ghost btn--sm" style="width:auto;align-self:center" @click="game.goToFinal()">
        Terminer la partie
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import GameHeader from '../components/GameHeader.vue'
import ScoreBoard from '../components/ScoreBoard.vue'
import { useGameStore } from '../stores/game.js'

const game = useGameStore()
const roundPts = ref({})

onMounted(() => {
  const last = game.roundHistory[game.roundHistory.length - 1]
  if (last) roundPts.value = last.points || {}
})

const victory   = computed(() => game.checkVictory())
const isLast    = computed(() => game.totalRounds > 0 && game.round >= game.totalRounds)
const aliveCount = computed(() => game.players.filter(p => p.alive).length)

const victoryTitle = computed(() => ({
  citizen:    '🟢 CITOYENS GAGNENT !',
  undercover: 'UNDERCOVER GAGNENT !',
  mrwhite:    '⚪ MR. WHITE GAGNE !',
}[victory.value?.winner] || ''))

const victoryDesc = computed(() => ({
  eliminated_all: 'Tous les infiltrés éliminés !',
  dominated: 'Les Undercover contrôlent le vote !',
  guess:     'Mr. White a trouvé le mot !',
}[victory.value?.reason] || ''))

const ptEntries = computed(() =>
  game.players
    .map(p => ({ id: p.id, name: p.name, role: p.role, pts: roundPts.value[p.id] || 0 }))
    .sort((a, b) => b.pts - a.pts)
)

function initials(n) {
  return (n || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}
function roleLabel(r) {
  return { citizen: 'Citoyen', undercover: 'Undercover', mrwhite: 'Mr. White' }[r] || r
}

function next() {
  if (victory.value || isLast.value) game.goToFinal()
  else game.nextRound()
}
</script>

<style scoped>
.victory-banner {
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  text-align: center;
  border: 2px solid var(--white-dim);
  background: var(--dark-mid);
}
.vb--citizen    { border-color: var(--green); background: var(--green-dim); }
.vb--undercover { border-color: var(--white-dim); }
.vb--mrwhite    { border-color: var(--white-dim); }

.vb-title { font-size: 1.2rem; font-weight: 900; margin-bottom: 0.25rem; }
.vb--citizen .vb-title { color: var(--green); }
.vb-desc  { font-size: 0.875rem; color: var(--white-muted); }

.pts-list { display: flex; flex-direction: column; gap: 0.45rem; }

.pts-row {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.7rem 0.9rem;
  background: var(--dark-mid);
  border: 1px solid var(--white-dim);
  border-radius: var(--radius);
  animation: fadeInUp 0.35s ease both;
}

.pt-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--dark-soft); border: 1.5px solid var(--white-dim);
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 0.8rem; color: var(--white-muted);
  flex-shrink: 0;
}

.pt-info   { flex: 1; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.pt-name   { font-weight: 700; }
.pt-pts    { font-size: 1.1rem; font-weight: 900; color: var(--white-muted); min-width: 2rem; text-align: right; }
.pt-pts--pos { color: var(--green); }

.alive-note {
  text-align: center; font-size: 0.85rem;
  font-weight: 700; color: var(--white-muted);
  margin-bottom: 0.5rem;
}

.rr-actions { display: flex; flex-direction: column; gap: 0.6rem; }
</style>
