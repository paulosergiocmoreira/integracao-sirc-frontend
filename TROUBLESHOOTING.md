# TROUBLESHOOTING.md

Common issues and solutions for SIRC Dashboard.

---

## 🚨 Critical Issues

### Issue: Server Won't Start

**Symptoms:**
- `pnpm dev` fails
- Error messages about ports or dependencies

**Solutions:**

1. **Port already in use:**
```bash
# Kill process on port 3000 (Linux/Mac)
lsof -ti:3000 | xargs kill -9

# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Or use different port
PORT=3001 pnpm dev
```

2. **Dependency issues:**
```bash
# Clean install
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

3. **Cache issues:**
```bash
# Clear Nuxt cache
rm -rf .nuxt
rm -rf .output
pnpm dev
```

---

### Issue: White Screen / Blank Page

**Symptoms:**
- Browser shows white screen
- Console shows errors

**Solutions:**

1. **Check console for errors:**
   - Open DevTools (F12)
   - Look at Console tab
   - Look for red error messages

2. **Common causes:**
   ```javascript
   // ❌ Import error - component not found
   // Check if file exists and name is correct
   
   // ❌ TypeScript error
   // Run: pnpm typecheck
   
   // ❌ Syntax error
   // Check recent changes in files
   ```

3. **Nuclear option:**
   ```bash
   # Full reset
   rm -rf node_modules .nuxt .output
   pnpm install
   pnpm dev
   ```

---

### Issue: TypeScript Errors Everywhere

**Symptoms:**
- Red squiggles in VSCode/Cursor
- `pnpm typecheck` shows many errors

**Solutions:**

1. **Restart TypeScript server:**
   - VSCode: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
   - Cursor: Same as above

2. **Check tsconfig.json:**
   ```json
   {
     "extends": "./.nuxt/tsconfig.json",
     "compilerOptions": {
       "strict": true,
       // Should match your nuxt.config.ts
     }
   }
   ```

3. **Regenerate types:**
   ```bash
   rm -rf .nuxt
   pnpm dev
   # Wait for Nuxt to generate types
   ```

---

## 🔧 Component Issues

### Issue: Store Not Found (useFilesStore is not defined)

**Symptoms:**
```
ReferenceError: useFilesStore is not defined
```

**Solutions:**

1. **Auto-import delay:**
   - Restart dev server: `Ctrl+C` then `pnpm dev`
   - Wait 5-10 seconds after server starts

2. **Check store file exists:**
   ```bash
   ls stores/files.ts
   # Should exist
   ```

3. **Check store export:**
   ```typescript
   // stores/files.ts
   export const useFilesStore = defineStore('files', {
     // ...
   })
   ```

4. **Manual import (temporary):**
   ```typescript
   // In component (only if auto-import fails)
   import { useFilesStore } from '~/stores/files'
   ```

---

### Issue: Toast Notifications Don't Appear

**Symptoms:**
- Actions complete but no toast message
- Console may show: `useToast() is called but Toast component is missing`

**Solutions:**

1. **Check Toast in layout:**
   ```vue
   <!-- layouts/default.vue -->
   <template>
     <div>
       <Toast position="top-right" />  <!-- ✅ This is required -->
       <DashboardHeader />
       <!-- ... -->
     </div>
   </template>
   
   <script setup lang="ts">
   import Toast from 'primevue/toast'  // ✅ Import required
   </script>
   ```

2. **Check PrimeVue ToastService:**
   ```typescript
   // nuxt.config.ts
   export default defineNuxtConfig({
     modules: ['nuxt-primevue'],
     primevue: {
       // ToastService is auto-configured
     }
   })
   ```

3. **Test toast manually:**
   ```typescript
   // In any component
   const toast = useToast()
   toast.success('Test message')
   ```

---

### Issue: ConfirmDialog Doesn't Work

**Symptoms:**
- Click delete/execute button
- No confirmation dialog appears
- Or error: `useConfirm() is called but ConfirmDialog is missing`

**Solutions:**

1. **Check ConfirmDialog in app.vue:**
   ```vue
   <!-- app/app.vue -->
   <template>
     <div>
       <ConfirmDialog />  <!-- ✅ This is required -->
       <NuxtLayout>
         <NuxtPage />
       </NuxtLayout>
     </div>
   </template>
   
   <script setup lang="ts">
   import ConfirmDialog from 'primevue/confirmdialog'
   </script>
   ```

2. **Check usage in component:**
   ```typescript
   import { useConfirm } from 'primevue/useconfirm'
   
   const confirm = useConfirm()
   
   confirm.require({
     message: 'Are you sure?',
     header: 'Confirmation',
     accept: () => {
       // Do something
     }
   })
   ```

---

### Issue: Modal Doesn't Close

**Symptoms:**
- Click "Cancelar" or X button
- Modal stays open

**Solutions:**

1. **Check v-model binding:**
   ```vue
   <!-- ❌ Wrong -->
   <Dialog :visible="showDialog">
   
   <!-- ✅ Correct -->
   <Dialog 
     :visible="showDialog"
     @update:visible="showDialog = $event"
   >
   <!-- OR -->
   <Dialog v-model:visible="showDialog">
   ```

2. **Check emit in child component:**
   ```vue
   <!-- Child component -->
   <script setup lang="ts">
   const emit = defineEmits<{
     'update:visible': [value: boolean]
   }>()
   
   const handleClose = () => {
     emit('update:visible', false)
   }
   </script>
   ```

---

### Issue: Calendar Shows English

**Symptoms:**
- Month names in English
- "Today" button in English

**Solutions:**

1. **Add Portuguese locale:**
   ```typescript
   // nuxt.config.ts
   export default defineNuxtConfig({
     primevue: {
       options: {
         locale: {
           firstDayOfWeek: 0,
           dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
           dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
           dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
           monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
           monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                            'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
           today: 'Hoje',
           clear: 'Limpar',
           dateFormat: 'dd/mm/yy',
           weekHeader: 'Sem'
         }
       }
     }
   })
   ```

2. **Restart dev server** after config change

---

## 🎨 Styling Issues

### Issue: Dark Mode Not Working

**Symptoms:**
- Toggle theme button does nothing
- Or styles don't change

**Solutions:**

1. **Check theme composable:**
   ```typescript
   // composables/useTheme.ts should exist
   export const useTheme = () => {
     const isDark = useState<boolean>('theme-dark', () => false)
     
     const toggleTheme = () => {
       isDark.value = !isDark.value
       updateTheme()
     }
     
     const updateTheme = () => {
       if (isDark.value) {
         document.documentElement.classList.add('dark')
       } else {
         document.documentElement.classList.remove('dark')
       }
     }
     
     return { isDark, toggleTheme }
   }
   ```

2. **Check Tailwind config:**
   ```javascript
   // tailwind.config.js
   module.exports = {
     darkMode: 'class',  // ✅ Must be 'class'
     // ...
   }
   ```

3. **Test manually:**
   ```javascript
   // In browser console
   document.documentElement.classList.add('dark')
   // Should change to dark mode
   ```

---

### Issue: Styles Don't Apply

**Symptoms:**
- Components have no styling
- Or wrong colors

**Solutions:**

1. **Check CSS layers order:**
   ```css
   /* assets/css/main.css */
   @layer tailwind-base, primevue, tailwind-utilities;
   
   @import "tailwindcss/base" layer(tailwind-base);
   @import "primevue/resources/themes/aura-light-green/theme.css" layer(primevue);
   @import "tailwindcss/components" layer(tailwind-utilities);
   @import "tailwindcss/utilities" layer(tailwind-utilities);
   ```

2. **Check nuxt.config.ts:**
   ```typescript
   export default defineNuxtConfig({
     css: ['~/assets/css/main.css'],
     // ...
   })
   ```

3. **Clear browser cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

---

### Issue: PrimeVue Colors Are Wrong

**Symptoms:**
- Buttons are gray instead of blue
- Badges don't have colors

**Solutions:**

1. **Use semantic colors:**
   ```vue
   <!-- ❌ Wrong - Direct Tailwind colors -->
   <Button class="bg-blue-500" />
   
   <!-- ✅ Correct - Semantic tokens -->
   <Button />  <!-- Uses primary by default -->
   <Button severity="success" />
   ```

2. **Check PrimeVue mode:**
   ```typescript
   // nuxt.config.ts
   primevue: {
     options: {
       unstyled: false,  // ✅ Should be false for Styled Mode
       ripple: true
     }
   }
   ```

---

## 📊 Data Issues

### Issue: Table Shows No Data

**Symptoms:**
- Empty table
- Or "Nenhum arquivo encontrado"

**Solutions:**

1. **Check store initialization:**
   ```typescript
   // pages/index.vue
   onMounted(async () => {
     await store.fetchFiles()  // ✅ This should be called
   })
   ```

2. **Check mock data:**
   ```typescript
   // stores/mocks.ts
   export const MOCK_FILES: File[] = [
     // Should have data
   ]
   ```

3. **Check store state:**
   ```javascript
   // In browser console
   $nuxt.$pinia._s.get('files').files
   // Should show array of files
   ```

4. **Check filters:**
   - Click "Limpar" to reset all filters
   - May be filtering out all results

---

### Issue: Pagination Shows Wrong Numbers

**Symptoms:**
- Shows "1-10 of 0"
- Or numbers don't match table

**Solutions:**

1. **Check computed totals:**
   ```typescript
   // stores/files.ts
   totalFiles(): number {
     return this.filteredFiles.length  // ✅ Should use filteredFiles
   }
   ```

2. **Check filter logic:**
   ```typescript
   filteredFiles: (state): File[] => {
     let result = [...state.files]  // ✅ Should copy array
     
     // Apply filters...
     
     return result
   }
   ```

---

### Issue: Upload Doesn't Add File to Table

**Symptoms:**
- Upload succeeds (toast appears)
- But file not in table

**Solutions:**

1. **Check store action:**
   ```typescript
   async uploadFile(file: File, type: FileTypeValue, reference: string) {
     // ...
     this.files.unshift(newFile)  // ✅ Should add to beginning
     toast.messages.fileUploaded()
     return true
   }
   ```

2. **Check reactivity:**
   ```typescript
   // Should use .unshift() or .push()
   // NOT direct assignment: this.files[0] = newFile
   ```

---

## 🔍 Filter Issues

### Issue: Filters Don't Apply

**Symptoms:**
- Select filters, click "Filtrar"
- Table doesn't change

**Solutions:**

1. **Check composable:**
   ```typescript
   // composables/useFileFilters.ts
   const applyFilters = () => {
     store.updateFilters({
       name: localFilters.name || undefined,
       // ...
     })
   }
   ```

2. **Check store getter:**
   ```typescript
   filteredFiles: (state): File[] => {
     let result = [...state.files]
     
     if (state.filters.name) {
       result = result.filter(f => 
         f.name.toLowerCase().includes(state.filters.name!.toLowerCase())
       )
     }
     
     // More filters...
     
     return result
   }
   ```

3. **Check binding:**
   ```vue
   <!-- FileTable.vue -->
   <DataTable :value="files">
   
   <script setup lang="ts">
   const files = computed(() => store.paginatedFiles)  // ✅ Use paginatedFiles
   </script>
   ```

---

### Issue: Status Filter Shows Wrong Options

**Symptoms:**
- Status multiselect empty
- Or shows wrong values

**Solutions:**

1. **Check options array:**
   ```typescript
   // composables/useFileFilters.ts
   const statusOptions = [
     { label: 'Salvo', value: 'salvo' },
     { label: 'Em Execução', value: 'em-execucao' },
     { label: 'Erro', value: 'erro' },
     { label: 'Agendado', value: 'agendado' }
   ]
   ```

2. **Check MultiSelect binding:**
   ```vue
   <MultiSelect
     v-model="localFilters.status"
     :options="statusOptions"
     option-label="label"
     option-value="value"  <!-- ✅ Important -->
   />
   ```

---

## ⚡ Performance Issues

### Issue: App Is Slow / Laggy

**Symptoms:**
- UI freezes
- Slow animations
- High CPU usage

**Solutions:**

1. **Check for infinite loops:**
   ```typescript
   // ❌ Bad - triggers on every change
   watch(() => store.files, () => {
     store.fetchFiles()  // This causes infinite loop!
   })
   
   // ✅ Good - explicit trigger
   onMounted(() => {
     store.fetchFiles()
   })
   ```

2. **Check computed dependencies:**
   ```typescript
   // ❌ Bad - recalculates too often
   const expensiveCalc = computed(() => {
     return store.files.map(...).filter(...).reduce(...)
   })
   
   // ✅ Good - memoized properly
   const expensiveCalc = computed(() => {
     if (!store.files.length) return []
     return store.files.map(...)
   })
   ```

3. **Check DevTools Performance tab:**
   - Record interaction
   - Look for long tasks (> 50ms)
   - Identify bottleneck function

---

### Issue: Table Scrolling Is Janky

**Symptoms:**
- Stuttering when scrolling
- Frame drops

**Solutions:**

1. **Reduce items per page:**
   ```typescript
   // Try 10 instead of 50
   filters: {
     limit: 10  // ✅ Smaller page size = better performance
   }
   ```

2. **Enable virtual scrolling (future improvement):**
   ```vue
   <DataTable
     :value="files"
     :virtualScrollerOptions="{ itemSize: 50 }"
     scrollable
     scrollHeight="600px"
   >
   ```

---

## 🌐 Browser-Specific Issues

### Chrome/Edge

**Issue: DevTools shows warnings about passive event listeners**

**Solution:** Ignore - these are from PrimeVue and don't affect functionality

---

### Firefox

**Issue: Some animations don't work**

**Solution:** 
```css
/* May need to add vendor prefixes */
.animated {
  animation: fade 0.3s ease;
  -moz-animation: fade 0.3s ease;
}
```

---

### Safari

**Issue: Calendar doesn't open on iOS**

**Solution:** Known PrimeVue issue on iOS Safari. Use native date input as fallback (future enhancement)

---

## 🔐 TypeScript Issues

### Issue: "Property does not exist on type"

**Example:**
```typescript
// Error: Property 'id' does not exist on type 'File | undefined'
const file = files.value[0]
console.log(file.id)
```

**Solution:**
```typescript
// ✅ Add null check
const file = files.value[0]
if (file) {
  console.log(file.id)
}

