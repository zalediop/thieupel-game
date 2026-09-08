import { createRouter, createWebHashHistory } from 'vue-router'
import { useGameStore } from '../stores/game.js'

import HomeView from '../views/HomeView.vue'
import SetupView from '../views/SetupView.vue'
import RoleConfigView from '../views/RoleConfigView.vue'
import RoleRevealView from '../views/RoleRevealView.vue'
import ClueView from '../views/ClueView.vue'
import VoteView from '../views/VoteView.vue'
import VoteResultsView from '../views/VoteResultsView.vue'
import RevealView from '../views/RevealView.vue'
import WhiteGuessView from '../views/WhiteGuessView.vue'
import RoundResultView from '../views/RoundResultView.vue'
import FinalView from '../views/FinalView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/setup', name: 'setup', component: SetupView },
  { path: '/role-config', name: 'roleConfig', component: RoleConfigView },
  { path: '/role-reveal', name: 'roleReveal', component: RoleRevealView },
  { path: '/clue', name: 'clue', component: ClueView },
  { path: '/vote', name: 'vote', component: VoteView },
  { path: '/vote-results', name: 'voteResults', component: VoteResultsView },
  { path: '/reveal', name: 'reveal', component: RevealView },
  { path: '/white-guess', name: 'whiteGuess', component: WhiteGuessView },
  { path: '/round-result', name: 'roundResult', component: RoundResultView },
  { path: '/final', name: 'final', component: FinalView },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// Navigation guard basé sur la phase du store
router.beforeEach((to) => {
  if (to.name === 'home') return true
  // On laisse passer ; la navigation est pilotée par le store
  return true
})

export default router
