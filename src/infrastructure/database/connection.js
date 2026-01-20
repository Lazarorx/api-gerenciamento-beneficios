const { Sequelize } = require('sequelize');
const { getDatabaseConfig } = require('../../config/database');

/**
 * Classe responsável por gerenciar a conexão com o banco de dados
 * Implementa o padrão Singleton para garantir uma única instância
 */
class DatabaseConnection {
  constructor() {
    this.sequelize = null;
    this.isConnected = false;
  }

  /**
     * Inicializa a conexão com o banco de dados
     * @returns {Promise<Sequelize>} Instância do Sequelize
     */
  async initialize() {
    if (this.sequelize) {
      return this.sequelize;
    }

    try {
      const config = getDatabaseConfig();

      this.sequelize = new Sequelize({
        ...config,
        dialectOptions: {
          // Configurações específicas do SQLite
          timeout: 20000
        }
      });

      // Testar a conexão
      await this.sequelize.authenticate();
      this.isConnected = true;

      console.log('✅ Conexão com banco de dados estabelecida com sucesso');
      return this.sequelize;
    } catch (error) {
      console.error('❌ Erro ao conectar com o banco de dados:', error.message);
      throw error;
    }
  }

  /**
     * Obtém a instância do Sequelize
     * @returns {Sequelize|null} Instância do Sequelize ou null se não inicializada
     */
  getInstance() {
    return this.sequelize;
  }

  /**
     * Verifica se a conexão está ativa
     * @returns {boolean} Status da conexão
     */
  isConnectionActive() {
    return this.isConnected && this.sequelize !== null;
  }

  /**
     * Sincroniza os modelos com o banco de dados
     * @param {Object} options - Opções de sincronização
     * @param {boolean} options.force - Se deve recriar as tabelas
     * @param {boolean} options.alter - Se deve alterar as tabelas existentes
     * @returns {Promise<void>}
     */
  async sync(options = {}) {
    if (!this.sequelize) {
      throw new Error('Banco de dados não inicializado. Chame initialize() primeiro.');
    }

    try {
      await this.sequelize.sync(options);
      console.log('✅ Sincronização do banco de dados concluída');
    } catch (error) {
      console.error('❌ Erro na sincronização do banco de dados:', error.message);
      throw error;
    }
  }

  /**
     * Fecha a conexão com o banco de dados
     * @returns {Promise<void>}
     */
  async close() {
    if (this.sequelize) {
      try {
        await this.sequelize.close();
        this.sequelize = null;
        this.isConnected = false;
        console.log('✅ Conexão com banco de dados fechada');
      } catch (error) {
        console.error('❌ Erro ao fechar conexão com banco de dados:', error.message);
        throw error;
      }
    }
  }

  /**
     * Executa uma transação
     * @param {Function} callback - Função a ser executada dentro da transação
     * @returns {Promise<any>} Resultado da transação
     */
  async transaction(callback) {
    if (!this.sequelize) {
      throw new Error('Banco de dados não inicializado');
    }

    return await this.sequelize.transaction(callback);
  }
}

// Instância singleton
const databaseConnection = new DatabaseConnection();

module.exports = databaseConnection;
