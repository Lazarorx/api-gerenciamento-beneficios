# API de Gerenciamento de Benefícios

API REST desenvolvida em Node.js com Express.js para gerenciar benefícios corporativos. O projeto foi construído seguindo os princípios da Clean Architecture e boas práticas de desenvolvimento.

## Sobre o Projeto

Esta API permite o gerenciamento completo de benefícios corporativos, incluindo operações de criação, listagem, ativação, desativação e exclusão. O código foi estruturado pensando em manutenibilidade, testabilidade e separação de responsabilidades.

## Funcionalidades

- Criar novos benefícios com validação de dados
- Listar todos os benefícios cadastrados
- Ativar e desativar benefícios
- Excluir benefícios do sistema
- Validações robustas de entrada
- Cobertura de testes automatizados

## Arquitetura

O projeto segue os princípios da Clean Architecture, organizando o código em camadas independentes:

```
src/
├── entities/          Entidades de domínio e regras de negócio
├── usecases/          Casos de uso da aplicação
├── repositories/      Interfaces e implementações de acesso a dados
├── controllers/       Controladores HTTP
├── infrastructure/    Configurações de banco e servidor
├── config/            Arquivos de configuração
└── validators/        Validadores de entrada

tests/
├── unit/              Testes unitários
├── integration/       Testes de integração
└── fixtures/          Dados para testes
```

### Fluxo de Dados

```
HTTP Request → Controller → Use Case → Repository → Database
HTTP Response ← Controller ← Use Case ← Repository ← Database
```

## Tecnologias Utilizadas

- Node.js 18+
- Express.js - Framework web minimalista
- Sequelize - ORM para Node.js
- SQLite - Banco de dados relacional
- Jest - Framework de testes
- Supertest - Testes de API HTTP
- ESLint - Análise estática de código
- Nodemon - Hot reload em desenvolvimento

## Requisitos

- Node.js versão 18.0.0 ou superior
- npm ou yarn

## Instalação

Clone o repositório:

```bash
git clone <url-do-repositorio>
cd api-gerenciamento-beneficios
```

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário.

## Executando a Aplicação

Modo desenvolvimento (com hot reload):

```bash
npm run dev
```

Modo produção:

```bash
npm start
```

A API estará disponível em `http://localhost:3000` (ou na porta configurada no .env).

## Testes

O projeto possui uma suite completa de testes com 200 testes passando e 87% de cobertura:

- **Testes Unitários**: 158 testes (entidades, casos de uso, controllers, validators)
- **Testes de Integração**: 42 testes (banco de dados, repositórios, API completa)

Executar todos os testes:

```bash
npm test
```

Executar testes em modo watch:

```bash
npm run test:watch
```

Gerar relatório de cobertura:

```bash
npm run test:coverage
```

Executar apenas testes unitários:

```bash
npm run test:unit
```

Executar apenas testes de integração:

```bash
npm run test:integration
```

## Documentação da API

### Listar Benefícios

```http
GET /benefits
```

Retorna todos os benefícios cadastrados.

**Resposta de sucesso (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Plano de Saúde",
      "description": "Cobertura completa",
      "isActive": true,
      "createdAt": "2024-01-20T10:00:00.000Z",
      "updatedAt": "2024-01-20T10:00:00.000Z"
    }
  ]
}
```

### Criar Benefício

```http
POST /benefits
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Plano de Saúde",
  "description": "Cobertura completa de saúde"
}
```

**Validações:**
- `name`: obrigatório, entre 3 e 100 caracteres
- `description`: opcional, máximo 255 caracteres

**Resposta de sucesso (201):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Plano de Saúde",
    "description": "Cobertura completa de saúde",
    "isActive": true,
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-20T10:00:00.000Z"
  }
}
```

**Resposta de erro (400):**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": ["Nome deve ter entre 3 e 100 caracteres"]
  }
}
```

### Ativar Benefício

```http
PUT /benefits/:id/activate
```

Ativa um benefício previamente desativado.

**Resposta de sucesso (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Plano de Saúde",
    "isActive": true
  }
}
```

### Desativar Benefício

```http
PUT /benefits/:id/deactivate
```

Desativa um benefício sem removê-lo do sistema.

**Resposta de sucesso (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Plano de Saúde",
    "isActive": false
  }
}
```

### Excluir Benefício

```http
DELETE /benefits/:id
```

Remove permanentemente um benefício do sistema.

**Resposta de sucesso (204):**

Sem conteúdo no corpo da resposta.

**Resposta de erro (404):**

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Benefício não encontrado"
  }
}
```

## Estrutura do Banco de Dados

### Tabela: benefits

| Campo       | Tipo         | Descrição                          |
|-------------|--------------|-------------------------------------|
| id          | INTEGER      | Chave primária, auto incremento     |
| name        | VARCHAR(100) | Nome do benefício (obrigatório)     |
| description | VARCHAR(255) | Descrição do benefício (opcional)   |
| isActive    | BOOLEAN      | Status ativo/inativo (padrão: true) |
| createdAt   | DATETIME     | Data de criação                     |
| updatedAt   | DATETIME     | Data da última atualização          |

## Scripts Disponíveis

| Comando              | Descrição                                    |
|----------------------|----------------------------------------------|
| `npm start`          | Inicia a aplicação em modo produção         |
| `npm run dev`        | Inicia com hot reload (desenvolvimento)     |
| `npm test`           | Executa todos os testes                     |
| `npm run test:watch` | Executa testes em modo watch                |
| `npm run test:coverage` | Gera relatório de cobertura de testes    |
| `npm run lint`       | Verifica problemas de código                |
| `npm run lint:fix`   | Corrige problemas de código automaticamente |

## Padrões de Código

O projeto utiliza ESLint para manter a consistência do código. As principais regras incluem:

- Indentação de 4 espaços
- Aspas simples para strings
- Ponto e vírgula obrigatório
- Sem variáveis não utilizadas
- Nomenclatura camelCase para variáveis e funções

## Estrutura de Commits

Seguimos o padrão de commits semânticos:

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Alterações na documentação
- `test:` Adição ou modificação de testes
- `refactor:` Refatoração de código
- `chore:` Tarefas de manutenção

## Roadmap

- [ ] Implementar autenticação JWT
- [ ] Adicionar paginação nos endpoints de listagem
- [ ] Implementar filtros e ordenação
- [ ] Adicionar documentação Swagger
- [ ] Implementar rate limiting
- [ ] Adicionar logs estruturados
- [ ] Containerização com Docker
- [ ] Pipeline CI/CD

## Contribuindo

Contribuições são bem-vindas. Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

Certifique-se de que os testes estão passando e o código está seguindo os padrões do ESLint.

## Contato

Para dúvidas ou sugestões, abra uma issue no repositório.