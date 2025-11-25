<template>
  <Button
    :icon="isDark ? 'pi pi-moon' : 'pi pi-sun'"
    text
    rounded
    :aria-label="isDark ? 'Ativar modo claro' : 'Ativar modo escuro'"
    @click="toggleTheme"
    :pt="{
      root: { 
        class: 'w-10 h-10 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700' 
      }
    }"
  />
</template>

<script setup lang="ts">
import Button from 'primevue/button'

const { isDark, toggleTheme } = useTheme()
</script>