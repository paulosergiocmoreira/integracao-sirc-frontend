# AI Assistance Guidelines - SIRC Dashboard

## Quando Usar Co-authored-by

### ✅ **Use `Co-authored-by: Cursor AI <cursor@cursor.sh>` quando:**

1. **Geração de Código**
   - Cursor AI gerou código novo significativo
   - Refatoração complexa foi assistida por AI
   - Implementação de funcionalidades com ajuda substancial da AI

2. **Debugging e Otimização**
   - AI ajudou a identificar e corrigir bugs complexos
   - Otimizações de performance sugeridas pela AI
   - Resolução de problemas de TypeScript/compilação

3. **Arquitetura e Design**
   - Decisões arquiteturais foram AI-guided
   - Padrões de design implementados com orientação da AI
   - Estruturação de componentes ou stores com ajuda da AI

4. **Documentação**
   - Documentação gerada ou significativamente melhorada pela AI
   - Comentários de código explicativos criados pela AI
   - Guias e READMEs com conteúdo AI-generated

5. **Migração e Refatoração**
   - Migração de APIs (como nossa migração para stores)
   - Refatoração de componentes existentes
   - Atualização de dependências com orientação da AI

### ❌ **NÃO use quando:**

1. **Edições Menores**
   - Correções simples de sintaxe
   - Ajustes de formatação
   - Mudanças de nome de variáveis simples

2. **Uso de Snippets**
   - Copiar e colar snippets pequenos
   - Uso de autocomplete padrão
   - Aplicação de templates básicos

## Exemplos Práticos

### ✅ **Exemplo 1: Feature Completa**
```
feat(components): implement advanced file filtering system

Add comprehensive filtering with debounced search, multi-criteria
filtering, and real-time updates. Includes TypeScript interfaces,
composable functions, and responsive design.

Co-authored-by: Cursor AI <cursor@cursor.sh>
```

### ✅ **Exemplo 2: Refatoração Complexa**
```
refactor(stores): migrate from direct API calls to store pattern

Migrate all components to use Pinia stores instead of direct $fetch
calls. Includes mock data implementation and proper error handling.

Co-authored-by: Cursor AI <cursor@cursor.sh>
```

### ✅ **Exemplo 3: Documentação**
```
docs: add comprehensive API integration guide

Create detailed guide for integrating with SIRC API endpoints,
including authentication, error handling, and best practices.

Co-authored-by: Cursor AI <cursor@cursor.sh>
```

### ❌ **Exemplo 4: Não Precisa**
```
fix(components): correct button alignment

Simple CSS adjustment for mobile view.
```

## Benefícios da Prática

1. **Transparência**: Clareza sobre origem do código
2. **Rastreabilidade**: Histórico de contribuições AI
3. **Colaboração**: Reconhecimento adequado das ferramentas
4. **Qualidade**: Incentiva revisão cuidadosa de código AI-generated
5. **Learning**: Identifica padrões de uso da AI na equipe

## Configuração no Template

O template de commit já inclui a linha:
```
# Co-authored-by: Cursor AI <cursor@cursor.sh>  # Add when AI-assisted
```

Basta descomentar e usar quando apropriado.

## Integração com CI/CD

Consider adding GitHub Actions to:
- Validate commit message format
- Check for AI assistance attribution
- Generate reports on AI usage patterns

---

**Desenvolvedor Principal:** Cap Paulo Sérgio (paulosergiopscm@fab.mil.br)  
**AI Assistant:** Cursor AI  
**Projeto:** SIRC Dashboard CSR SPA
