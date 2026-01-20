# Design - API de Gerenciamento de Benefícios

## 1. Arquitetura Geral

### 1.1 Clean Architecture
A aplicação seguirá os princípios da Clean Architecture com as seguintes camadas:

```
src/
├── controllers/     # Camada de Interface (HTTP handlers)
├── usecases/       # Camada de Casos de Uso (regras de negócio)
├── entities/       # Camada de Entidades (modelos de domínio)
├── repositories/   # Camada de Interface de Dados
├── infrastructure/ # Camada de Infraestrutura (banco, web server)
├── config/         # Configurações
└── tests/          # Testes organizados por camada
```

### 1.2 Fluxo de Dados
```
HTTP Request → Controller → UseCase → Repository → Database
HTTP Response ← Controller ← UseCase ← Repository ← Database
```

## 2. Estrutura do Projeto

```
api-gerenciamento-beneficios/
├── src/
│   ├── controllers/
│   │   └── BenefitController.js
│   ├── usecases/
│   │   ├── CreateBenefitUseCase.js
│   │   ├── ListBenefitsUseCase.js
│   │   ├── ActivateBenefitUseCase.js
│   │   ├── DeactivateBenefitUseCase.js
│   │   └── DeleteBenefitUseCase.js
│   ├── entities/
│   │   └── Benefit.js
│   ├── repositories/
│   │   ├── IBenefitRepository.js (interface)
│   │   └── SequelizeBenefitRepository.js
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── connection.js
│   │   │   └── models/
│   │   │       └── BenefitModel.js
│   │   └── web/
│   │       ├── server.js
│   │       └── routes/
│   │           └── benefitRoutes.js
│   ├── config/
│   │   └── database.js
│   └── validators/
│       └── BenefitValidator.js
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 3. Detalhamento das Camadas

### 3.1 Entidades (Domain Layer)

#### Benefit Entity
```javascript
class Benefit {
  constructor(id, name, description, isActive = true) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.isActive = isActive;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  activate() {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  deactivate() {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  isValid() {
    return this.name && 
           this.name.length >= 3 && 
           this.name.length <= 100 &&
           (!this.description || this.description.length <= 255);
  }
}
```

### 3.2 Casos de Uso (Use Cases Layer)

#### CreateBenefitUseCase
- Valida dados de entrada
- Cria nova instância de Benefit
- Persiste no repositório
- Retorna benefício criado

#### ListBenefitsUseCase
- Busca todos os benefícios no repositório
- Retorna lista formatada

#### ActivateBenefitUseCase
- Busca benefício por ID
- Ativa o benefício
- Persiste alteração
- Retorna benefício atualizado

#### DeactivateBenefitUseCase
- Busca benefício por ID
- Desativa o benefício
- Persiste alteração
- Retorna benefício atualizado

#### DeleteBenefitUseCase
- Busca benefício por ID
- Remove do repositório
- Confirma exclusão

### 3.3 Repositórios (Interface Layer)

#### IBenefitRepository (Interface)
```javascript
class IBenefitRepository {
  async create(benefit) { throw new Error('Not implemented'); }
  async findAll() { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
  async update(id, benefit) { throw new Error('Not implemented'); }
  async delete(id) { throw new Error('Not implemented'); }
}
```

#### SequelizeBenefitRepository (Implementação)
- Implementa IBenefitRepository
- Usa Sequelize para operações de banco
- Converte entre modelos Sequelize e entidades de domínio

### 3.4 Controllers (Interface Layer)

#### BenefitController
```javascript
class BenefitController {
  constructor(createUseCase, listUseCase, activateUseCase, deactivateUseCase, deleteUseCase) {
    this.createUseCase = createUseCase;
    this.listUseCase = listUseCase;
    this.activateUseCase = activateUseCase;
    this.deactivateUseCase = deactivateUseCase;
    this.deleteUseCase = deleteUseCase;
  }

  async create(req, res) { /* implementação */ }
  async list(req, res) { /* implementação */ }
  async activate(req, res) { /* implementação */ }
  async deactivate(req, res) { /* implementação */ }
  async delete(req, res) { /* implementação */ }
}
```

## 4. Configuração do Banco de Dados

### 4.1 Sequelize Setup
```javascript
// config/database.js
module.exports = {
  development: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  },
  production: {
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
  }
};
```

### 4.2 Modelo Sequelize
```javascript
// infrastructure/database/models/BenefitModel.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Benefit', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100]
      }
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        len: [0, 255]
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });
};
```

## 5. Rotas e Endpoints

### 5.1 Definição das Rotas
```javascript
// infrastructure/web/routes/benefitRoutes.js
const express = require('express');
const router = express.Router();

