<template>
  <div class="view">
    <GameHeader :show-round="true" :show-phase="true" />

    <!-- Tous ont vu → démarrer les indices -->
    <template v-if="allRevealed">
      <div class="center-block anim-scaleIn">
        <div class="big-check">✓</div>
        <h2>Tout le monde est prêt</h2>
        <p class="text-muted">Place aux indices !</p>
        <button class="btn btn--primary btn--lg mt-4" @click="game.startCluePhase()">
          COMMENCER LES INDICES
        </button>
      </div>
    </template>

    <!-- Passe le téléphone -->
    <template v-else-if="!showing">
      <div class="pass-screen anim-fadeInUp">
        <div class="pass-counter">{{ currentIndex + 1 }} / {{ totalPlayers }}</div>
        <div class="pass-name">{{ currentPlayer?.name }}</div>
        <p class="pass-instr">
          Passe le téléphone à <strong>{{ currentPlayer?.name }}</strong>.<br/>
          <span style="font-size:0.82rem;opacity:0.6">Ne montre pas l'écran aux autres.</span>
        </p>
        <button class="btn btn--primary btn--lg mt-4" @click="showing = true">
          VOIR MON MOT
        </button>
      </div>
    </template>

    <!-- Affichage secret -->
    <template v-else>
      <div class="reveal-wrap">
        <div class="reveal-who anim-fadeInUp">
          <div class="phase-indicator">Tour de {{ currentPlayer?.name }}</div>
        </div>
        <div class="anim-scaleIn delay-1">
          <SecretRole
            v-if="currentPlayer"
            :role="currentPlayer.role"
            :word="currentPlayer.word"
            @hide="onHide"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import GameHeader from '../components/GameHeader.vue'
import SecretRole from '../components/SecretRole.vue'
import { useGameStore } from '../stores/game.js'

const game = useGameStore()
const showing = ref(false)

const totalPlayers  = computed(() => game.revealOrder.length)
const currentIndex  = computed(() => game.revealIndex)
const allRevealed   = computed(() => game.revealIndex >= game.revealOrder.length)
const currentPlayer = computed(() => {
  if (allRevealed.value) return null
  const id = game.revealOrder[game.revealIndex]
  return game.players.find(p => p.id === id) || null
})

function onHide() {
  showing.value = false
  game.nextReveal()
}
</script>

<style scoped>
.pass-screen {
  display: flex; flex-direction: column;
  flex: 1; justify-content: center;
  text-align: center; gap: 1.25rem;
}

.pass-counter {
  font-size: 0.75rem; font-weight: 800;
  text-transform: uppercase; letter-spacing: 2px;
  color: var(--white-muted);
}

.pass-name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.2rem, 11vw, 3.5rem);
  font-weight: 700;
  color: var(--white);
  letter-spacing: -1px;
}

.pass-instr { color: var(--white-muted); font-size: 0.95rem; }

.reveal-wrap {
  display: flex; flex-direction: column;
  flex: 1; justify-content: center; gap: 1.5rem;
}

.reveal-who { text-align: center; }

.center-block {
  display: flex; flex-direction: column;
  flex: 1; align-items: center; justify-content: center;
  text-align: center; gap: 1rem;
}

.big-check {
  width: 80px; height: 80px; border-radius: 50%;
  background: var(--green-dim);
  border: 2px solid var(--green);
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem; color: var(--green); font-weight: 900;
}
</style>
