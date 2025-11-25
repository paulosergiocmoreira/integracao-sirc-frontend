<template>
    <header class="fixed top-0 left-0 right-0 z-50 h-16 border-b border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900">
      <div class="flex h-full items-center justify-between px-6">
        <!-- Logo -->
        <h1 class="text-xl font-bold">
          <span class="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
            Integração SIRC
          </span>
        </h1>
  
        <!-- Right side: Theme toggle + User info + Menu -->
        <div class="flex items-center gap-4">
          <!-- Theme Toggle -->
          <ThemeToggle />
  
          <!-- User Info -->
          <div class="flex flex-col items-end text-sm">
            <span class="font-medium text-surface-900 dark:text-surface-50">
              {{ userName }}
            </span>
            <span class="text-xs text-surface-500 dark:text-surface-400">
              {{ userOrg }}
            </span>
          </div>
  
          <!-- User Menu -->
          <Button
            icon="pi pi-user"
            text
            rounded
            aria-label="Menu do usuário"
            @click="toggleUserMenu"
            :pt="{
              root: { 
                class: 'w-10 h-10 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700' 
              }
            }"
          />
          
          <Menu
            ref="userMenuRef"
            :model="userMenuItems"
            :popup="true"
          >
            <template #start>
              <div class="px-3 py-2 border-b border-surface-200 dark:border-surface-700">
                <span class="font-semibold text-sm text-surface-900 dark:text-surface-50">
                  Minha Conta
                </span>
              </div>
            </template>
          </Menu>
        </div>
      </div>
    </header>
  </template>
  
  <script setup lang="ts">
  import Button from 'primevue/button'
  import Menu from 'primevue/menu'
  import type { MenuItem } from 'primevue/menuitem'
  
  // User info (later will come from auth store)
  const userName = ref('João da Silva')
  const userOrg = ref('Organização X')
  
  // Menu reference
  const userMenuRef = ref()
  
  // Menu items
  const userMenuItems = ref<MenuItem[]>([
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => handleLogout()
    }
  ])
  
  // Toggle menu
  const toggleUserMenu = (event: Event) => {
    userMenuRef.value?.toggle(event)
  }
  
  // Logout handler
  const handleLogout = () => {
    console.log('Logout clicked')
    // TODO: Implement logout logic
  }
  </script>