router.get('/benefits', benefitController.list.bind(benefitController));
router.post('/benefits', benefitController.create.bind(benefitController));
router.put('/benefits/:id/activate', benefitController.activate.bind(benefitController));
router.put('/benefits/:id/deactivate', benefitController.deactivate.bind(benefitController));
router.delete('/benefits/:id', benefitController.delete.bind(benefitController));

module.exports = router;
```

### 5.2 Respostas Padronizadas

#### Sucesso
```json
{
  "success": true,
  "data": { /* dados do benefício */ },
  "message": "Operação realizada com sucesso"
}
```

#### Erro
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": ["Nome é obrigatório"]
  }
}
```

## 6. Validações

### 6.1 BenefitValidator
```javascript
class BenefitValidator {
  static validateCreate(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length === 0) {
      errors.push('Nome é obrigatório');
    }
    
    if (data.name && (data.name.length < 3 || data.name.length > 100)) {
      errors.push('Nome deve ter entre 3 e 100 caracteres');
    }
    
    if (data.description && data.description.length > 255) {
      errors.push('Descrição deve ter no máximo 255 caracteres');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
```

## 7. Tratamento de Erros

### 7.1 Middleware de Erro Global
```javascript
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Dados inválidos',
        details: err.errors
      }
    });
  }
  
  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Recurso não encontrado'
      }
    });
  }
  
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Erro interno do servidor'
    }
  });
};
```

## 8. Injeção de Dependência

### 8.1 Container de Dependências
```javascript
// config/container.js
class Container {
  constructor() {
    this.dependencies = new Map();
  }
  
  register(name, factory) {
    this.dependencies.set(name, factory);
  }
  
  resolve(name) {
    const factory = this.dependencies.get(name);
    if (!factory) {
      throw new Error(`Dependency ${name} not found`);
    }
    return factory();
  }
}
```

## 9. Testes

### 9.1 Estratégia de Testes
- **Testes Unitários**: Casos de uso, entidades, validadores
- **Testes de Integração**: Controllers, repositórios
- **Testes E2E**: Endpoints completos

### 9.2 Framework de Testes
- Jest para testes unitários
- Supertest para testes de API
- Banco em memória para testes

### 9.3 Estrutura de Testes
```javascript
// tests/unit/usecases/CreateBenefitUseCase.test.js
describe('CreateBenefitUseCase', () => {
  let useCase;
  let mockRepository;
  
  beforeEach(() => {
    mockRepository = {
      create: jest.fn()
    };
    useCase = new CreateBenefitUseCase(mockRepository);
  });
  
  it('should create a benefit with valid data', async () => {
    // teste implementation
  });
  
  it('should throw error with invalid data', async () => {
    // teste implementation
  });
});
```

## 10. Configuração do Ambiente

### 10.1 Variáveis de Ambiente
```
NODE_ENV=development
PORT=3000
DB_STORAGE=:memory:
LOG_LEVEL=info
```

### 10.2 Scripts do Package.json
```json
{
  "scripts": {
    "start": "node src/infrastructure/web/server.js",
    "dev": "nodemon src/infrastructure/web/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix"
  }
}
```

## 11. Extensões Opcionais

### 11.1 Paginação
```javascript
// Adicionar ao ListBenefitsUseCase
async execute(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  return await this.repository.findAll({ offset, limit });
}
```

### 11.2 Swagger Documentation
```javascript
// Adicionar swagger-jsdoc e swagger-ui-express
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gerenciamento de Benefícios',
      version: '1.0.0'
    }
  },
  apis: ['./src/infrastructure/web/routes/*.js']
};
```

### 11.3 Métricas
```javascript
// Adicionar prometheus client
const promClient = require('prom-client');
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});
```

Este design fornece uma base sólida para implementar a API seguindo os princípios da Clean Architecture, com código limpo e bem testado.