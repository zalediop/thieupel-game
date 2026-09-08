<template>
  <div class="view">
    <GameHeader :show-round="true" :show-phase="true" />

    <!-- Vote terminé -->
    <template v-if="allVoted">
      <div class="center-block anim-scaleIn">
        <div class="big-check">✓</div>
        <h2>Votes enregistrés</h2>
        <button class="btn btn--primary btn--lg mt-4" @click="game.goToPhase('voteResults')">
          VOIR LES RÉSULTATS
        </button>
      </div>
    </template>

    <!-- Passe le téléphone -->
    <template v-else-if="!voting">
      <div class="pass-screen anim-fadeInUp">
        <div class="pass-counter">{{ game.votingIndex + 1 }} / {{ game.voteOrder.length }}</div>
        <div class="pass-name">{{ voter?.name }}</div>
        <p class="pass-instr">Passe le téléphone à <strong>{{ voter?.name }}</strong>.</p>
        <p class="pass-secret">Vote secret — ne montre pas ton écran !</p>
        <button class="btn btn--primary btn--lg mt-4" @click="voting = true">
          VOTER
        </button>
      </div>
    </template>

    <!-- Interface de vote -->
    <template v-else>
      <div class="vote-ui anim-fadeInUp">

        <div class="vote-header">
          <div class="phase-indicator">Vote secret</div>
          <h3>{{ voter?.name }}, qui veux-tu éliminer ?</h3>
        </div>

        <!-- Cibles -->
        <div class="vote-section">
          <div class="section-title">Choisir un joueur</div>
          <div class="player-list">
            <VoteCard
              v-for="p in targets"
              :key="p.id"
              :player="p"
              :selected="target === p.id"
              @select="target = p.id"
            />
          </div>
        </div>

        <!-- Rôle supposé -->
        <div v-if="target" class="vote-section anim-fadeInUp">
          <div class="section-title">Tu penses qu'il est…</div>
          <div class="role-btns">
            <button
              class="role-btn"
              :class="{ active: guessedRole === 'undercover' }"
              @click="guessedRole = 'undercover'"
            >
              <span class="rb-dot dot--white"></span>
              <span class="rb-label">UNDERCOVER</span>
            </button>
            <button
              class="role-btn"
              :class="{ active: guessedRole === 'mrwhite' }"
              @click="guessedRole = 'mrwhite'"
            >
              <span class="rb-dot dot--dim"></span>
              <span class="rb-label">MR. WHITE</span>
            </button>
          </div>
        </div>

        <div class="spacer" />

        <button
          class="btn btn--danger btn--lg"
          :disabled="!canSubmit"
          @click="submit"
        >
          CONFIRMER MON VOTE
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import GameHeader from '../components/GameHeader.vue'
import VoteCard from '../components/VoteCard.vue'
import { useGameStore } from '../stores/game.js'

const game = useGameStore()
const voting = ref(false)
const target = ref(null)
const guessedRole = ref(null)

const allVoted = computed(() => game.votingIndex >= game.voteOrder.length)
const voter = computed(() => game.currentVoter)

const targets = computed(() => {
  if (!voter.value) return []
  if (game.isTieBreaker && game.tiePlayerIds.length > 0) {
    return game.players.filter(p => p.alive && p.id !== voter.value.id && game.tiePlayerIds.includes(p.id))
  }
  return game.players.filter(p => p.alive && p.id !== voter.value.id)
})

const canSubmit = computed(() => target.value && guessedRole.value)

function submit() {
  if (!canSubmit.value || !voter.value) return
  game.submitVote({ voterId: voter.value.id, targetId: target.value, guessedRole: guessedRole.value })
  voting.value = false
  target.value = null
  guessedRole.value = null
}
</script>

<style scoped>
.pass-screen {
  display: flex; flex-direction: column; flex: 1;
  justify-content: center; text-align: center; gap: 1.25rem;
}
.pass-counter {
  font-size: 0.75rem; font-weight: 800;
  text-transform: uppercase; letter-spacing: 2px; color: var(--white-muted);
}
.pass-name {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.2rem, 11vw, 3.5rem);
  font-weight: 700; color: var(--white); letter-spacing: -1px;
}
.pass-instr { color: var(--white-muted); }
.pass-secret { font-size: 0.8rem; color: var(--white-dim); font-style: italic; }

.vote-ui { display: flex; flex-direction: column; flex: 1; gap: 1.5rem; }
.vote-header { display: flex; flex-direction: column; gap: 0.4rem; }
.vote-section { display: flex; flex-direction: column; gap: 0.6rem; }

.role-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; }

.role-btn {
  display: flex; flex-direction: column; align-items: center; gap: 0.6rem;
  padding: 1.25rem 0.75rem;
  background: var(--dark-mid);
  border: 2px solid var(--white-dim);
  border-radius: var(--radius);
  cursor: pointer; transition: all var(--transition);
  color: var(--white-muted);
  -webkit-tap-highlight-color: transparent;
}
.role-btn:hover, .role-btn.active {
  border-color: var(--green); background: var(--green-dim); color: var(--green);
}

.rb-dot {
  width: 16px; height: 16px; border-radius: 50%;
}
.dot--white { background: var(--white); }
.dot--dim   { background: var(--white-dim); border: 1px solid var(--white-muted); }

.rb-label {
  font-size: 0.72rem; font-weight: 800;
  letter-spacing: 1px; text-transform: uppercase;
}

.center-block {
  display: flex; flex-direction: column; flex: 1;
  align-items: center; justify-content: center; text-align: center; gap: 1rem;
}
.big-check {
  width: 72px; height: 72px; border-radius: 50%;
  background: var(--green-dim); border: 2px solid var(--green);
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem; color: var(--green); font-weight: 900;
}
</style>
