# DATA FLOW - Fluxo de Dados do SIRC Dashboard

Este documento explica como os dados fluem através da aplicação.

---

## 🏗️ Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│  (Components - Vue 3 Composition API + PrimeVue + Tailwind)     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ├──► 📱 User Actions (clicks, inputs)
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                       COMPOSABLES LAYER                          │
│  (useFileFilters, useToast, useTheme - Reusable Logic)         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ├──► 🔄 Transform data, manage local state
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                         PINIA STORES                             │
│  (files, crossings, queries - Global State Management)         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ├──► 📡 API calls (simulated)
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MOCK DATA                                │
│  (stores/mocks.ts - Simulated Backend)                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ├──► ⏱️ simulateDelay(500-1500ms)
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      RESPONSE + STATE UPDATE                     │
│  (Store updates → Component reactivity → UI re-render)         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Exemplo Detalhado: Upload de Arquivo

### 1. User Action (Component)

```vue
<!-- FileUploadDialog.vue -->
<template>
  <Button @click="handleSubmit">Enviar</Button>
</template>

<script setup lang="ts">
const handleSubmit = async () => {
  // 1️⃣ User clicks "Enviar"
  // Validation happens here first
  if (!validateForm()) return
  
  // 2️⃣ Call store action
  await store.uploadFile(selectedFile, type, reference)
}
</script>
```

**Flow:**
```
User Click → Validation → Store Action Call
```

---

### 2. Store Action (Pinia)

```typescript
// stores/files.ts
export const useFilesStore = defineStore('files', {
  actions: {
    async uploadFile(file: File, type: FileTypeValue, reference: string) {
      // 3️⃣ Set loading state
      this.loading = true
      
      try {
        // 4️⃣ Simulate API call
        await simulateDelay()  // 500-1500ms
        
        // 5️⃣ Create new file object
        const newFile: File = {
          id: `file-${Date.now()}`,
          name: file.name,
          type,
          reference,
          status: 'salvo'
          // ...
        }
        
        // 6️⃣ Update state (triggers reactivity)
        this.files.unshift(newFile)
        
        // 7️⃣ Show success feedback
        toast.messages.fileUploaded()
        
        return true
      } catch (error) {
        // 8️⃣ Handle errors
        toast.messages.networkError()
        return false
      } finally {
        // 9️⃣ Reset loading state
        this.loading = false
      }
    }
  }
})
```

**Flow:**
```
Action Call → Set Loading → Simulate API → Update State → Show Toast → Reset Loading
```

---

### 3. Mock Data Layer

```typescript
// stores/mocks.ts
export const simulateDelay = (min = 500, max = 1500): Promise<void> => {
  const delay = min + Math.random() * (max - min)
  return new Promise(resolve => setTimeout(resolve, delay))
}
```

**Why we simulate delay?**
- Realistic UX testing (loading states)
- Prepare for real API integration
- Test error handling

---

### 4. Reactivity & UI Update

```vue
<!-- FileTable.vue -->
<template>
  <DataTable :value="files" :loading="loading">
    <!-- Table automatically updates when 'files' changes -->
  </DataTable>
</template>

<script setup lang="ts">
const store = useFilesStore()

// 🔄 Reactive computed - updates automatically when store changes
const files = computed(() => store.paginatedFiles)
const loading = computed(() => store.loading)
</script>
```

**Flow:**
```
State Change → Computed Re-evaluates → Component Re-renders → DOM Updates
```

---

## 🔄 Complete Data Flow Diagrams

### Scenario A: Upload File (Success)

```
┌──────────┐
│   USER   │
└────┬─────┘
     │ 1. Clicks "Enviar"
     ▼
┌─────────────────────┐
│ FileUploadDialog    │
│ - Validates form    │
│ - Shows progress    │
└────┬────────────────┘
     │ 2. Calls store.uploadFile()
     ▼
┌─────────────────────┐
│  useFilesStore      │
│ - loading = true    │
└────┬────────────────┘
     │ 3. Calls simulateDelay()
     ▼
┌─────────────────────┐
│   Mock Data         │
│ - Waits 500-1500ms  │
└────┬────────────────┘
     │ 4. Returns success
     ▼
┌─────────────────────┐
│  useFilesStore      │
│ - Creates newFile   │
│ - files.unshift()   │ ◄─── State Update (Reactive)
│ - loading = false   │
└────┬────────────────┘
     │ 5. Shows toast
     ▼
┌─────────────────────┐
│   useToast          │
│ - success toast     │
└────┬────────────────┘
     │ 6. Toast appears
     ▼
┌─────────────────────┐
│ FileUploadDialog    │
│ - Closes modal      │
│ - Resets form       │
└─────────────────────┘
     │
     ▼
┌─────────────────────┐
│   FileTable         │
│ - Re-renders        │ ◄─── Computed detects state change
│ - New file on top   │
└─────────────────────┘
     │
     ▼
┌─────────────────────┐
│ Statistics Cards    │
│ - Total increments  │ ◄─── Computed recalculates
└─────────────────────┘
```

