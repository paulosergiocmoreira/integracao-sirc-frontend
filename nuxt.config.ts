// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import Aura from '@primevue/themes/aura'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],

  // ✅ IMPORTANTE: Configurar auto-imports explicitamente
  imports: {
    autoImport: true,
    dirs: [
      'composables',
      'composables/**',
      'utils',
      'utils/**'
    ]
  },

  // ✅ Garantir que componentes são auto-importados
  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false
      }
    ]
  },

  // PrimeVue Configuration
  primevue: {
    autoImport: false, // PrimeVue components need manual import
    options: {
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: '.dark',
          cssLayer: {
            name: 'primevue',
            order: 'tailwind-base, primevue, tailwind-utilities'
          }
        }
      },
      ripple: true,
      inputStyle: 'outlined'
    },
    components: {
      include: [
        'Button',
        'DataTable',
        'Column',
        'Dialog',
        'InputText',
        'Dropdown',
        'Calendar',
        'FileUpload',
        'Toast',
        'Badge',
        'Card',
        'Menu',
        'Skeleton',
        'Message',
        'Checkbox',
        'Toolbar',
        'Paginator'
      ]
    }
  },

  // Tailwind Configuration - ✅ FORMA CORRETA de carregar CSS customizado
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    config: {
      darkMode: ['class', '.dark'],
      content: [
        './components/**/*.{vue,js,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './composables/**/*.{js,ts}',
        './plugins/**/*.{js,ts}',
        './app.vue'
      ],
      theme: {
        extend: {
          colors: {
            // Paleta Primary (Azul)
            primary: {
              50: '#eff6ff',
              100: '#dbeafe',
              200: '#bfdbfe',
              300: '#93c5fd',
              400: '#60a5fa',
              500: '#3b82f6',
              600: '#2563eb',
              700: '#1d4ed8',
              800: '#1e40af',
              900: '#1e3a8a',
            },
            // ✅ DESIGN TOKENS SEMÂNTICOS
            // Referência: DESIGN_SPECS.md - Sistema de Cores
            ring: '#3b82f6',        // Cor de foco (primary-500)
            border: '#e2e8f0',      // Cor de borda (slate-200)
            input: '#e2e8f0',       // Cor de input (slate-200)
            background: '#ffffff',  // Fundo principal
            foreground: '#0f172a',  // Texto principal (slate-900)
            muted: {
              DEFAULT: '#f8fafc',   // Surface (slate-50)
              foreground: '#64748b' // Texto secundário (slate-500)
            },
            // Cores de Status (DESIGN_SPECS.md)
            success: '#22c55e',     // green-500
            warning: '#f59e0b',     // amber-500
            error: '#ef4444',       // red-500
            info: '#3b82f6',        // blue-500
          }
        }
      }
    }
  },

  // CSS - ✅ Apenas bibliotecas externas aqui
  css: [
    'primeicons/primeicons.css'
  ],

  // Pinia
  pinia: {
    storesDirs: ['./stores/**']
  },

  // TypeScript
  typescript: {
    strict: true,
    typeCheck: true,
    shim: false
  },

  // Runtime Config
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'
    }
  },

  // App Config
  app: {
    head: {
      title: 'SIRC Dashboard',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Sistema de Integração SIRC' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // Build
  build: {
    transpile: ['primevue']
  }
})