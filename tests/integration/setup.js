// Setup específico para testes de integração
const path = require('path');

// Configurar banco de dados de teste
process.env.DB_STORAGE = ':memory:';
process.env.NODE_ENV = 'test';

// Helper para limpar banco entre testes
global.cleanDatabase = async(sequelize) => {
  if (sequelize) {
    await sequelize.sync({ force: true });
  }
};

// Helper para criar dados de teste
global.createTestBenefit = (overrides = {}) => {
  return {
    name: 'Benefício Teste',
    description: 'Descrição do benefício de teste',
    isActive: true,
    ...overrides
  };
};