**Key Points:**
- **Reactive:** Store change automatically updates all components
- **One source of truth:** Store holds the state
- **No prop drilling:** Components access store directly
- **Computed properties:** Cache and optimize re-renders

---

### Scenario B: Apply Filters

```
┌──────────┐
│   USER   │
└────┬─────┘
     │ 1. Fills filter form
     │ 2. Clicks "Filtrar"
     ▼
┌─────────────────────┐
│  FileFilters.vue    │
│ - localFilters (UI) │
└────┬────────────────┘
     │ 3. Calls applyFilters()
     ▼
┌─────────────────────┐
│ useFileFilters      │
│ - Transforms data   │
│ - Calls store       │
└────┬────────────────┘
     │ 4. store.updateFilters()
     ▼
┌─────────────────────┐
│  useFilesStore      │
│ - Updates filters   │ ◄─── State Update
│ - page = 1 (reset)  │
└────┬────────────────┘
     │ 5. Getter recalculates
     ▼
┌─────────────────────┐
│  filteredFiles      │ ◄─── Computed Getter
│ - Applies all logic │
│ - Returns subset    │
└────┬────────────────┘
     │ 6. Another getter
     ▼
┌─────────────────────┐
│  paginatedFiles     │ ◄─── Computed Getter
│ - Slices array      │
│ - Returns page      │
└────┬────────────────┘
     │ 7. Component reads
     ▼
┌─────────────────────┐
│   FileTable.vue     │
│ - Re-renders table  │ ◄─── Reactivity
│ - Shows filtered    │
└─────────────────────┘
```

**Key Points:**
- **Composable layer:** Transforms UI data to store format
- **Chained getters:** filteredFiles → paginatedFiles
- **Performance:** Computed caches results until dependencies change
- **Reset page:** Always return to page 1 when filtering

---

### Scenario C: Delete File (with Confirmation)

```
┌──────────┐
│   USER   │
└────┬─────┘
     │ 1. Clicks trash icon
     ▼
┌─────────────────────┐
│   FileTable.vue     │
│ - Calls handleDelete│
└────┬────────────────┘
     │ 2. confirm.require()
     ▼
┌─────────────────────┐
│  useConfirm (PV)    │
│ - Shows dialog      │
└────┬────────────────┘
     │ 3. User confirms
     ▼
┌─────────────────────┐
│  accept() callback  │
│ - In FileTable      │
└────┬────────────────┘
     │ 4. store.deleteFile(id)
     ▼
┌─────────────────────┐
│  useFilesStore      │
│ - loading = true    │
└────┬────────────────┘
     │ 5. simulateDelay()
     ▼
┌─────────────────────┐
│   Mock Data         │
│ - Waits 500-1500ms  │
└────┬────────────────┘
     │ 6. Returns success
     ▼
┌─────────────────────┐
│  useFilesStore      │
│ - Filters array     │ ◄─── State Update
│ - files = files     │
│    .filter(f =>     │
│      f.id !== id)   │
│ - loading = false   │
└────┬────────────────┘
     │ 7. Shows toast
     ▼
┌─────────────────────┐
│   useToast          │
│ - success message   │
└────┬────────────────┘
     │ 8. UI updates
     ▼
┌─────────────────────┐
│   FileTable.vue     │
│ - Re-renders        │ ◄─── Reactivity
│ - File gone         │
└─────────────────────┘
     │
     ▼
┌─────────────────────┐
│ Statistics Cards    │
│ - Total decrements  │ ◄─── Computed recalculates
│ - Status updates    │
└─────────────────────┘
```

**Key Points:**
- **Two-step process:** Confirm → Action
- **ConfirmDialog:** Separate component (app.vue)
- **Callback pattern:** Action only happens in accept()
- **Array mutation:** Use .filter() to create new array (reactive)

