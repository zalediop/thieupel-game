<template>
  <div class="view view--center">
    <div class="wg-content anim-scaleIn">
      <div class="wg-icon">⚪</div>
      <h2>DERNIÈRE CHANCE</h2>
      <p class="text-muted">Mr. White, tu as été découvert !</p>
      <p class="wg-q">Quel était le mot des citoyens ?</p>

      <template v-if="!answered">
        <div class="wg-form">
          <input
            v-model="guess"
            class="input wg-input"
            placeholder="Tape le mot…"
            maxlength="40"
            @keydown.enter="submit"
          />
          <button class="btn btn--primary btn--lg" :disabled="!guess.trim()" @click="submit">
            DEVINER
          </button>
        </div>
      </template>

      <template v-else>
        <div class="wg-result" :class="success ? 'wg-result--win' : 'wg-result--lose'">
          <div class="wg-r-icon">{{ success ? '✓' : '✕' }}</div>
          <p class="wg-r-title">{{ success ? 'BONNE RÉPONSE !' : 'MAUVAISE RÉPONSE' }}</p>
          <p v-if="success" class="text-muted">+7 points pour Mr. White !</p>
          <p v-else class="text-muted">Le mot était : <strong style="color:var(--green)">{{ game.citizenWord }}</strong></p>
        </div>
        <button class="btn btn--primary btn--lg mt-4" @click="game.computeRoundPoints()">
          CONTINUER
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGameStore } from '../stores/game.js'

const game = useGameStore()
const guess = ref('')
const answered = ref(false)
const success = ref(false)

function submit() {
  if (!guess.value.trim()) return
  success.value = game.submitWhiteGuess(guess.value)
  answered.value = true
}
</script>

<style scoped>
.wg-content {
  display: flex; flex-direction: column;
  align-items: center; gap: 1.25rem;
  width: 100%; text-align: center;
}

.wg-icon { font-size: 3rem; }

.wg-q { font-size: 1.05rem; font-weight: 700; }

.wg-form {
  display: flex; flex-direction: column;
  gap: 0.75rem; width: 100%;
}

.wg-input {
  text-align: center;
  font-size: 1.2rem;
  letter-spacing: 2px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 1rem;
}

.wg-result {
  display: flex; flex-direction: column;
  align-items: center; gap: 0.6rem;
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  width: 100%;
}

.wg-result--win  {
  background: var(--green-dim);
  border: 2px solid var(--green);
}
.wg-result--lose {
  background: rgba(180,40,40,0.15);
  border: 2px solid rgba(255,100,100,0.3);
}

.wg-r-icon {
  width: 60px; height: 60px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.75rem; font-weight: 900;
}

.wg-result--win  .wg-r-icon { background: var(--green-mid); color: var(--dark); }
.wg-result--lose .wg-r-icon { background: rgba(180,40,40,0.3); color: #ff9090; }

.wg-r-title { font-size: 1.2rem; font-weight: 900; }
.wg-result--win  .wg-r-title { color: var(--green); }
.wg-result--lose .wg-r-title { color: #ff9090; }
</style>
