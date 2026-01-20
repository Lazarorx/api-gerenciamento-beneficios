require('dotenv').config();

/**
 * Configuração do banco de dados para diferentes ambientes
 * Utiliza SQLite para simplicidade e portabilidade
 */
const config = {
  development: {
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || ':memory:',
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },

  test: {
    dialect: 'sqlite',
    storage: process.env.TEST_DB_STORAGE || ':memory:',
    logging: false,
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },

  production: {
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './database.sqlite',
    logging: false,
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true
    },
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000
    }
  }
};

/**
 * Obtém a configuração para o ambiente atual
 * @returns {Object} Configuração do banco de dados
 */
function getDatabaseConfig() {
  const env = process.env.NODE_ENV || 'development';
  return config[env];
}

module.exports = {
  config,
  getDatabaseConfig
};
