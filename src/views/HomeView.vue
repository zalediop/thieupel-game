<template>
  <div class="view home-view">

    <!-- Logo -->
    <div class="home-top anim-fadeInUp">
      <div class="brand-logo">THIEUPEL</div>
      <div class="brand-tagline mt-1">Trouve les infiltrés. Bluffe. Survis.</div>
    </div>

    <!-- Règles -->
    <div class="rules-card anim-fadeInUp delay-2">
      <div class="rules-title">3 rôles · 1 mot · Beaucoup de bluff</div>
      <div class="rule-item">
        <span class="rule-dot dot--green"></span>
        <div>
          <strong>Citoyens</strong>
          <p>Vous avez le vrai mot. Débusquez les imposteurs !</p>
        </div>
      </div>
      <div class="rule-item">
        <span class="rule-dot dot--white"></span>
        <div>
          <strong>Undercover</strong>
          <p>Vous avez un mot proche mais différent. Bluffez !</p>
        </div>
      </div>
      <div class="rule-item">
        <span class="rule-dot dot--dim"></span>
        <div>
          <strong>Mr. White</strong>
          <p>Aucun mot. Écoutez, improvisez, survivez.</p>
        </div>
      </div>
    </div>

    <div class="spacer" />

    <!-- Actions -->
    <div class="home-actions anim-fadeInUp delay-4">
      <button class="btn btn--primary btn--lg" @click="startNew">
        JOUER
      </button>
      <button v-if="hasSaved" class="btn btn--secondary" @click="resume">
        ▶ Reprendre la partie
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '../stores/game.js'

const game = useGameStore()

const hasSaved = computed(() => {
  try {
    return !!localStorage.getItem('thieupel_game') && game.phase !== 'home' && game.players.length > 0
  } catch { return false }
})

function startNew() {
  game.resetGame()
  game.goToPhase('setup')
}

function resume() {
  game.load()
}
</script>

<style scoped>
.home-view {
  justify-content: center;
  gap: 2rem;
}

.home-top { text-align: center; }

.rules-card {
  background: var(--dark-mid);
  border: 1px solid var(--white-dim);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.rules-title {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--white-muted);
  text-align: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--white-dim);
}

.rule-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.rule-dot {
  width: 12px; height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
}

.dot--green { background: var(--green); }
.dot--white { background: var(--white); }
.dot--dim   { background: var(--white-dim); border: 1px solid var(--white-muted); }

.rule-item strong { display: block; font-size: 0.95rem; font-weight: 800; margin-bottom: 0.15rem; }
.rule-item p { font-size: 0.85rem; color: var(--white-muted); }

.home-actions { display: flex; flex-direction: column; gap: 0.75rem; }
</style>
