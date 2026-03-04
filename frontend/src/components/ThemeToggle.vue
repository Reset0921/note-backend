<template>
  <div class="theme-toggle" @click="toggleTheme">
    <transition name="rotate" mode="out-in">
      <Sunny v-if="theme === 'dark'" key="sun" />
      <Moon v-else key="moon" />
    </transition>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import { Sunny, Moon } from '@element-plus/icons-vue'

const theme = inject('theme')
const setTheme = inject('setTheme')

const toggleTheme = () => {
  setTheme(theme.value === 'light' ? 'dark' : 'light')
}
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: var(--transition);
  color: var(--text-secondary);
  font-size: 18px;
}

.theme-toggle:hover {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
  transform: rotate(15deg);
}

.rotate-enter-active,
.rotate-leave-active {
  transition: all 0.3s ease;
}

.rotate-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}

.rotate-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}
</style>
