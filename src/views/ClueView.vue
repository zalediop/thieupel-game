<template>
  <div class="view">
    <GameHeader :show-round="true" :show-phase="true" />

    <!-- Tous les indices donnés -->
    <template v-if="allDone">
      <div class="center-block anim-scaleIn">
        <div class="big-icon">🗳</div>
        <h2>Indices donnés</h2>
        <p class="text-muted">Discutez, puis passez au vote.</p>
        <button class="btn btn--primary btn--lg mt-4" @click="game.startVotePhase()">
          PASSER AU VOTE
        </button>
      </div>
    </template>

    <template v-else>
      <!-- Barre de progression -->
      <div class="progress-row anim-fadeInUp">
        <span class="progress-label">{{ game.clueIndex + 1 }} / {{ game.clueOrder.length }}</span>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: pct + '%' }" />
        </div>
      </div>

      <!-- Carte du joueur actif -->
      <div class="clue-card anim-scaleIn delay-1">
        <div class="phase-indicator mb-2">Phase des indices</div>
        <p class="clue-tag">AU TOUR DE</p>
        <div class="clue-name">{{ currentPlayer?.name }}</div>
        <p class="clue-instr">Donne un seul indice à voix haute.</p>
      </div>

      <!-- Ordre -->
      <div class="anim-fadeInUp delay-2">
        <div class="section-title">Ordre</div>
        <div class="order-list">
          <div
            v-for="(id, idx) in game.clueOrder"
            :key="id"
            class="order-item"
            :class="{
              'order-item--done':    idx < game.clueIndex,
              'order-item--current': idx === game.clueIndex,
            }"
          >
            <div class="order-num">
              {{ idx < game.clueIndex ? '✓' : idx === game.clueIndex ? '→' : idx + 1 }}
            </div>
            <span>{{ getPlayer(id)?.name }}</span>
          </div>
        </div>
      </div>

      <div class="spacer" />

      <button class="btn btn--primary btn--lg anim-fadeInUp delay-2" @click="game.nextClue()">
        INDICE DONNÉ ✓
      </button>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import GameHeader from '../components/GameHeader.vue'
import { useGameStore } from '../stores/game.js'

const game = useGameStore()
const allDone = computed(() => game.clueIndex >= game.clueOrder.length)
const currentPlayer = computed(() => game.currentCluePlayer)
const pct = computed(() =>
  game.clueOrder.length ? (game.clueIndex / game.clueOrder.length) * 100 : 0
)

function getPlayer(id) { return game.players.find(p => p.id === id) }
</script>

<style scoped>
.progress-row {
  display: flex; align-items: center; gap: 0.75rem;
  font-size: 0.78rem; font-weight: 700; color: var(--white-muted);
}
.progress-label { flex-shrink: 0; }
.progress-track {
  flex: 1; height: 4px; background: var(--white-ghost);
  border-radius: 999px; overflow: hidden;
}
.progress-fill {
  height: 100%; background: var(--green); border-radius: 999px;
  transition: width 0.5s ease;
}

.clue-card {
  background: var(--dark-mid);
  border: 2px solid var(--green);
  border-radius: var(--radius-lg);
  padding: 2rem 1.5rem;
  text-align: center;
}

.clue-tag {
  font-size: 0.72rem; font-weight: 800;
  letter-spacing: 3px; text-transform: uppercase;
  color: var(--white-muted); margin-bottom: 0.5rem;
}

.clue-name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.8rem, 10vw, 3rem);
  font-weight: 700; color: var(--white);
  margin-bottom: 0.75rem;
}

.clue-instr { font-size: 0.9rem; color: var(--white-muted); }

.order-list { display: flex; flex-direction: column; gap: 0.4rem; }

.order-item {
  display: flex; align-items: center; gap: 0.6rem;
  padding: 0.6rem 0.9rem;
  background: var(--dark-mid);
  border: 1px solid var(--white-dim);
  border-radius: var(--radius);
  font-size: 0.9rem; font-weight: 600;
  transition: all var(--transition);
}

.order-item--done    { opacity: 0.4; }
.order-item--current { border-color: var(--green); background: var(--green-dim); color: var(--green); font-weight: 800; }

.order-num {
  width: 24px; height: 24px; border-radius: 50%;
  background: var(--dark-soft); border: 1px solid var(--white-dim);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.78rem; font-weight: 800; flex-shrink: 0;
}

.order-item--current .order-num {
  background: var(--green); border-color: var(--green); color: var(--dark);
}

.center-block {
  display: flex; flex-direction: column;
  flex: 1; align-items: center; justify-content: center;
  text-align: center; gap: 1rem;
}
.big-icon { font-size: 3.5rem; }
</style>
