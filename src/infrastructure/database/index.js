const databaseConnection = require('./connection');
const defineBenefitModel = require('./models/BenefitModel');

/**
 * Classe responsável por inicializar e gerenciar todos os modelos do banco de dados
 * Centraliza a configuração e relacionamentos entre modelos
 */
class DatabaseManager {
  constructor() {
    this.sequelize = null;
    this.models = {};
    this.isInitialized = false;
  }

  /**
     * Inicializa o banco de dados e todos os modelos
     * @param {Object} options - Opções de inicialização
     * @param {boolean} options.sync - Se deve sincronizar os modelos
     * @param {boolean} options.force - Se deve recriar as tabelas
     * @returns {Promise<Object>} Objeto com sequelize e models
     */
  async initialize(options = {}) {
    try {
      // Inicializar conexão
      this.sequelize = await databaseConnection.initialize();

      // Definir modelos
      this.models.Benefit = defineBenefitModel(this.sequelize);

      // Configurar associações (quando houver outros modelos)
      this._setupAssociations();

      // Sincronizar modelos se solicitado
      if (options.sync !== false) {
        await this.syncModels({
          force: options.force || false,
          alter: options.alter || false
        });
      }

      this.isInitialized = true;
      console.log('✅ Database Manager inicializado com sucesso');

      return {
        sequelize: this.sequelize,
        models: this.models
      };
    } catch (error) {
      console.error('❌ Erro ao inicializar Database Manager:', error.message);
      throw error;
    }
  }

  /**
     * Configura as associações entre modelos
     * @private
     */
  _setupAssociations() {
    // Aqui serão definidas as associações quando houver outros modelos
    // Exemplo:
    // this.models.User.hasMany(this.models.Benefit);
    // this.models.Benefit.belongsTo(this.models.User);

    console.log('📋 Associações entre modelos configuradas');
  }

  /**
     * Sincroniza todos os modelos com o banco de dados
     * @param {Object} options - Opções de sincronização
     * @returns {Promise<void>}
     */
  async syncModels(options = {}) {
    if (!this.sequelize) {
      throw new Error('Database Manager não inicializado');
    }

    try {
      await databaseConnection.sync(options);

      if (options.force) {
        console.log('🔄 Tabelas recriadas com sucesso');
      } else {
        console.log('✅ Modelos sincronizados com sucesso');
      }
    } catch (error) {
      console.error('❌ Erro na sincronização dos modelos:', error.message);
      throw error;
    }
  }

  /**
     * Obtém um modelo específico
     * @param {string} modelName - Nome do modelo
     * @returns {Model} Modelo do Sequelize
     */
  getModel(modelName) {
    if (!this.isInitialized) {
      throw new Error('Database Manager não inicializado');
    }

    const model = this.models[modelName];
    if (!model) {
      throw new Error(`Modelo '${modelName}' não encontrado`);
    }

    return model;
  }

  /**
     * Obtém todos os modelos
     * @returns {Object} Objeto com todos os modelos
     */
  getModels() {
    if (!this.isInitialized) {
      throw new Error('Database Manager não inicializado');
    }

    return this.models;
  }

  /**
     * Obtém a instância do Sequelize
     * @returns {Sequelize} Instância do Sequelize
     */
  getSequelize() {
    return this.sequelize;
  }

  /**
     * Verifica se o Database Manager está inicializado
     * @returns {boolean} Status de inicialização
     */
  isReady() {
    return this.isInitialized && databaseConnection.isConnectionActive();
  }

  /**
     * Executa uma transação
     * @param {Function} callback - Função a ser executada na transação
     * @returns {Promise<any>} Resultado da transação
     */
  async transaction(callback) {
    return await databaseConnection.transaction(callback);
  }

  /**
     * Fecha a conexão com o banco de dados
     * @returns {Promise<void>}
     */
  async close() {
    try {
      await databaseConnection.close();
      this.sequelize = null;
      this.models = {};
      this.isInitialized = false;
      console.log('✅ Database Manager fechado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao fechar Database Manager:', error.message);
      throw error;
    }
  }

  /**
     * Limpa todos os dados das tabelas (útil para testes)
     * @returns {Promise<void>}
     */
  async clearAllData() {
    if (!this.isInitialized) {
      throw new Error('Database Manager não inicializado');
    }

    try {
      // Limpar dados de todas as tabelas
      await this.models.Benefit.destroy({ where: {}, truncate: true });

      console.log('🧹 Todos os dados foram limpos do banco');
    } catch (error) {
      console.error('❌ Erro ao limpar dados do banco:', error.message);
      throw error;
    }
  }

  /**
     * Cria dados de exemplo para desenvolvimento/testes
     * @returns {Promise<void>}
     */
  async seedData() {
    if (!this.isInitialized) {
      throw new Error('Database Manager não inicializado');
    }

    try {
      const benefitsData = [
        {
          name: 'Plano de Saúde',
          description: 'Cobertura médica completa para funcionários',
          isActive: true
        },
        {
          name: 'Vale Refeição',
          description: 'Auxílio alimentação mensal',
          isActive: true
        },
        {
          name: 'Vale Transporte',
          description: 'Auxílio para transporte público',
          isActive: true
        },
        {
          name: 'Seguro de Vida',
          description: 'Proteção para a família do funcionário',
          isActive: false
        }
      ];

      await this.models.Benefit.bulkCreate(benefitsData);
      console.log('🌱 Dados de exemplo criados com sucesso');
    } catch (error) {
      console.error('❌ Erro ao criar dados de exemplo:', error.message);
      throw error;
    }
  }
}

// Instância singleton
const databaseManager = new DatabaseManager();

module.exports = databaseManager;
