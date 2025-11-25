/**
 * Dark mode theme management composable
 * Persists preference to localStorage and syncs with system
 */

// ✅ Type definitions
interface UseThemeReturn {
  isDark: Readonly<Ref<boolean>>
  toggleTheme: () => void
  setTheme: (dark: boolean) => void
  initTheme: () => void
}

/**
 * Composable para gerenciamento de tema (dark/light mode)
 * 
 * @description Gerencia o estado do tema da aplicação, persistindo preferência
 * no localStorage e sincronizando com preferência do sistema
 * 
 * @returns {UseThemeReturn} Interface completa para gerenciamento de tema
 * 
 * @example
 * ```vue
 * <script setup>
 * const { isDark, toggleTheme, setTheme, initTheme } = useTheme()
 * 
 * // Inicializar tema
 * initTheme()
 * 
 * // Alternar tema
 * toggleTheme()
 * 
 * // Definir tema específico
 * setTheme(true) // dark mode
 * setTheme(false) // light mode
 * 
 * // Verificar tema atual
 * console.log(isDark.value) // boolean
 * </script>
 * ```
 */
export const useTheme = (): UseThemeReturn => {
  // State persisted across component instances
  const isDark = useState('theme-dark', () => false)

  /**
   * Inicializa tema na montagem do componente
   * 
   * @description Verifica localStorage e preferência do sistema para definir tema inicial
   */
  const initTheme = (): void => {
    if (import.meta.client) {
      // Check localStorage first
      const stored = localStorage.getItem('theme')
      
      if (stored) {
        isDark.value = stored === 'dark'
      } else {
        // Fallback to system preference
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      
      // Apply theme class
      applyTheme()
    }
  }

  /**
   * Aplica tema ao elemento HTML
   * 
   * @description Adiciona/remove classe 'dark' no documentElement
   */
  const applyTheme = (): void => {
    if (import.meta.client) {
      if (isDark.value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  /**
   * Alterna entre tema claro e escuro
   * 
   * @description Inverte o estado atual do tema e persiste no localStorage
   */
  const toggleTheme = (): void => {
    isDark.value = !isDark.value
    
    if (import.meta.client) {
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
      applyTheme()
    }
  }

  /**
   * Define tema explicitamente
   * 
   * @param dark - True para tema escuro, false para tema claro
   * @description Define o tema e persiste no localStorage
   */
  const setTheme = (dark: boolean): void => {
    isDark.value = dark
    
    if (import.meta.client) {
      localStorage.setItem('theme', dark ? 'dark' : 'light')
      applyTheme()
    }
  }

  /**
   * Observa mudanças no tema do sistema
   * 
   * @description Configura listener para mudanças de preferência do sistema
   * e atualiza tema automaticamente se usuário não definiu preferência
   */
  if (import.meta.client) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-update if user hasn't set preference
      if (!localStorage.getItem('theme')) {
        isDark.value = e.matches
        applyTheme()
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    // Cleanup on unmount
    onUnmounted(() => {
      mediaQuery.removeEventListener('change', handleChange)
    })
  }

  return {
    isDark: readonly(isDark),
    toggleTheme,
    setTheme,
    initTheme
  }
}