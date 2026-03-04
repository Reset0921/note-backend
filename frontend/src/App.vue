<template>
  <div id="app" :class="[theme, { 'is-mobile': isMobile }]">
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, provide } from 'vue'

// 主题管理
const theme = ref(localStorage.getItem('theme') || 'light')

// 检测移动端
const isMobile = ref(window.innerWidth < 768)

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

const setTheme = (newTheme) => {
  theme.value = newTheme
  localStorage.setItem('theme', newTheme)
}

// 提供theme', newTheme主题给子组件
provide('theme', theme)
provide('setTheme', setTheme)
provide('isMobile', isMobile)

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style>
/* CSS 变量定义 */
:root {
  /* 浅色主题 */
  --bg-primary: #f8f9fc;
  --bg-secondary: #ffffff;
  --bg-card: #ffffff;
  --text-primary: #1a1a2e;
  --text-secondary: #4a4a68;
  --text-tertiary: #8c8ca1;
  --border-color: #e8e8f0;
  --accent-color: #6366f1;
  --accent-hover: #4f46e5;
  --danger-color: #ef4444;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.12);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark {
  --bg-primary: #0f0f1a;
  --bg-secondary: #1a1a2e;
  --bg-card: #252542;
  --text-primary: #f0f0f5;
  --text-secondary: #a0a0b8;
  --text-tertiary: #6b6b80;
  --border-color: #2d2d4a;
  --accent-color: #818cf8;
  --accent-hover: #a5b4fc;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: var(--transition);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans SC', sans-serif;
}

/* 移动端适配 */
.is-mobile {
  padding: 0 12px;
}

/* Element Plus 主题覆盖 */
.dark .el-button--primary {
  --el-button-bg-color: var(--accent-color);
  --el-button-border-color: var(--accent-color);
  --el-button-hover-bg-color: var(--accent-hover);
  --el-button-hover-border-color: var(--accent-hover);
}

.dark .el-card {
  --el-card-bg-color: var(--bg-card);
  border-color: var(--border-color);
}

.dark .el-dialog {
  --el-dialog-bg-color: var(--bg-card);
}

.dark .el-input__wrapper,
.dark .el-textarea__inner {
  background-color: var(--bg-secondary);
  box-shadow: 0 0 0 1px var(--border-color) inset;
}

.dark .el-input__inner,
.dark .el-textarea__inner {
  color: var(--text-primary);
}

.dark .el-form-item__label {
  color: var(--text-secondary);
}

.dark .el-dropdown-menu {
  background-color: var(--bg-card);
  border-color: var(--border-color);
}

.dark .el-dropdown-menu__item {
  color: var(--text-secondary);
}

.dark .el-dropdown-menu__item:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.dark .el-empty__description p {
  color: var(--text-tertiary);
}
</style>
