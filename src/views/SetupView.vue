<template>
  <div class="view">
    <GameHeader />

    <!-- Étape 1 : Nombre de joueurs -->
    <template v-if="step === 1">
      <div class="anim-fadeInUp">
        <div class="phase-indicator mb-2">Configuration</div>
        <h2>Combien de joueurs ?</h2>
        <p class="text-muted mt-1" style="font-size:0.9rem">4 à 12 joueurs sur le même appareil</p>
      </div>

      <div class="count-grid anim-fadeInUp delay-2">
        <button
          v-for="n in counts"
          :key="n"
          class="count-btn"
          :class="{ active: numPlayers === n }"
          @click="numPlayers = n"
        >
          {{ n }}
        </button>
      </div>

      <div class="spacer" />

      <button class="btn btn--primary btn--lg anim-fadeInUp delay-3" @click="step = 2">
        CONTINUER
      </button>
    </template>

    <!-- Étape 2 : Noms -->
    <template v-else>
      <div class="anim-fadeInUp">
        <div class="phase-indicator mb-2">Joueurs</div>
        <h2>Noms des joueurs</h2>
        <p class="text-muted mt-1" style="font-size:0.9rem">{{ numPlayers }} joueurs</p>
      </div>

      <div class="names-list anim-fadeInUp delay-1">
        <div v-for="i in numPlayers" :key="i" class="name-row">
          <div class="name-num">{{ i }}</div>
          <input
            v-model="names[i - 1]"
            class="input"
            :placeholder="`Joueur ${i}`"
            maxlength="20"
            @keydown.enter="focusNext(i)"
            :ref="el => inputRefs[i-1] = el"
          />
        </div>
      </div>

      <div class="row-actions anim-fadeInUp delay-2">
        <button class="btn btn--ghost btn--sm" style="width:auto" @click="step = 1">← Retour</button>
        <button class="btn btn--primary" :disabled="!allValid" @click="confirm">
          CONTINUER
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import GameHeader from '../components/GameHeader.vue'
import { useGameStore } from '../stores/game.js'

const game = useGameStore()
const step = ref(1)
const counts = [4, 5, 6, 7, 8, 9, 10, 11, 12]
const numPlayers = ref(6)
const names = ref(Array(12).fill(''))
const inputRefs = ref([])

const allValid = computed(() =>
  names.value.slice(0, numPlayers.value).every(n => n.trim().length >= 1)
)

function focusNext(i) {
  if (i < numPlayers.value) inputRefs.value[i]?.focus()
}

function confirm() {
  if (!allValid.value) return
  game.setPlayerNames(names.value.slice(0, numPlayers.value).map(n => n.trim()))
  game.goToPhase('roleConfig')
}
</script>

<style scoped>
.count-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
  margin-top: 1.5rem;
}

.count-btn {
  padding: 1.1rem;
  border-radius: var(--radius);
  border: 2px solid var(--white-dim);
  background: var(--dark-mid);
  color: var(--white);
  font-size: 1.5rem;
  font-weight: 900;
  cursor: pointer;
  transition: all var(--transition);
  -webkit-tap-highlight-color: transparent;
}

.count-btn:hover, .count-btn.active {
  border-color: var(--green);
  background: var(--green-dim);
  color: var(--green);
}

.names-list {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  margin-top: 1.25rem;
  max-height: 60vh;
  overflow-y: auto;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.name-num {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: var(--dark-soft);
  border: 1.5px solid var(--white-dim);
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; color: var(--white-muted);
  flex-shrink: 0; font-size: 0.9rem;
}

.row-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  align-items: center;
}
</style>
