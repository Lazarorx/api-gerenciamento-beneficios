const IBenefitRepository = require('./IBenefitRepository');
const Benefit = require('../entities/Benefit');

/**
 * Implementação do repositório de benefícios usando Sequelize
 * Converte entre entidades de domínio (Benefit) e modelos de banco (BenefitModel)
 */
class SequelizeBenefitRepository extends IBenefitRepository {
  /**
     * @param {Model} benefitModel - Modelo Sequelize do Benefit
     * @param {DatabaseManager} databaseManager - Gerenciador do banco de dados
     */
  constructor(benefitModel, databaseManager) {
    super();
    this.benefitModel = benefitModel;
    this.databaseManager = databaseManager;
  }

  /**
     * Converte modelo Sequelize para entidade de domínio
     * @param {Object} modelInstance - Instância do modelo Sequelize
     * @returns {Benefit} Entidade de domínio
     * @private
     */
  _toDomainEntity(modelInstance) {
    if (!modelInstance) {
      return null;
    }

    const data = modelInstance.get({ plain: true });
    return Benefit.fromData({
      id: data.id,
      name: data.name,
      description: data.description,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }

  /**
     * Converte entidade de domínio para dados do modelo
     * @param {Benefit} benefit - Entidade de domínio
     * @returns {Object} Dados para o modelo Sequelize
     * @private
     */
  _toModelData(benefit) {
    return {
      name: benefit.name,
      description: benefit.description,
      isActive: benefit.isActive
    };
  }

  /**
     * Constrói opções de busca para o Sequelize
     * @param {Object} options - Opções de busca
     * @returns {Object} Opções formatadas para o Sequelize
     * @private
     */
  _buildFindOptions(options = {}) {
    const findOptions = {};

    if (options.limit) {
      findOptions.limit = options.limit;
    }

    if (options.offset) {
      findOptions.offset = options.offset;
    }

    if (options.orderBy) {
      const direction = options.orderDirection || 'ASC';
      findOptions.order = [[options.orderBy, direction]];
    } else {
      // Ordenação padrão por nome
      findOptions.order = [['name', 'ASC']];
    }

    return findOptions;
  }

  /**
     * Cria um novo benefício
     * @param {Benefit} benefit - Entidade Benefit a ser criada
     * @returns {Promise<Benefit>} Benefício criado com ID
     */
  async create(benefit) {
    try {
      // Validar entidade antes de persistir
      benefit.validate();

      const modelData = this._toModelData(benefit);
      const createdModel = await this.benefitModel.create(modelData);

      return this._toDomainEntity(createdModel);
    } catch (error) {
      throw new Error(`Erro ao criar benefício: ${error.message}`);
    }
  }

  /**
     * Busca um benefício por ID
     * @param {number} id - ID do benefício
     * @returns {Promise<Benefit|null>} Benefício encontrado ou null
     */
  async findById(id) {
    try {
      const model = await this.benefitModel.findByPk(id);
      return this._toDomainEntity(model);
    } catch (error) {
      throw new Error(`Erro ao buscar benefício por ID: ${error.message}`);
    }
  }

  /**
     * Busca todos os benefícios
     * @param {Object} options - Opções de busca
     * @returns {Promise<Array<Benefit>>} Lista de benefícios
     */
  async findAll(options = {}) {
    try {
      const findOptions = this._buildFindOptions(options);
      const models = await this.benefitModel.findAll(findOptions);

      return models.map(model => this._toDomainEntity(model));
    } catch (error) {
      throw new Error(`Erro ao buscar benefícios: ${error.message}`);
    }
  }

  /**
     * Busca benefícios ativos
     * @param {Object} options - Opções de busca
     * @returns {Promise<Array<Benefit>>} Lista de benefícios ativos
     */
  async findActive(options = {}) {
    try {
      const findOptions = this._buildFindOptions(options);
      findOptions.where = { isActive: true };

      const models = await this.benefitModel.findAll(findOptions);
      return models.map(model => this._toDomainEntity(model));
    } catch (error) {
      throw new Error(`Erro ao buscar benefícios ativos: ${error.message}`);
    }
  }

  /**
     * Busca benefícios inativos
     * @param {Object} options - Opções de busca
     * @returns {Promise<Array<Benefit>>} Lista de benefícios inativos
     */
  async findInactive(options = {}) {
    try {
      const findOptions = this._buildFindOptions(options);
      findOptions.where = { isActive: false };

      const models = await this.benefitModel.findAll(findOptions);
      return models.map(model => this._toDomainEntity(model));
    } catch (error) {
      throw new Error(`Erro ao buscar benefícios inativos: ${error.message}`);
    }
  }

  /**
     * Busca benefícios por nome (busca parcial)
     * @param {string} name - Nome ou parte do nome para buscar
     * @param {Object} options - Opções de busca
     * @returns {Promise<Array<Benefit>>} Lista de benefícios encontrados
     */
  async findByName(name, options = {}) {
    try {
      const { Op } = require('sequelize');
      const findOptions = this._buildFindOptions(options);

      findOptions.where = {
        name: {
          [Op.like]: `%${name}%`
        }
      };

      const models = await this.benefitModel.findAll(findOptions);
      return models.map(model => this._toDomainEntity(model));
    } catch (error) {
      throw new Error(`Erro ao buscar benefícios por nome: ${error.message}`);
    }
  }

  /**
     * Atualiza um benefício existente
     * @param {number} id - ID do benefício a ser atualizado
     * @param {Benefit} benefit - Dados atualizados do benefício
     * @returns {Promise<Benefit|null>} Benefício atualizado ou null se não encontrado
     */
  async update(id, benefit) {
    try {
      // Validar entidade antes de persistir
      benefit.validate();

      const modelData = this._toModelData(benefit);

      const [updatedRowsCount] = await this.benefitModel.update(modelData, {
        where: { id },
        returning: true
      });

      if (updatedRowsCount === 0) {
        return null;
      }

      // Buscar o registro atualizado
      const updatedModel = await this.benefitModel.findByPk(id);
      return this._toDomainEntity(updatedModel);
    } catch (error) {
      throw new Error(`Erro ao atualizar benefício: ${error.message}`);
    }
  }

  /**
     * Remove um benefício
     * @param {number} id - ID do benefício a ser removido
     * @returns {Promise<boolean>} True se removido com sucesso, false se não encontrado
     */
  async delete(id) {
    try {
      const deletedRowsCount = await this.benefitModel.destroy({
        where: { id }
      });

      return deletedRowsCount > 0;
    } catch (error) {
      throw new Error(`Erro ao remover benefício: ${error.message}`);
    }
  }

  /**
     * Conta o total de benefícios
     * @param {Object} filters - Filtros para a contagem
     * @returns {Promise<number>} Número total de benefícios
     */
  async count(filters = {}) {
    try {
      const where = {};

      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      return await this.benefitModel.count({ where });
    } catch (error) {
      throw new Error(`Erro ao contar benefícios: ${error.message}`);
    }
  }

  /**
     * Verifica se existe um benefício com o nome especificado
     * @param {string} name - Nome do benefício
     * @param {number} excludeId - ID a ser excluído da verificação
     * @returns {Promise<boolean>} True se existe, false caso contrário
     */
  async existsByName(name, excludeId = null) {
    try {
      const where = { name };

      if (excludeId) {
        const { Op } = require('sequelize');
        where.id = { [Op.ne]: excludeId };
      }

      const count = await this.benefitModel.count({ where });
      return count > 0;
    } catch (error) {
      throw new Error(`Erro ao verificar existência por nome: ${error.message}`);
    }
  }

  /**
     * Executa operações em uma transação
     * @param {Function} callback - Função a ser executada na transação
     * @returns {Promise<any>} Resultado da transação
     */
  async transaction(callback) {
    try {
      return await this.databaseManager.transaction(callback);
    } catch (error) {
      throw new Error(`Erro na transação: ${error.message}`);
    }
  }
}

module.exports = SequelizeBenefitRepository;
