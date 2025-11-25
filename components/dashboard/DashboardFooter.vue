<template>
    <footer class="fixed bottom-0 left-64 right-0 h-12 border-t border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900">
      <div class="flex h-full items-center justify-between px-6 text-xs text-surface-500 dark:text-surface-400">
        <div>
          Versão do Sistema: 
          <a 
            href="#" 
            class="text-primary-600 dark:text-primary-400 hover:underline"
            @click.prevent
          >
            1.0.0
          </a>
        </div>
        <div>
          Desenvolvido por Sua Empresa
        </div>
      </div>
    </footer>
  </template>
  
  <script setup lang="ts">
  // Footer component - no logic needed for now
  </script>