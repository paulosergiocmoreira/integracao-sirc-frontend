# TESTING.md

Complete testing guide for SIRC Dashboard.

---

## 🚀 Pre-Testing Setup

### 1. Start Development Server
```bash
pnpm dev
```
Wait until you see: `✔ Nuxt is listening on http://localhost:3000/`

### 2. Open Browser
Navigate to: `http://localhost:3000/`

### 3. Open DevTools
- **Chrome/Edge:** `F12` or `Ctrl+Shift+I`
- **Firefox:** `F12` or `Ctrl+Shift+I`
- **Safari:** `Cmd+Option+I`

Check Console tab for any errors (should be none).

---

## ✅ STEP 1: FILES SCREEN - COMPLETE TEST CHECKLIST

### 📊 Initial Load Tests

#### Test 1.1: Page Loads Successfully
- [ ] Page loads without errors
- [ ] Console shows no errors
- [ ] Header displays "Arquivos" title
- [ ] Subtitle shows "Gerencie os arquivos de óbitos do SIRC"
- [ ] "Novo Arquivo" button is visible and styled correctly

#### Test 1.2: Statistics Cards Display
- [ ] 4 cards are visible (Total, Salvos, Agendados, Com Erro)
- [ ] Each card shows correct icon
- [ ] Numbers are displayed (should match mock data)
- [ ] Cards are in grid layout (responsive)
- [ ] Colors match design:
  - Total: Primary blue
  - Salvos: Green
  - Agendados: Amber/yellow
  - Com Erro: Red

#### Test 1.3: Filters Section
- [ ] Filters card is visible
- [ ] "Filtros" header with icon
- [ ] 5 filter inputs visible:
  - Nome do Arquivo (text input)
  - Tipo (dropdown)
  - Período Inicial (calendar)
  - Período Final (calendar)
  - Status (multiselect)
- [ ] "Filtrar" and "Limpar" buttons visible

#### Test 1.4: Data Table Loads
- [ ] Table displays without errors
- [ ] 10 rows visible initially (default pagination)
- [ ] 7 columns visible:
  - Nome do Arquivo
  - Tipo
  - Referência
  - Upload
  - Status
  - Último Cruzamento
  - Ações
- [ ] Data is formatted correctly
- [ ] File icons appear based on extension
- [ ] Status badges have correct colors
- [ ] Action buttons (3) appear on each row

#### Test 1.5: Pagination Controls
- [ ] Pagination appears at bottom of table
- [ ] "Itens por página" dropdown shows (default: 10)
- [ ] Page indicator shows "1-10 de X"
- [ ] Navigation buttons are visible

---

### 🔍 Filter Tests

#### Test 2.1: Name Filter
**Steps:**
1. Type "janeiro" in "Nome do Arquivo" field
2. Click "Filtrar"

**Expected:**
- [ ] Table updates to show only files with "janeiro" in name
- [ ] Statistics cards update
- [ ] Badge shows "1" active filter
- [ ] Pagination resets to page 1

#### Test 2.2: Type Filter
**Steps:**
1. Click "Limpar" to reset
2. Select "Mensal" from "Tipo" dropdown
3. Click "Filtrar"

**Expected:**
- [ ] Table shows only monthly files
- [ ] Badge shows "Mensal" in type column
- [ ] Filter badge shows "1" active filter

#### Test 2.3: Period Filter
**Steps:**
1. Click "Limpar"
2. Select "01/2024" in "Período Inicial"
3. Select "12/2024" in "Período Final"
4. Click "Filtrar"

**Expected:**
- [ ] Table shows only files within date range
- [ ] Dates are validated (end >= start)

#### Test 2.4: Status Filter (Multiple)
**Steps:**
1. Click "Limpar"
2. Select "Salvo" and "Agendado" in Status multiselect
3. Click "Filtrar"

**Expected:**
- [ ] Table shows only files with selected statuses
- [ ] Two chips appear in multiselect
- [ ] Filter badge shows "1" active filter

#### Test 2.5: Combined Filters
**Steps:**
1. Apply name filter: "obitos"
2. Apply type filter: "Mensal"
3. Apply status filter: "Salvo"
4. Click "Filtrar"

**Expected:**
- [ ] All filters apply cumulatively
- [ ] Filter badge shows "3" active filters
- [ ] Results match ALL criteria

#### Test 2.6: Clear Filters
**Steps:**
1. With filters applied, click "Limpar"

