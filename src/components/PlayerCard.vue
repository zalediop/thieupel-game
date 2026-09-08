<template>
  <div class="player-item" :class="{ eliminated: player.eliminated, selected }">
    <div class="player-avatar">{{ initials }}</div>
    <span class="player-name">{{ player.name }}</span>
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  player: { type: Object, required: true },
  selected: { type: Boolean, default: false },
})

const initials = computed(() => {
  return props.player.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})
</script>
