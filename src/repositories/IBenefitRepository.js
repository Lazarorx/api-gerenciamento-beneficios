/**
 * Interface do repositório de benefícios
 * Define o contrato que deve ser implementado por qualquer repositório de benefícios
 * Seguindo os princípios da Clean Architecture, esta interface pertence à camada de domínio
 */
class IBenefitRepository {
  /**
     * Cria um novo benefício
     * @param {Benefit} benefit - Entidade Benefit a ser criada
     * @returns {Promise<Benefit>} Benefício criado com ID
     * @throws {Error} Se houver erro na criação
     */
  async create(_benefit) {
    throw new Error('Método create() deve ser implementado');
  }

  /**
     * Busca um benefício por ID
     * @param {number} _id - ID do benefício
     * @returns {Promise<Benefit|null>} Benefício encontrado ou null
     * @throws {Error} Se houver erro na busca
     */
  async findById(_id) {
    throw new Error('Método findById() deve ser implementado');
  }

  /**
     * Busca todos os benefícios
     * @param {Object} _options - Opções de busca
     * @param {number} _options.limit - Limite de resultados
     * @param {number} _options.offset - Offset para paginação
     * @param {string} _options.orderBy - Campo para ordenação
     * @param {string} _options.orderDirection - Direção da ordenação (ASC|DESC)
     * @returns {Promise<Array<Benefit>>} Lista de benefícios
     * @throws {Error} Se houver erro na busca
     */
  async findAll(_options = {}) {
    throw new Error('Método findAll() deve ser implementado');
  }

  /**
     * Busca benefícios ativos
     * @param {Object} _options - Opções de busca
     * @returns {Promise<Array<Benefit>>} Lista de benefícios ativos
     * @throws {Error} Se houver erro na busca
     */
  async findActive(_options = {}) {
    throw new Error('Método findActive() deve ser implementado');
  }

  /**
     * Busca benefícios inativos
     * @param {Object} _options - Opções de busca
     * @returns {Promise<Array<Benefit>>} Lista de benefícios inativos
     * @throws {Error} Se houver erro na busca
     */
  async findInactive(_options = {}) {
    throw new Error('Método findInactive() deve ser implementado');
  }

  /**
     * Busca benefícios por nome (busca parcial)
     * @param {string} _name - Nome ou parte do nome para buscar
     * @param {Object} _options - Opções de busca
     * @returns {Promise<Array<Benefit>>} Lista de benefícios encontrados
     * @throws {Error} Se houver erro na busca
     */
  async findByName(_name, _options = {}) {
    throw new Error('Método findByName() deve ser implementado');
  }

  /**
     * Atualiza um benefício existente
     * @param {number} _id - ID do benefício a ser atualizado
     * @param {Benefit} _benefit - Dados atualizados do benefício
     * @returns {Promise<Benefit|null>} Benefício atualizado ou null se não encontrado
     * @throws {Error} Se houver erro na atualização
     */
  async update(_id, _benefit) {
    throw new Error('Método update() deve ser implementado');
  }

  /**
     * Remove um benefício
     * @param {number} _id - ID do benefício a ser removido
     * @returns {Promise<boolean>} True se removido com sucesso, false se não encontrado
     * @throws {Error} Se houver erro na remoção
     */
  async delete(_id) {
    throw new Error('Método delete() deve ser implementado');
  }

  /**
     * Conta o total de benefícios
     * @param {Object} _filters - Filtros para a contagem
     * @param {boolean} _filters.isActive - Filtrar por status ativo/inativo
     * @returns {Promise<number>} Número total de benefícios
     * @throws {Error} Se houver erro na contagem
     */
  async count(_filters = {}) {
    throw new Error('Método count() deve ser implementado');
  }

  /**
     * Verifica se existe um benefício com o nome especificado
     * @param {string} _name - Nome do benefício
     * @param {number} _excludeId - ID a ser excluído da verificação (para updates)
     * @returns {Promise<boolean>} True se existe, false caso contrário
     * @throws {Error} Se houver erro na verificação
     */
  async existsByName(_name, _excludeId = null) {
    throw new Error('Método existsByName() deve ser implementado');
  }

  /**
     * Executa operações em uma transação
     * @param {Function} _callback - Função a ser executada na transação
     * @returns {Promise<any>} Resultado da transação
     * @throws {Error} Se houver erro na transação
     */
  async transaction(_callback) {
    throw new Error('Método transaction() deve ser implementado');
  }
}

module.exports = IBenefitRepository;