**Expected:**
- [ ] All filter inputs reset to empty/default
- [ ] Table shows all files
- [ ] Filter badge disappears
- [ ] Statistics cards show full totals

#### Test 2.7: No Results
**Steps:**
1. Type "xyzabc123" (non-existent) in name
2. Click "Filtrar"

**Expected:**
- [ ] Empty state appears
- [ ] Message: "Nenhum arquivo encontrado"
- [ ] Suggestion: "Tente ajustar os filtros"
- [ ] Inbox icon displayed
- [ ] No table rows

---

### 📄 Pagination Tests

#### Test 3.1: Change Items Per Page
**Steps:**
1. Click "Itens por página" dropdown
2. Select "20"

**Expected:**
- [ ] Table shows up to 20 rows
- [ ] Page indicator updates: "1-20 de X"
- [ ] Pagination controls adjust
- [ ] Returns to page 1

#### Test 3.2: Navigate Pages
**Steps:**
1. Set to 10 items per page
2. Click "Next" page button

**Expected:**
- [ ] Table shows next 10 items
- [ ] Page indicator updates: "11-20 de X"
- [ ] Previous button becomes enabled

#### Test 3.3: Jump to Page
**Steps:**
1. Click page number (e.g., "3") in paginator

**Expected:**
- [ ] Table shows corresponding page
- [ ] Page indicator updates correctly
- [ ] Active page highlighted

---

### 📤 Upload Tests

#### Test 4.1: Open Upload Dialog
**Steps:**
1. Click "Novo Arquivo" button

**Expected:**
- [ ] Modal opens with animation
- [ ] Title: "Novo Arquivo"
- [ ] File upload area visible
- [ ] Type dropdown visible
- [ ] Reference calendar visible
- [ ] "Cancelar" and "Enviar" buttons visible
- [ ] "Enviar" button is disabled (no file selected)

#### Test 4.2: File Selection
**Steps:**
1. Click "Selecionar Arquivo"
2. Choose any file from your computer

**Expected:**
- [ ] File preview appears
- [ ] File name displayed
- [ ] File size displayed (formatted: KB/MB)
- [ ] File icon appears
- [ ] "X" button to remove file

#### Test 4.3: File Validation - Size
**Steps:**
1. Try to upload a file > 10MB

**Expected:**
- [ ] Error message appears
- [ ] Message: "Arquivo muito grande. Tamanho máximo: 10MB"
- [ ] File is not selected
- [ ] Red error text visible

#### Test 4.4: File Validation - Extension
**Steps:**
1. Try to upload a .pdf or .docx file

**Expected:**
- [ ] Error message appears
- [ ] Message: "Formato não suportado. Use: CSV, TXT, XLS ou XLSX"
- [ ] File is not selected

#### Test 4.5: Valid File Upload
**Steps:**
1. Select a valid file (any extension: csv/txt/xls/xlsx, < 10MB)
2. Select "Mensal" in Type dropdown
3. Select "01/2025" in Reference calendar
4. Click "Enviar"

**Expected:**
- [ ] Progress bar appears and animates (0% → 100%)
- [ ] Success toast appears: "Arquivo enviado"
- [ ] Detail: "O arquivo foi salvo com sucesso"
- [ ] Modal closes automatically
- [ ] New file appears at TOP of table
- [ ] Statistics card "Total" increments by 1
- [ ] File shows "Salvo" status

#### Test 4.6: Upload Without Type
**Steps:**
1. Select a file
2. Select reference
3. Leave Type empty
4. Click "Enviar"

**Expected:**
- [ ] Error appears under Type dropdown
- [ ] Message: "Selecione o tipo do arquivo"
- [ ] Red border on dropdown
- [ ] Upload does not proceed

#### Test 4.7: Upload Without Reference
**Steps:**
1. Select a file
2. Select type
3. Leave Reference empty
4. Click "Enviar"

**Expected:**
- [ ] Error appears under Reference calendar
- [ ] Message: "Selecione a referência"
- [ ] Upload does not proceed

#### Test 4.8: Cancel Upload
**Steps:**
1. Open upload dialog
2. Select a file
3. Click "Cancelar"

**Expected:**
- [ ] Modal closes
- [ ] No upload happens
- [ ] Form resets for next use
- [ ] No toast appears

---

### 📅 Schedule Tests

