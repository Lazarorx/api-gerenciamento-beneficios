# Guia de Desenvolvimento

## 🛠️ Ferramentas Configuradas

### ESLint
- **Configuração**: `eslint.config.js`
- **Regras**: Focadas em Clean Code e Node.js
- **Comandos**:
  - `npm run lint` - Verificar problemas
  - `npm run lint:fix` - Corrigir automaticamente
  - `npm run lint:check` - Verificar sem warnings

### Jest
- **Configuração**: `jest.config.js`
- **Tipos de teste**: Unitários e Integração
- **Comandos**:
  - `npm test` - Executar todos os testes
  - `npm run test:unit` - Apenas testes unitários
  - `npm run test:integration` - Apenas testes de integração
  - `npm run test:coverage` - Com relatório de cobertura
  - `npm run test:watch` - Modo watch

### Nodemon
- **Configuração**: `nodemon.json`
- **Auto-reload**: Reinicia automaticamente em mudanças
- **Comando**: `npm run dev`

## 📁 Estrutura de Testes

```
tests/
├── setup.js              # Setup global
├── integration/
│   ├── setup.js          # Setup para integração
│   └── *.test.js         # Testes de API
└── unit/
    └── *.test.js         # Testes unitários
```

## 🚀 Comandos Úteis

### Desenvolvimento
```bash
npm run dev          # Iniciar servidor em desenvolvimento
npm run start        # Iniciar servidor em produção
```

### Testes
```bash
npm test             # Executar todos os testes
npm run test:watch   # Testes em modo watch
npm run test:coverage # Testes com cobertura
```

### Qualidade de Código
```bash
npm run lint         # Verificar código
npm run lint:fix     # Corrigir automaticamente
npm run validate     # Lint + testes com cobertura
```

### Utilitários
```bash
npm run clean        # Limpar cache e coverage
npm run setup        # Setup completo do projeto
```

## 🎯 Padrões de Código

### Estilo
- Indentação: 2 espaços
- Aspas: Simples ('string')
- Ponto e vírgula: Obrigatório
- Máximo 100 caracteres por linha

### Arquitetura
- Máximo 4 parâmetros por função
- Complexidade máxima: 10
- Profundidade máxima: 4 níveis

### Testes
- Cobertura mínima: 80%
- Nomes descritivos
- Arrange, Act, Assert

## 🔧 VS Code

### Extensões Recomendadas
- ESLint
- Jest
- Path Intellisense

### Configurações
- Formatação automática ao salvar
- Correção ESLint automática
- Integração com Jest

## 📝 Convenções

### Nomes de Arquivos
- Classes: PascalCase (BenefitController.js)
- Funções: camelCase
- Constantes: UPPER_SNAKE_CASE
- Arquivos de teste: *.test.js

### Commits
- feat: Nova funcionalidade
- fix: Correção de bug
- test: Adição de testes
- refactor: Refatoração
- docs: Documentação

### Branches
- main: Produção
- develop: Desenvolvimento
- feature/nome-da-feature
- fix/nome-do-bug