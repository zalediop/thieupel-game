<template>
  <div class="view view--center">
    <div class="reveal-content">

      <!-- Phase 1 : nom -->
      <div v-if="phase >= 1" class="r-block anim-fadeInUp">
        <p class="r-label">LE JOUEUR ÉLIMINÉ EST…</p>
        <div class="r-name anim-scaleIn delay-2">{{ eliminated?.name }}</div>
      </div>

      <!-- Phase 2 : rôle réel -->
      <div v-if="phase >= 2" class="r-block anim-fadeInUp delay-2">
        <p class="r-sub">Son vrai rôle était…</p>
        <div class="r-role" :class="'r-role--' + eliminated?.role">
          {{ roleName }}
        </div>
        <p class="r-words-note">Les mots seront révélés à la fin de la partie.</p>
      </div>

      <!-- Actions -->
      <div v-if="phase >= 2" class="r-actions anim-fadeInUp delay-4">
        <button
          v-if="eliminated?.role === 'mrwhite'"
          class="btn btn--secondary btn--lg"
          @click="game.startWhiteGuess()"
        >
          ⚪ Dernière chance — Mr. White
        </button>
        <button v-else class="btn btn--primary btn--lg" @click="continueGame">
          CONTINUER
        </button>
      </div>
    </div>

    <!-- Bouton avancement manuel -->
    <button v-if="phase < 2" class="btn btn--ghost advance-btn" @click="phase++">
      Révéler →
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '../stores/game.js'

const game = useGameStore()
const phase = ref(0)

const eliminated = computed(() => game.players.find(p => p.id === game.eliminatedPlayerId))

const roleName = computed(() => ({
  citizen:    'CITOYEN',
  undercover: 'UNDERCOVER',
  mrwhite:    'MR. WHITE',
}[eliminated.value?.role] || ''))

onMounted(() => {
  setTimeout(() => { phase.value = 1 }, 200)
  setTimeout(() => { phase.value = 2 }, 1600)
})

function continueGame() {
  game.computeRoundPoints()
}
</script>

<style scoped>
.view { justify-content: center; }

.reveal-content {
  display: flex; flex-direction: column;
  align-items: center; gap: 2rem;
  width: 100%; max-width: 400px;
}

.r-block { text-align: center; width: 100%; }

.r-label {
  font-size: 0.72rem; font-weight: 800;
  letter-spacing: 3px; text-transform: uppercase;
  color: var(--white-muted); margin-bottom: 0.5rem;
}

.r-name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 12vw, 4rem);
  font-weight: 700; color: var(--white); letter-spacing: -1px;
}

.r-sub {
  font-size: 0.75rem; font-weight: 800;
  letter-spacing: 2px; text-transform: uppercase;
  color: var(--white-muted); margin-bottom: 0.75rem;
}

.r-role {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2rem; font-weight: 700;
  letter-spacing: 2px; text-transform: uppercase;
  padding: 0.5rem 1.5rem;
  border-radius: var(--radius);
  display: inline-block;
}

/* Couleurs des rôles révélés */
.r-role--citizen    { background: var(--green-dim); color: var(--green); border: 2px solid var(--green); }
.r-role--undercover { background: var(--white-ghost); color: var(--white); border: 2px solid var(--white-dim); }
.r-role--mrwhite    { background: var(--white-ghost); color: var(--white-muted); border: 2px solid var(--white-dim); }

.r-words-note {
  font-size: 0.8rem;
  color: var(--white-dim);
  font-style: italic;
  margin-top: 0.75rem;
  text-align: center;
}

.r-actions { width: 100%; display: flex; flex-direction: column; gap: 0.75rem; }

.advance-btn {
  position: fixed;
  bottom: calc(2rem + env(safe-area-inset-bottom));
  left: 1.25rem; right: 1.25rem;
  max-width: 480px; margin: 0 auto;
}
</style>