#### Test 5.1: Open Schedule Dialog
**Steps:**
1. Click calendar icon (📅) on any file row

**Expected:**
- [ ] Modal opens
- [ ] Title: "Agendar Cruzamento"
- [ ] File info card displays:
  - File icon
  - File name
  - Type badge
  - Reference
- [ ] Date/time calendar visible
- [ ] Frequency dropdown visible
- [ ] Buttons: "Cancelar" and "Agendar"

#### Test 5.2: Past Date Validation
**Steps:**
1. Select a past date in calendar
2. Select frequency: "Único"
3. Click "Agendar"

**Expected:**
- [ ] Error appears under date field
- [ ] Message: "A data do agendamento deve ser futura"
- [ ] Red border on calendar
- [ ] Scheduling does not proceed

#### Test 5.3: Valid Scheduling
**Steps:**
1. Select a future date (e.g., tomorrow)
2. Select time (e.g., 08:00)
3. Select frequency: "Mensal"
4. Observe summary box

**Expected:**
- [ ] Summary box appears (blue background)
- [ ] Shows: Arquivo, Data/Hora, Frequência
- [ ] Values are correct
- [ ] "Agendar" button becomes enabled

**Steps (continue):**
4. Click "Agendar"

**Expected:**
- [ ] Success toast: "Cruzamento agendado"
- [ ] Modal closes
- [ ] File status changes to "Agendado" (amber badge)
- [ ] "Agendados" statistic increments

#### Test 5.4: Frequency Options
**Steps:**
1. Open schedule dialog
2. Click Frequency dropdown

**Expected:**
- [ ] 3 options visible:
  - Único
  - Diário
  - Mensal
- [ ] Each has description text below dropdown
- [ ] Descriptions change based on selection

#### Test 5.5: Cancel Scheduling
**Steps:**
1. Open schedule dialog
2. Fill form
3. Click "Cancelar"

**Expected:**
- [ ] Modal closes
- [ ] No changes to file
- [ ] No toast appears
- [ ] Form resets for next use

---

### ▶️ Execute Tests

#### Test 6.1: Execute Confirmation
**Steps:**
1. Click play icon (▶️) on any file row

**Expected:**
- [ ] Confirmation dialog appears
- [ ] Title: "Confirmar Execução"
- [ ] Message: "Deseja executar o cruzamento para o arquivo '[filename]'?"
- [ ] Play icon in dialog
- [ ] Buttons: "Cancelar" and "Executar"

#### Test 6.2: Execute Crossing
**Steps:**
1. Click "Executar" in confirmation

**Expected:**
- [ ] Info toast: "Cruzamento iniciado"
- [ ] File status changes to "Em Execução" (blue badge)
- [ ] Action buttons on that row become disabled
- [ ] After ~3 seconds:
  - Status changes back to "Salvo" (green badge)
  - Success toast: "Cruzamento concluído"
  - "Último Cruzamento" column updates to "Hoje"
  - Action buttons re-enable

#### Test 6.3: Cancel Execution
**Steps:**
1. Click play icon
2. Click "Cancelar" in confirmation

**Expected:**
- [ ] Dialog closes
- [ ] No changes to file
- [ ] No execution happens

---

### 🗑️ Delete Tests

#### Test 7.1: Delete Confirmation
**Steps:**
1. Click trash icon (🗑️) on any file row

**Expected:**
- [ ] Confirmation dialog appears
- [ ] Title: "Confirmar Exclusão"
- [ ] Warning icon (triangle with !)
- [ ] Message: "Tem certeza que deseja excluir o arquivo '[filename]'? Esta ação não pode ser desfeita."
- [ ] "Excluir" button is RED (danger style)
- [ ] Buttons: "Cancelar" and "Excluir"

#### Test 7.2: Delete File
**Steps:**
1. Note the current total count
2. Click "Excluir" in confirmation

**Expected:**
- [ ] Success toast: "Arquivo excluído"
- [ ] File disappears from table
- [ ] Total statistic decrements by 1
- [ ] If file was "Salvo", "Salvos" stat decrements
- [ ] Pagination adjusts if needed

#### Test 7.3: Cancel Deletion
**Steps:**
1. Click trash icon
2. Click "Cancelar"

**Expected:**
- [ ] Dialog closes
- [ ] File remains in table
- [ ] No changes
- [ ] No toast

---

### 🌓 Dark Mode Tests

#### Test 8.1: Toggle Dark Mode
**Steps:**
1. Click theme toggle in header (sun/moon icon)