---

## 🔍 State Management Details

### Store Structure (Pinia)

```typescript
interface FilesState {
  // 📦 Raw data
  files: File[]              // All files (source of truth)
  
  // 🔄 UI state
  loading: boolean           // Global loading indicator
  selectedFile: File | null  // Currently selected file
  
  // 🎛️ Filter state
  filters: FileFilters       // Active filter values
}
```

### Getters (Computed Properties)

```typescript
getters: {
  // 1️⃣ Apply filters
  filteredFiles(): File[] {
    return this.files.filter(/* filter logic */)
  },
  
  // 2️⃣ Apply pagination
  paginatedFiles(): File[] {
    const start = (page - 1) * limit
    const end = start + limit
    return this.filteredFiles.slice(start, end)
  },
  
  // 3️⃣ Calculate totals
  totalFiles(): number {
    return this.filteredFiles.length
  },
  
  // 4️⃣ Group by status
  filesByStatus(): Record<FileStatusValue, number> {
    // Count files by status
  }
}
```

**Why this structure?**
- **Single source of truth:** `files` array
- **Derived state:** Everything else computed from `files`
- **Performance:** Computed getters cache results
- **Maintainability:** Logic in one place

---

### Actions (Methods)

```typescript
actions: {
  // 📥 Read
  async fetchFiles() {
    // Populate files array
  },
  
  // ➕ Create
  async uploadFile(file, type, reference) {
    // Add to files array
  },
  
  // ✏️ Update
  async scheduleFile(fileId, date, frequency) {
    // Modify file in array
  },
  
  // 🗑️ Delete
  async deleteFile(fileId) {
    // Remove from files array
  },
  
  // 🎛️ Filters
  updateFilters(newFilters) {
    // Update filters object
  },
  
  resetFilters() {
    // Clear all filters
  }
}
```

**Pattern:**
1. Set loading = true
2. Try async operation (with simulateDelay)
3. Update state on success
4. Show toast feedback
5. Handle errors
6. Finally: loading = false

---

## 🎨 Component Communication

### Parent → Child (Props)

```vue
<!-- Parent: pages/index.vue -->
<FileTable @schedule="handleSchedule" />

<ScheduleDialog 
  :visible="showDialog"
  :file="selectedFile"
/>
```

```vue
<!-- Child: ScheduleDialog.vue -->
<script setup lang="ts">
interface Props {
  visible: boolean
  file: File | null
}

const props = defineProps<Props>()
</script>
```

**Flow:**
```
Parent State → Props → Child Receives → Child Uses
```

---

### Child → Parent (Emits)

```vue
<!-- Child: ScheduleDialog.vue -->
<script setup lang="ts">
const emit = defineEmits<{
  'update:visible': [value: boolean]
  'success': []
}>()

const handleClose = () => {
  emit('update:visible', false)
}

const handleSubmit = async () => {
  // ... do work
  emit('success')
}
</script>
```

```vue
<!-- Parent: pages/index.vue -->
<ScheduleDialog
  v-model:visible="showDialog"
  @success="handleSuccess"
/>

<script setup lang="ts">
const handleSuccess = () => {
  selectedFile.value = null
  // Toast already shown by store
}
</script>
```

**Flow:**
```
Child Event → Emit → Parent Listens → Parent Handles
```

---

### Store (Global State)

```vue
<!-- Any component -->
<script setup lang="ts">
const store = useFilesStore()

// ✅ Direct access
const files = computed(() => store.files)
const loading = computed(() => store.loading)

// ✅ Call actions
const handleUpload = async () => {
  await store.uploadFile(...)
}
</script>
```

**Flow:**
```
Component → Store Access → No props needed
```

**Advantages:**
- No prop drilling
- Single source of truth
- Easy to test
- Type-safe

---

## 🔄 Reactivity System

### How Vue Reactivity Works

```typescript
// 1️⃣ Create reactive state
const files = ref<File[]>([])

// 2️⃣ Create computed (derived state)
const total = computed(() => files.value.length)

// 3️⃣ Mutation triggers update
files.value.push(newFile)
// ↓
// total automatically recalculates
// ↓
// Components using 'total' re-render
```

### Mutation Methods (Trigger Reactivity)

