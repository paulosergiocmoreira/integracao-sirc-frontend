<template>
    <div class="min-h-screen bg-surface-50 dark:bg-surface-950">
      <!-- Header -->
      <DashboardHeader />
      
      <!-- Sidebar -->
      <DashboardSidebar />
      
      <!-- Main Content Area -->
      <main class="ml-64 mt-16 mb-12 p-6">
        <slot />
      </main>
      
      <!-- Footer -->
      <DashboardFooter />
      
      <!-- Toast Container (for notifications) -->
      <Toast position="top-right" />
    </div>
  </template>
  
  <script setup lang="ts">
  import Toast from 'primevue/toast'
  
  // Initialize theme on mount
  const { initTheme } = useTheme()
  
  onMounted(() => {
    initTheme()
  })
  </script>