**Expected:**
- [ ] All components switch to dark theme
- [ ] Background colors invert appropriately
- [ ] Text remains readable (good contrast)
- [ ] Cards have dark backgrounds
- [ ] Borders are visible
- [ ] Badges adjust colors
- [ ] Modals have dark backgrounds
- [ ] Inputs have dark styling

#### Test 8.2: Toggle Back to Light
**Steps:**
1. Click theme toggle again

**Expected:**
- [ ] Returns to light theme
- [ ] All colors revert correctly
- [ ] No visual glitches

---

### 📱 Responsive Tests

#### Test 9.1: Desktop (1920x1080)
**Steps:**
1. Open browser DevTools
2. Set viewport to 1920x1080

**Expected:**
- [ ] Statistics cards in 4-column grid
- [ ] Filters in 4-column grid
- [ ] Table fits without horizontal scroll
- [ ] All columns visible
- [ ] Sidebar is expanded
- [ ] No layout breaks

#### Test 9.2: Laptop (1366x768)
**Steps:**
1. Set viewport to 1366x768

**Expected:**
- [ ] Layout adjusts
- [ ] Statistics cards may go to 2 columns
- [ ] Filters adjust to 2 columns
- [ ] Table still readable
- [ ] May have horizontal scroll if needed

#### Test 9.3: Tablet Portrait (768x1024)
**Steps:**
1. Set viewport to 768x1024

**Expected:**
- [ ] Statistics cards in 2 columns
- [ ] Filters stack (1-2 columns)
- [ ] Table has horizontal scroll
- [ ] Action buttons remain functional
- [ ] Modals are centered and fit
- [ ] Sidebar may collapse to menu

#### Test 9.4: Mobile (375x667)
**Steps:**
1. Set viewport to 375x667

**Expected:**
- [ ] Statistics cards in 1 column (stacked)
- [ ] Filters in 1 column (stacked)
- [ ] Table has horizontal scroll
- [ ] All functionality accessible
- [ ] Modals fit screen (may be full-width)
- [ ] Touch-friendly button sizes
- [ ] Sidebar collapses to hamburger menu

---

### ♿ Accessibility Tests

#### Test 10.1: Keyboard Navigation
**Steps:**
1. Click in browser window
2. Press Tab repeatedly

**Expected:**
- [ ] Focus moves through interactive elements in logical order
- [ ] Focus outline is visible on each element
- [ ] Can Tab through: buttons, inputs, dropdowns, table rows
- [ ] Can Shift+Tab to go backwards

#### Test 10.2: Form Navigation
**Steps:**
1. Open upload modal
2. Tab through form elements

**Expected:**
- [ ] Focus moves: File upload → Type → Reference → Buttons
- [ ] Can activate dropdowns with Space/Enter
- [ ] Can close modal with Esc
- [ ] Form submission works with Enter key

#### Test 10.3: Action Buttons
**Steps:**
1. Tab to action buttons in table
2. Press Enter on each

**Expected:**
- [ ] Schedule: Opens dialog
- [ ] Execute: Opens confirmation
- [ ] Delete: Opens confirmation
- [ ] All dialogs can be controlled with keyboard

#### Test 10.4: Screen Reader Labels
**Steps:**
1. Inspect elements in DevTools
2. Check for accessibility attributes

**Expected:**
- [ ] All inputs have labels (for/id or aria-label)
- [ ] Icon buttons have aria-label
- [ ] Form errors have aria-describedby
- [ ] Modals have aria-labelledby and role="dialog"
- [ ] Tables have proper structure (thead, tbody)

#### Test 10.5: Color Contrast
**Steps:**
1. Open browser DevTools
2. Run Lighthouse Accessibility audit

**Expected:**
- [ ] Score: 90+ (ideally 100)
- [ ] No contrast issues
- [ ] All text is readable
- [ ] Focus indicators have sufficient contrast

---

### ⚡ Performance Tests

#### Test 11.1: Initial Load Time
**Steps:**
1. Hard refresh page (Ctrl+Shift+R)
2. Check Network tab in DevTools

**Expected:**
- [ ] Page loads in < 2 seconds
- [ ] No console errors
- [ ] Assets load properly

#### Test 11.2: Table Scrolling
**Steps:**
1. With 20 items per page
2. Scroll through table rapidly