```typescript
// ✅ These trigger reactivity
this.files.push(newFile)
this.files.unshift(newFile)
this.files.splice(index, 1)
this.files = this.files.filter(...)
this.files = [...this.files, newFile]

// ❌ These DON'T trigger reactivity
this.files[0] = newFile  // Direct index assignment
this.files.length = 0    // Length assignment
```

---

## 📊 Data Transformations

### Example: Filter + Pagination Pipeline

```typescript
// Raw data (20 files)
files = [file1, file2, ..., file20]

// ↓ Step 1: Apply name filter
filteredByName = files.filter(f => f.name.includes('janeiro'))
// Result: 5 files

// ↓ Step 2: Apply type filter  
filteredByType = filteredByName.filter(f => f.type === 'mensal')
// Result: 3 files

// ↓ Step 3: Apply status filter
filteredByStatus = filteredByType.filter(f => 
  ['salvo', 'agendado'].includes(f.status)
)
// Result: 2 files

// ↓ Step 4: Calculate pagination
totalPages = Math.ceil(2 / 10) = 1
currentPage = 1

// ↓ Step 5: Slice for current page
paginatedFiles = filteredByStatus.slice(0, 10)
// Result: 2 files (all fit in page 1)
```

**In Code:**

```typescript
getters: {
  filteredFiles(state): File[] {
    let result = [...state.files]
    
    if (state.filters.name) {
      result = result.filter(f => 
        f.name.toLowerCase().includes(state.filters.name!.toLowerCase())
      )
    }
    
    if (state.filters.type) {
      result = result.filter(f => f.type === state.filters.type)
    }
    
    if (state.filters.status?.length) {
      result = result.filter(f => state.filters.status!.includes(f.status))
    }
    
    return result
  },
  
  paginatedFiles(state): File[] {
    const page = state.filters.page || 1
    const limit = state.filters.limit || 10
    const start = (page - 1) * limit
    const end = start + limit
    
    return this.filteredFiles.slice(start, end)
  }
}
```

---

## 🎯 Best Practices

### 1. Single Source of Truth
```typescript
// ✅ Good - Store has the data
const store = useFilesStore()
const files = computed(() => store.files)

// ❌ Bad - Duplicating data
const files = ref([...store.files])  // Now two copies!
```

### 2. Computed over Methods
```typescript
// ✅ Good - Cached, reactive
const total = computed(() => store.files.length)

// ❌ Bad - Recalculates every render
const total = () => store.files.length
```

### 3. Async Actions in Store
```typescript
// ✅ Good - Logic in store
await store.uploadFile(file)

// ❌ Bad - Logic in component
const uploadFile = async () => {
  const response = await fetch(...)
  store.files.push(response.data)
}
```

### 4. Reactive Mutations
```typescript
// ✅ Good - Reactive
this.files = this.files.filter(f => f.id !== id)

// ❌ Bad - Not reactive
for (let i = 0; i < this.files.length; i++) {
  if (this.files[i].id === id) {
    delete this.files[i]  // ❌
  }
}
```

---

## 🔮 Future: Real API Integration

When backend is ready, changes needed:

```typescript
// stores/files.ts

// Before (Mock)
async fetchFiles() {
  await simulateDelay()
  this.files = [...MOCK_FILES]
}

// After (Real API)
async fetchFiles() {
  const { data } = await $fetch<ApiResponse<File[]>>('/api/files', {
    server: false,
    query: this.filters
  })
  this.files = data
}
```

**That's it!** Components don't need to change because they only talk to the store.

---

## 📚 Summary

### Data Flow Pattern:
1. **User interacts** with UI component
2. **Component calls** store action
3. **Store action** makes API call (simulated)
4. **Store updates** its state
5. **Vue reactivity** triggers re-render
6. **Components** show updated data
7. **Toast** gives feedback

### Key Concepts:
- **Pinia Store:** Single source of truth
- **Computed Getters:** Derived, cached state
- **Actions:** Async operations + mutations
- **Reactivity:** Automatic UI updates
- **Composables:** Reusable logic
- **Props/Emits:** Parent-child communication

### Benefits:
- ✅ Predictable data flow
- ✅ Easy to debug (Vue DevTools)
- ✅ Easy to test (isolated functions)
- ✅ Type-safe (TypeScript)
- ✅ Performance (computed caching)
- ✅ Maintainable (separation of concerns)

---

**Now you understand how data flows through the entire SIRC Dashboard!** 🎉