// ✅ Or use optional chaining
console.log(files.value[0]?.id)
```

---

### Issue: "Object is possibly 'undefined'"

**Example:**
```typescript
// Error: Object is possibly 'undefined'
const result = array[index].property
```

**Solution:**
```typescript
// ✅ Validate before access
const item = array[index]
if (item) {
  const result = item.property
}

// ✅ Or provide fallback
const result = array[index]?.property ?? 'default'
```

---

## 📱 Mobile Issues

### Issue: Buttons Too Small on Mobile

**Solution:**
```vue
<!-- Add touch-friendly sizes -->
<Button
  icon="pi pi-trash"
  size="large"  <!-- ✅ Use large on mobile -->
  class="min-h-[44px] min-w-[44px]"  <!-- ✅ Apple's 44px guideline -->
/>
```

---

### Issue: Inputs Hard to Focus on Mobile

**Solution:**
```vue
<InputText
  class="text-base"  <!-- ✅ Prevents zoom on iOS -->
/>
```

---

## 🆘 Last Resort Solutions

### Nothing Works - Nuclear Reset

```bash
# 1. Stop server
Ctrl+C

# 2. Clean everything
rm -rf node_modules
rm -rf .nuxt
rm -rf .output
rm -rf dist
rm pnpm-lock.yaml

