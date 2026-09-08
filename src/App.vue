<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
import { watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from './stores/game.js'

const router = useRouter()
const game = useGameStore()

// Synchronise la route avec la phase du store
const phaseRouteMap = {
  home: 'home',
  setup: 'setup',
  roleConfig: 'roleConfig',
  roleReveal: 'roleReveal',
  clue: 'clue',
  vote: 'vote',
  voteResults: 'voteResults',
  reveal: 'reveal',
  whiteGuess: 'whiteGuess',
  roundResult: 'roundResult',
  final: 'final',
}

watch(() => game.phase, (phase) => {
  const routeName = phaseRouteMap[phase]
  if (routeName && router.currentRoute.value.name !== routeName) {
    router.push({ name: routeName })
  }
})

onMounted(() => {
  // Tenter de restaurer une partie sauvegardée
  const restored = game.load()
  if (restored && game.phase && game.phase !== 'home') {
    const routeName = phaseRouteMap[game.phase]
    if (routeName) router.push({ name: routeName })
  }
})
</script>
