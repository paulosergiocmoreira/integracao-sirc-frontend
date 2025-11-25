# Feature Workflow Example

Este é um exemplo de como trabalhar com features seguindo o GitFlow.

## Como criar uma nova feature:

### 1. Criar branch da feature
```bash
git checkout develop
git checkout -b feature/nome-da-feature
```

### 2. Trabalhar na feature
```bash
# Fazer alterações nos arquivos...
git add .
git commit -m "feat(components): add new component functionality"
git commit -m "fix(styles): resolve responsive layout issue"
```

### 3. Finalizar a feature
```bash
# Voltar para develop
git checkout develop

# Fazer merge da feature
git merge --no-ff feature/nome-da-feature

# Deletar branch da feature
git branch -d feature/nome-da-feature
```

## Exemplos de mensagens de commit:

### Features
- `feat(components): add dark mode toggle to header`
- `feat(stores): implement file upload functionality`
- `feat(pages): create new dashboard overview page`

### Fixes
- `fix(stores): resolve pagination issue in files table`
- `fix(components): correct button alignment in mobile view`
- `fix(types): update API interface definitions`

### Documentation
- `docs: update component usage examples`
- `docs(api): add integration guide for file uploads`

### Refactoring
- `refactor(composables): simplify file filtering logic`
- `refactor(components): extract reusable table component`

### Styling
- `style(components): improve button hover effects`
- `style(layouts): fix sidebar responsive behavior`

### Tests
- `test(components): add unit tests for file upload`
- `test(stores): add integration tests for file management`

### Configuration
- `chore(config): update TypeScript strict mode settings`
- `chore(deps): update PrimeVue to latest version`

### AI-Assisted Commits
Quando usar Cursor AI, adicione `Co-authored-by: Cursor AI <cursor@cursor.sh>`:

```
feat(components): add advanced file filtering with AI assistance

Implement smart filtering using Cursor AI recommendations for better UX.
Added debounced search and multi-criteria filtering.

Co-authored-by: Cursor AI <cursor@cursor.sh>
```

## Branch Protection Rules

Para manter a qualidade do código, considere configurar:

1. **Branch Protection** na branch `master`
2. **Required Status Checks** (TypeScript, linting, tests)
3. **Required Reviews** para pull requests
4. **No direct pushes** para `master` e `develop`

## Exemplo Completo

```bash
# 1. Criar feature
git checkout develop
git checkout -b feature/add-file-export

# 2. Desenvolver
git add .
git commit -m "feat(components): add export button to file table"

git add .
git commit -m "feat(stores): implement file export functionality"

git add .
git commit -m "test(components): add tests for export functionality"

# 3. Finalizar
git checkout develop
git merge --no-ff feature/add-file-export
git branch -d feature/add-file-export

# 4. Push para repositório remoto
git push origin develop
```

Este exemplo será removido após a configuração inicial estar completa.
