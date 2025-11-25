# AGENTS.MD

Agent guide for SIRC Dashboard - CSR SPA (Nuxt 4 + Vue 3 + TypeScript + PrimeVue + Tailwind + Pinia)

---

## Commands

```bash
pnpm dev          # localhost:3000
pnpm typecheck    # Validate TypeScript
pnpm lint:fix     # Auto-fix linting
```

---

## Critical Conventions

### Architecture
- **CSR only:** All API calls use `server: false`
- **State:** Pinia stores (see `stores/files.ts` for pattern)
- **Data:** Mock layer (`stores/mocks.ts`) - swap with real API later
- **Style:** PrimeVue Styled Mode + Tailwind utilities only (no custom CSS)
- **Dark mode:** `.dark` class on `<html>` (see `composables/useTheme.ts`)

### Code Style
- **Components:** `<script setup lang="ts">` - see existing in `components/features/files/`
- **Props/Emits:** TypeScript interfaces - see `FileUploadDialog.vue`
- **Auto-imports:** NEVER manually import Vue/Nuxt utils (ref, computed, useState, etc)
- **PrimeVue:** ALWAYS explicit import - `import Button from 'primevue/button'`
- **TypeScript:** Strict mode, no `any`, interfaces over types
- **Arrays:** Use `.push()/.filter()` NOT `[index] =` (reactivity)

### Data Fetching
```typescript
// Component setup - see pages/index.vue
useFetch('/api/x', { server: false, lazy: true, key: 'id' })

// User actions - see stores/files.ts actions
$fetch('/api/x', { method: 'POST', body })
```

### Commit Messages
**OBRIGATÓRIO**: Todos os commits em Português Brasileiro (pt-BR)
```bash
feat(components): adiciona tabela de consultas com filtros
fix(stores): resolve problema de paginação nos arquivos
docs(api): atualiza exemplos de integração
```
Ver regra completa: `.cursor/rules/git-workflow.mdc`

### Store Pattern
See `stores/files.ts` for complete example:
- State: raw data + loading + filters
- Getters: filtered → paginated (computed, cached)
- Actions: async with try/catch + toast + loading states

### Styling
- **Order:** layout → spacing → sizing → colors → typography
- **Responsive:** mobile-first (`sm:` `md:` `lg:`)
- **Colors:** Semantic only (`bg-primary` `text-surface-900`) NOT `bg-blue-500`
- **Dark:** All components must support (test toggle)

---

## Mandatory Requirements

Every feature MUST have:
1. **Loading state** - `loading` ref + spinner/skeleton
2. **Empty state** - Clear message when no data (see `FileTable.vue` template)
3. **Error handling** - try/catch + console.error + toast
4. **Toast feedback** - Success/error for all actions (see `composables/useToast.ts`)
5. **Validation** - Client-side before API (see `utils/validators.ts`)
6. **Confirmation** - Destructive actions (see `FileTable.vue` handleDelete)
7. **Accessibility** - labels, aria-labels, keyboard nav
8. **Responsive** - Test 375px, 768px, 1920px
9. **Dark mode** - Works in both themes

---

## File References (Examples)

**Store pattern:** `stores/files.ts` (300+ lines - complete example)
**Composable pattern:** `composables/useFileFilters.ts`
**Component patterns:** `components/features/files/` (4 complete components)
**Filters component:** `components/features/files/FileFilters.vue`
**Table component:** `components/features/files/FileTable.vue`
**Modal pattern:** `components/features/files/FileUploadDialog.vue`
**Confirmation pattern:** `components/features/files/ScheduleDialog.vue`
**Page integration:** `pages/index.vue`
**Utils:** `utils/formatters.ts` (13 functions), `utils/validators.ts` (13 functions)
**Mock data:** `stores/mocks.ts` (helpers: simulateDelay, simulateError)
**Types:** `types/api.ts` (all interfaces from openapi.yaml)

---

## Design Tokens

```json
{
  "status": { "salvo": "success", "agendado": "warn", "em-execucao": "info", "erro": "danger" },
  "hitTypes": { "hit-perfeito": "success", "cpf-completo": "info", "cpf-incompleto": "warn", "data-nascimento": "secondary", "hit-com-falecido": "danger" }
}
```

---

## Global Setup (Required)

- `<Toast />` in `layouts/default.vue` (already done)
- `<ConfirmDialog />` in `app/app.vue` (already done)

---

## Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| Store not found | Restart dev server |
| Toast not showing | Check `<Toast />` in layout |
| ConfirmDialog fails | Check `<ConfirmDialog />` in app.vue |
| TypeScript errors | Run `pnpm typecheck` |
| Styles wrong | Check `main.css` layers order |

Full guide: `TROUBLESHOOTING.md`

---

## Reference Docs

- **Testing:** `TESTING.md` (100+ test cases)
- **Troubleshooting:** `TROUBLESHOOTING.md` (detailed solutions)
- **Architecture:** `DATA-FLOW.md` (diagrams + explanations)
- **API:** `openapi.yaml` (all endpoints)
- **Cursor Rules:** `.cursor/` (component, composable, data-fetching patterns)
- **Git Workflow:** `.cursor/rules/git-workflow.mdc` (commit standards in Portuguese)

---

## Workflow

1. Check `.cursor/` rules for patterns
2. Reference existing files for examples
3. Follow conventions above
4. Run `pnpm typecheck && pnpm lint:fix`
5. Test manually
6. If stuck: `TROUBLESHOOTING.md`

---

**Key principle:** Reference existing code, don't repeat it. See `stores/files.ts` and `components/features/files/` for all patterns.