<template>
  <div class="secret-wrap">
    <transition name="flip" mode="out-in">

      <!-- Recto : caché -->
      <div v-if="!revealed" key="hidden" class="secret-hidden" @click="reveal">
        <div class="hidden-icon">?</div>
        <p class="hidden-label">APPUIE POUR VOIR TON MOT</p>
      </div>

      <!-- Verso : révélé -->
      <div v-else key="shown" class="secret-card" :class="{ 'secret-card--mrwhite': role === 'mrwhite' }">

        <!-- CITOYEN ou UNDERCOVER : on voit juste le mot, sans savoir le rôle -->
        <template v-if="role === 'citizen' || role === 'undercover'">
          <p class="word-hint">TON MOT</p>
          <div class="big-word">{{ word }}</div>
          <p class="word-sub">Souviens-toi, puis cache l'écran.</p>
        </template>

        <!-- MR. WHITE : pas de mot, mais il sait qu'il est Mr. White -->
        <template v-else>
          <div class="mrwhite-icon">⚪</div>
          <p class="mrwhite-title">TU ES MR. WHITE</p>
          <p class="mrwhite-sub">Tu n'as aucun mot.</p>
          <p class="mrwhite-tip">Écoute les autres et bluff !</p>
        </template>

        <button class="btn btn--ghost hide-btn" @click="$emit('hide')">
          CACHER ✕
        </button>
      </div>

    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  role: { type: String, required: true }, // citizen | undercover | mrwhite
  word: { type: String, default: '' },
})

defineEmits(['hide'])

const revealed = ref(false)

function reveal() {
  revealed.value = true
}
</script>

<style scoped>
.secret-wrap { width: 100%; }

/* ── Recto : carte cachée ──────────────────────────────────── */
.secret-hidden {
  border-radius: var(--radius-xl);
  padding: 3.5rem 2rem;
  text-align: center;
  background: var(--dark-mid);
  border: 2px dashed var(--white-dim);
  cursor: pointer;
  transition: all var(--transition);
  user-select: none;
}

.secret-hidden:hover,
.secret-hidden:active {
  border-color: var(--green);
  background: var(--green-dim);
}

.hidden-icon {
  font-size: 4rem;
  font-weight: 900;
  color: var(--white-dim);
  line-height: 1;
  margin-bottom: 1rem;
  font-family: 'Space Grotesk', sans-serif;
}

.hidden-label {
  font-weight: 800;
  font-size: 0.8rem;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--white-muted);
}

/* ── Verso : rôle révélé ───────────────────────────────────── */
/* Citoyen ET Undercover : même visuel vert, mot seulement */
.secret-card {
  border-radius: var(--radius-xl);
  padding: 2.5rem 1.75rem;
  text-align: center;
  background: var(--dark-mid);
  border: 2px solid var(--green);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

/* MrWhite : style sobre blanc */
.secret-card--mrwhite {
  border-color: var(--white-dim);
}

.word-hint {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--white-muted);
}

.big-word {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.2rem, 11vw, 3.5rem);
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--green);
  line-height: 1;
}

.word-sub {
  font-size: 0.8rem;
  color: var(--white-muted);
  font-style: italic;
}

/* MrWhite content */
.mrwhite-icon  { font-size: 3rem; line-height: 1; }
.mrwhite-title {
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--white);
}
.mrwhite-sub  { font-size: 1rem; font-weight: 700; color: var(--white-muted); }
.mrwhite-tip  { font-size: 0.85rem; color: var(--white-dim); font-style: italic; }

.hide-btn { margin-top: 0.5rem; }

/* ── Transition flip ──────────────────────────────────────── */
.flip-enter-active { animation: flipIn 0.4s cubic-bezier(0.34,1.56,0.64,1); }
.flip-leave-active { animation: flipOut 0.18s ease; }

@keyframes flipIn {
  from { opacity: 0; transform: perspective(400px) rotateX(18deg) scale(0.9); }
  to   { opacity: 1; transform: perspective(400px) rotateX(0deg) scale(1); }
}
@keyframes flipOut {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.95); }
}
</style>