**Expected:**
- [ ] Smooth scrolling (60fps)
- [ ] No layout shift
- [ ] No jank or stutter

#### Test 11.3: Modal Open/Close
**Steps:**
1. Open and close upload modal 10 times rapidly

**Expected:**
- [ ] Smooth animations
- [ ] No memory leaks (check DevTools Memory)
- [ ] Responsive on each open

---

### 🐛 Error Handling Tests

#### Test 12.1: Simulated Network Error
**Steps:**
1. In `stores/mocks.ts`, uncomment `simulateError()` in `fetchFiles()`
2. Refresh page

**Expected:**
- [ ] Error toast appears: "Erro de conexão"
- [ ] Detail: "Não foi possível conectar ao servidor"
- [ ] Table shows empty state or previous data
- [ ] App doesn't crash
- [ ] Console shows logged error

#### Test 12.2: Invalid Form Submission
**Steps:**
1. Open upload modal
2. Click "Enviar" without filling anything

**Expected:**
- [ ] Multiple validation errors appear
- [ ] Red borders on invalid fields
- [ ] Form doesn't submit
- [ ] User is guided to fix errors

#### Test 12.3: Console Errors
**Steps:**
1. Throughout all tests
2. Monitor Console tab

**Expected:**
- [ ] No errors (except intentional test errors)
- [ ] No warnings about missing keys
- [ ] No hydration mismatches
- [ ] No TypeScript errors

---

## ✅ Test Summary Checklist

After completing all tests, verify:

### Functionality
- [ ] All CRUD operations work
- [ ] All filters apply correctly
- [ ] Pagination works in all scenarios
- [ ] Uploads validate and succeed
- [ ] Scheduling validates and works
- [ ] Execution works with status changes
- [ ] Deletion confirms and works
- [ ] Statistics update correctly

### UX/UI
- [ ] Loading states appear appropriately
- [ ] Empty states are clear and helpful
- [ ] Success/error toasts appear for all actions
- [ ] Confirmations work for destructive actions
- [ ] Tooltips appear on hover
- [ ] Forms validate before submission

### Design
- [ ] Dark mode works perfectly
- [ ] Colors match design system
- [ ] Badges use correct severity
- [ ] Icons are appropriate
- [ ] Spacing is consistent
- [ ] Typography is readable

### Responsive
- [ ] Works on desktop (1920px+)
- [ ] Works on laptop (1366px)
- [ ] Works on tablet (768px)
- [ ] Works on mobile (375px)
- [ ] No horizontal overflow (except tables)

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader labels present
- [ ] Color contrast is sufficient
- [ ] Focus indicators visible
- [ ] Logical tab order

### Performance
- [ ] Page loads quickly (< 2s)
- [ ] Smooth animations
- [ ] No memory leaks
- [ ] No console errors

### Code Quality
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Auto-imports working
- [ ] Components follow conventions

---

## 🎯 Known Issues / Expected Behaviors

### Expected Behaviors (Not Bugs):
1. **Upload Progress:** Always animates to 100% (simulated, no real upload)
2. **Execution Time:** Always takes ~3 seconds (simulated processing)
3. **Network Errors:** 10% chance when `simulateError()` is active
4. **Data Persistence:** Resets on page refresh (no real backend)

### Should NOT Happen:
1. Console errors (except intentional test errors)
2. White screen / crashes
3. Buttons that do nothing
4. Modals that don't close
5. Forms that submit when invalid
6. Missing toasts on actions
7. Broken responsive layouts

---

## 📝 Test Report Template

```markdown
## Test Report - Step 1 (Files Screen)

**Date:** YYYY-MM-DD
**Tester:** [Your Name]
**Environment:** 
- Browser: [Chrome 120 / Firefox 121 / Safari 17]
- OS: [Windows 11 / macOS 14 / Ubuntu 22.04]
- Screen: [1920x1080]

### Results:
- ✅ Initial Load: PASS
- ✅ Filters: PASS
- ✅ Pagination: PASS
- ✅ Upload: PASS
- ✅ Schedule: PASS
- ✅ Execute: PASS
- ✅ Delete: PASS
- ✅ Dark Mode: PASS
- ✅ Responsive: PASS
- ✅ Accessibility: PASS (Score: 98/100)

### Issues Found:
[List any issues or unexpected behaviors]

### Notes:
[Any additional observations]
```

---

**Ready to test!** Start from Test 1.1 and work through systematically. 🚀