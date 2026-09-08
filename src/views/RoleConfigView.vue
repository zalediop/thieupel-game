<template>
  <div class="view">
    <GameHeader />

    <div class="anim-fadeInUp">
      <div class="phase-indicator mb-2">Rôles</div>
      <h2>Configuration des rôles</h2>
      <p class="text-muted mt-1" style="font-size:0.9rem">{{ game.totalPlayers }} joueurs · Min. 2 citoyens</p>
    </div>

    <!-- Presets -->
    <div class="anim-fadeInUp delay-1">
      <div class="section-title">Presets rapides</div>
      <div class="preset-grid">
        <button
          v-for="p in presets" :key="p.label"
          class="preset-chip"
          :class="{ active: activePreset === p.label }"
          @click="applyPreset(p)"
          :disabled="!isValid(p)"
        >
          <div class="pc-name">{{ p.label }}</div>
          <div class="pc-sub">{{ p.uc }} UC · {{ p.mw }} MW</div>
        </button>
      </div>
    </div>

    <hr class="divider" />

    <!-- Undercover -->
    <div class="role-row anim-fadeInUp delay-2">
      <div class="role-info">
        <div class="role-dot dot--white"></div>
        <div>
          <div class="role-name">Undercover</div>
          <div class="role-hint">Mot différent, même univers</div>
        </div>
      </div>
      <div class="counter">
        <button class="counter__btn" :disabled="numUC <= 0" @click="numUC--; activePreset=''">−</button>
        <span class="counter__val">{{ numUC }}</span>
        <button class="counter__btn" :disabled="!canAddUC" @click="numUC++; activePreset=''">+</button>
      </div>
    </div>

    <!-- Mr. White -->
    <div class="role-row anim-fadeInUp delay-3">
      <div class="role-info">
        <div class="role-dot dot--dim"></div>
        <div>
          <div class="role-name">Mr. White</div>
          <div class="role-hint">Aucun mot, bluff total</div>
        </div>
      </div>
      <div class="counter">
        <button class="counter__btn" :disabled="numMW <= 0" @click="numMW--; activePreset=''">−</button>
        <span class="counter__val">{{ numMW }}</span>
        <button class="counter__btn" :disabled="!canAddMW" @click="numMW++; activePreset=''">+</button>
      </div>
    </div>

    <!-- Résumé -->
    <div class="summary anim-fadeInUp delay-3">
      <div class="sum-row">
        <span><span class="dot--green role-dot"></span> Citoyens</span>
        <strong :class="{ 'text-green': numCitizens >= 2 }">{{ numCitizens }}</strong>
      </div>
      <div class="sum-row">
        <span><span class="dot--white role-dot"></span> Undercover</span>
        <strong>{{ numUC }}</strong>
      </div>
      <div class="sum-row">
        <span><span class="dot--dim role-dot"></span> Mr. White</span>
        <strong>{{ numMW }}</strong>
      </div>
    </div>

    <hr class="divider" />

    <!-- Manches -->
    <div class="anim-fadeInUp delay-4">
      <div class="section-title">Nombre de manches</div>
      <div class="round-grid">
        <button
          v-for="r in roundOptions" :key="r.value"
          class="preset-chip"
          :class="{ active: totalRounds === r.value }"
          @click="totalRounds = r.value"
        >{{ r.label }}</button>
      </div>
    </div>

    <div class="spacer" />

    <div v-if="configError" class="err-msg anim-fadeInUp">⚠ {{ configError }}</div>

    <div class="row-actions anim-fadeInUp delay-5">
      <button class="btn btn--ghost btn--sm" style="width:auto" @click="game.goToPhase('setup')">← Retour</button>
      <button class="btn btn--primary" :disabled="!!configError" @click="confirm">
        LANCER LA PARTIE
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import GameHeader from '../components/GameHeader.vue'
import { useGameStore } from '../stores/game.js'

const game = useGameStore()

const numUC = ref(1)
const numMW = ref(0)
const totalRounds = ref(5)
const activePreset = ref('Classique')

const presets = [
  { label: 'Classique', uc: 1, mw: 0 },
  { label: 'Difficile',  uc: 1, mw: 1 },
  { label: 'Très dur',   uc: 2, mw: 1 },
  { label: 'Chaos',      uc: 2, mw: 2 },
]

const roundOptions = [
  { label: '3', value: 3 },
  { label: '5', value: 5 },
  { label: '7', value: 7 },
  { label: '10', value: 10 },
  { label: '∞', value: 0 },
]

const maxSpecial  = computed(() => game.totalPlayers - 2)
const numCitizens = computed(() => game.totalPlayers - numUC.value - numMW.value)
const canAddUC    = computed(() => numUC.value + numMW.value < maxSpecial.value)
const canAddMW    = computed(() => numUC.value + numMW.value < maxSpecial.value)

const configError = computed(() => {
  if (numCitizens.value < 2) return 'Il faut au minimum 2 citoyens.'
  if (numUC.value + numMW.value >= game.totalPlayers) return 'Trop de rôles spéciaux.'
  return ''
})

function isValid(p) { return p.uc + p.mw <= maxSpecial.value }

function applyPreset(p) {
  if (!isValid(p)) return
  numUC.value = p.uc
  numMW.value = p.mw
  activePreset.value = p.label
}

function confirm() {
  if (configError.value) return
  game.setConfig({ totalRounds: totalRounds.value, numUndercover: numUC.value, numMrWhite: numMW.value })
  game.startGame()
}
</script>

<style scoped>
.role-row {
  display: flex; align-items: center; justify-content: space-between;
  gap: 1rem; padding: 0.9rem 0;
}

.role-info { display: flex; align-items: center; gap: 0.75rem; flex: 1; }

.role-dot {
  width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0;
}
.dot--green { background: var(--green); }
.dot--white { background: var(--white); }
.dot--dim   { background: var(--white-dim); border: 1px solid var(--white-muted); }

.role-name { font-weight: 800; font-size: 1rem; }
.role-hint { font-size: 0.78rem; color: var(--white-muted); }

.summary {
  background: var(--dark-mid);
  border: 1px solid var(--white-dim);
  border-radius: var(--radius);
  padding: 0.9rem 1.1rem;
  display: flex; flex-direction: column; gap: 0.45rem;
}

.sum-row {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 0.9rem;
}

.sum-row span { display: flex; align-items: center; gap: 0.5rem; }

.round-grid {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.4rem; margin-top: 0.5rem;
}

.pc-name { font-weight: 800; }
.pc-sub  { font-size: 0.72rem; color: var(--white-muted); margin-top: 0.1rem; }

.err-msg {
  background: rgba(180,40,40,0.2);
  border: 1px solid rgba(255,100,100,0.4);
  color: #ff9090;
  padding: 0.7rem 1rem;
  border-radius: var(--radius);
  font-weight: 700; font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.row-actions { display: flex; gap: 0.75rem; align-items: center; }
</style>
