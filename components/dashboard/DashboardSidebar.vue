<template>
    <aside class="fixed left-0 top-16 bottom-0 w-64 border-r border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 overflow-y-auto">
      <nav class="flex flex-col p-4">
        <!-- Navigation Links -->
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          :class="{
            'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium': isActive(item.to)
          }"
        >
          <i :class="item.icon" class="text-lg" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>
    </aside>
  </template>
  
  <script setup lang="ts">
  interface NavItem {
    label: string
    to: string
    icon: string
  }
  
  const route = useRoute()
  
  // Navigation items
  const navItems: NavItem[] = [
    {
      label: 'Arquivos',
      to: '/',
      icon: 'pi pi-file'
    },
    {
      label: 'Cruzamentos',
      to: '/cruzamentos',
      icon: 'pi pi-sync'
    },
    {
      label: 'Consultas',
      to: '/consultas',
      icon: 'pi pi-search'
    }
  ]
  
  // Check if route is active
  const isActive = (path: string) => {
    if (path === '/') {
      return route.path === '/'
    }
    return route.path.startsWith(path)
  }
  </script>