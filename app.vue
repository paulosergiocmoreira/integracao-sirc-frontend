<template>
  <div>
    <!-- ConfirmDialog global para confirmações -->
    <ConfirmDialog />
    
    <!-- Layout principal -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import ConfirmDialog from 'primevue/confirmdialog'

// Meta global
useHead({
  titleTemplate: '%s | SIRC Dashboard',
  htmlAttrs: {
    lang: 'pt-BR'
  }
})
</script>