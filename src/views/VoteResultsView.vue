<template>
  <div class="view">
    <GameHeader :show-round="true" />

    <div class="anim-fadeInUp"><h2>Résultats du vote</h2></div>

    <!-- Égalité -->
    <template v-if="isTie && !resolved">
      <div class="tie-box anim-scaleIn delay-1">
        <div style="font-size:3rem">⚖</div>
        <h2>ÉGALITÉ</h2>
        <p class="text-muted">Même nombre de votes.</p>
        <div class="tie-names">
          <div v-for="id in tiePlayers" :key="id" class="tie-name-row">
            <div class="t-avatar">{{ initials(getPlayer(id)?.name) }}</div>
            <span>{{ getPlayer(id)?.name }}</span>
            <strong class="text-green">{{ voteCounts[id] }} vote{{ voteCounts[id] !== 1 ? 's' : '' }}</strong>
          </div>
        </div>
      </div>
      <div class="tie-actions anim-fadeInUp delay-3">
        <button class="btn btn--danger" @click="doTie">🗳 Vote de départage</button>
        <button class="btn btn--ghost btn--sm" @click="noElim">Personne n'est éliminé</button>
      </div>
    </template>

    <!-- Résultats normaux -->
    <template v-else>
      <div class="results-list anim-fadeInUp delay-1">
        <div
          v-for="(e, i) in sorted"
          :key="e.id"
          class="res-row"
          :class="{ 'res-row--top': i === 0 }"
          :style="{ animationDelay: `${i * 0.08}s` }"
        >
          <div class="r-avatar">{{ initials(e.name) }}</div>
          <div class="r-info">
            <div class="r-name">{{ e.name }}</div>
            <div class="vote-track">
              <div class="vote-fill" :style="{ width: maxV > 0 ? (e.count / maxV * 100) + '%' : '0%' }" />
            </div>
          </div>
          <div class="r-count">{{ e.count }}<span class="r-unit"> v</span></div>
        </div>
      </div>

      <div class="spacer" />

      <button
        class="btn btn--danger btn--lg anim-fadeInUp delay-4"
        :disabled="!top"
        @click="eliminate"
      >
        ÉLIMINER {{ top?.name?.toUpperCase() }}
      </button>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import GameHeader from '../components/GameHeader.vue'
import { useGameStore } from '../stores/game.js'

const game = useGameStore()
const resolved = ref(false)

const data = computed(() => game.computeVoteResults())
const voteCounts = computed(() => data.value.voteCounts)
const maxV = computed(() => data.value.maxVotes)
const tiePlayers = computed(() => data.value.topPlayers)
const isTie = computed(() => data.value.topPlayers.length > 1)

const sorted = computed(() =>
  game.players.filter(p => p.alive)
    .map(p => ({ id: p.id, name: p.name, count: voteCounts.value[p.id] || 0 }))
    .sort((a, b) => b.count - a.count)
)

const top = computed(() => {
  if (isTie.value) return null
  return game.players.find(p => p.id === data.value.topPlayers[0]) || null
})

function initials(name) {
  return (name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}
function getPlayer(id) { return game.players.find(p => p.id === id) }

function eliminate() {
  if (!top.value) return
  game.eliminatePlayer(top.value.id)
}
function doTie() {
  game.setTie(tiePlayers.value)
  game.startTieBreaker()
}
function noElim() {
  resolved.value = true
  game.noElimination()
}
</script>

<style scoped>
.results-list { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.75rem; }

.res-row {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.8rem 1rem;
  background: var(--dark-mid);
  border: 1px solid var(--white-dim);
  border-radius: var(--radius);
  animation: fadeInUp 0.4s ease both;
}

.res-row--top {
  border-color: rgba(255,100,100,0.5);
  background: rgba(180,40,40,0.15);
}

.r-avatar {
  width: 38px; height: 38px; border-radius: 50%;
  background: var(--dark-soft); border: 2px solid var(--white-dim);
  display: flex; align-items: center; justify-content: center;
  font-weight: 900; font-size: 0.85rem; color: var(--white-muted);
  flex-shrink: 0;
}

.res-row--top .r-avatar { border-color: rgba(255,100,100,0.5); color: #ff9090; }

.r-info { flex: 1; min-width: 0; }
.r-name { font-weight: 700; margin-bottom: 0.3rem; }

.vote-track {
  height: 5px; background: var(--white-ghost); border-radius: 999px; overflow: hidden;
}
.vote-fill {
  height: 100%; background: rgba(255,100,100,0.7); border-radius: 999px;
  transition: width 0.8s ease;
}

.res-row--top .vote-fill { background: rgba(255,100,100,0.9); }

.r-count {
  font-size: 1.2rem; font-weight: 900; white-space: nowrap; color: var(--white);
}
.r-unit { font-size: 0.65rem; color: var(--white-muted); font-weight: 600; }

/* Égalité */
.tie-box {
  background: var(--dark-mid);
  border: 2px solid var(--white-dim);
  border-radius: var(--radius-xl);
  padding: 2rem; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 1rem;
  margin-top: 0.75rem;
}

.tie-names { display: flex; flex-direction: column; gap: 0.5rem; width: 100%; }
.tie-name-row {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.65rem 1rem;
  background: var(--dark-soft); border-radius: var(--radius);
}
.tie-name-row span { flex: 1; font-weight: 700; }

.t-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--dark); border: 1.5px solid var(--white-dim);
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 0.8rem; color: var(--white-muted);
  flex-shrink: 0;
}

.tie-actions { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; }
</style>
