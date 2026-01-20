// Setup global para todos os testes
require('dotenv').config({ path: '.env.test' });

// Configurações globais do Jest
global.console = {
  ...console,
  // Desabilitar logs durante os testes, exceto erros
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: console.error
};

// Timeout padrão para testes assíncronos
jest.setTimeout(10000);

// Configurar variáveis de ambiente para testes
process.env.NODE_ENV = 'test';
process.env.DB_STORAGE = ':memory:';
process.env.LOG_LEVEL = 'error';