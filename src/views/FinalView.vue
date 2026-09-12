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

    <div class="spacer" />

    <!-- Mots de la partie -->
    <div class="anim-fadeInUp delay-2">
      <div class="section-title">Les mots de la partie 🔓</div>
      <div class="words-history">
        <div v-for="(r, i) in game.roundHistory" :key="i" class="words-round">
          <div class="words-round-label">Manche {{ r.round }}</div>
          <div class="words-simple">
            <div class="ws-row"><span class="ws-label">Citoyen :</span> <span class="ws-citizen">{{ r.citizenWord }}</span></div>
            <div class="ws-row"><span class="ws-label">Undercover :</span> <span class="ws-under">{{ r.undercoverWord }}</span></div>
          </div>
        </div>
      </div>
    </div>

    <div class="final-actions anim-fadeInUp delay-3">
      <button class="btn btn--primary btn--lg" @click="newGame">NOUVELLE PARTIE</button>
      <button class="btn btn--secondary" @click="replay">Rejouer avec les mêmes joueurs</button>
    </div>
  </div>
</template>

<script setup>
import ScoreBoard from '../components/ScoreBoard.vue'
import { useGameStore } from '../stores/game.js'

const game = useGameStore()

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

.final-actions { display: flex; flex-direction: column; gap: 0.75rem; }

.words-history { display: flex; flex-direction: column; gap: 0.75rem; }

.words-round {
  padding: 0.75rem 1rem;
  background: var(--dark-mid);
  border: 1px solid var(--white-dim);
  border-radius: var(--radius);
}

.words-round-label {
  font-size: 0.68rem; font-weight: 800;
  text-transform: uppercase; letter-spacing: 1.5px;
  color: var(--white-muted); margin-bottom: 0.4rem;
}

.words-simple { display: flex; flex-direction: column; gap: 0.2rem; }

.ws-row {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.95rem; font-weight: 700;
  letter-spacing: 1px; text-transform: uppercase;
}

.ws-label   { color: var(--white-muted); font-weight: 600; }
.ws-citizen { color: var(--green); }
.ws-under   { color: var(--white); }
</style>
