module.exports = {
  // Ambiente de teste
  testEnvironment: 'node',

  // Padrões de arquivos de teste
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js',
    '**/__tests__/**/*.js',
    '**/src/**/*.test.js'
  ],

  // Diretórios a serem ignorados
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/dist/'
  ],

  // Configuração de cobertura
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
    '!src/**/index.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'text-summary',
    'lcov',
    'html'
  ],

  // Limite mínimo de cobertura
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Setup de testes
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Transformações
  transform: {},

  // Verbose output
  verbose: true,

  // Limpar mocks automaticamente
  clearMocks: true,

  // Restaurar mocks automaticamente
  restoreMocks: true,

  // Timeout para testes
  testTimeout: 10000,

  // Configurações específicas para diferentes tipos de teste
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/tests/unit/**/*.test.js'],
      testEnvironment: 'node'
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/tests/integration/**/*.test.js'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/tests/integration/setup.js']
    }
  ],

  // Configuração para watch mode
  watchman: false,
  watchPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/.git/'
  ]
};