# 3. Reinstall
pnpm install

# 4. Clear browser data
# - Open DevTools
# - Right-click refresh button
# - Select "Empty Cache and Hard Reload"

# 5. Start fresh
pnpm dev
```

---

### Still Broken - Check Git

```bash
# See what changed
git status
git diff

# Revert recent changes
git checkout -- path/to/file

# Or reset to last working commit
git reset --hard HEAD~1
```

---

## 📞 Getting Help

### Before Asking for Help, Provide:

1. **Environment:**
   - OS: Windows/Mac/Linux + version
   - Browser: Chrome/Firefox/Safari + version
   - Node version: `node -v`
   - pnpm version: `pnpm -v`

2. **Error Messages:**
   - Full error from console
   - Full error from terminal
   - Screenshot if visual issue

3. **What You Tried:**
   - List troubleshooting steps already attempted
   - Show relevant code snippets

4. **Reproduction Steps:**
   - Exact steps to reproduce the issue
   - Expected vs actual behavior

### Useful Debug Commands:

```bash
# Check versions
node -v
pnpm -v
npx nuxi info

# Check for errors
pnpm typecheck
pnpm lint

# Clean build
pnpm build

# Verbose dev mode
DEBUG=* pnpm dev
```

---

## 🎯 Prevention Tips

### To Avoid Issues:

1. **Commit frequently:**
   ```bash
   git add .
   git commit -m "Working state before changes"
   ```

2. **Test after each change:**
   - Make one change
   - Test in browser
   - Verify no errors
   - Commit

3. **Use TypeScript:**
   - Catch errors at compile time
   - Don't use `any`
   - Run `pnpm typecheck` regularly

4. **Follow conventions:**
   - Check `.cursor/` rules
   - Follow patterns from existing code
   - Use linter: `pnpm lint --fix`

5. **Read error messages:**
   - They usually tell you exactly what's wrong
   - Google the error if unclear
   - Check Stack Overflow

---

**Remember:** Most issues can be fixed by:
1. Reading the error message carefully
2. Restarting the dev server
3. Checking the console for errors
4. Clearing cache and rebuilding

Good luck! 🚀