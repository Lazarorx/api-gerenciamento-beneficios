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
    async create(benefit) {
        throw new Error('Método create() deve ser implementado');
    }

    /**
     * Busca um benefício por ID
     * @param {number} id - ID do benefício
     * @returns {Promise<Benefit|null>} Benefício encontrado ou null
     * @throws {Error} Se houver erro na busca
     */
    async findById(id) {
        throw new Error('Método findById() deve ser implementado');
    }

    /**
     * Busca todos os benefícios
     * @param {Object} options - Opções de busca
     * @param {number} options.limit - Limite de resultados
     * @param {number} options.offset - Offset para paginação
     * @param {string} options.orderBy - Campo para ordenação
     * @param {string} options.orderDirection - Direção da ordenação (ASC|DESC)
     * @returns {Promise<Array<Benefit>>} Lista de benefícios
     * @throws {Error} Se houver erro na busca
     */
    async findAll(options = {}) {
        throw new Error('Método findAll() deve ser implementado');
    }

    /**
     * Busca benefícios ativos
     * @param {Object} options - Opções de busca
     * @returns {Promise<Array<Benefit>>} Lista de benefícios ativos
     * @throws {Error} Se houver erro na busca
     */
    async findActive(options = {}) {
        throw new Error('Método findActive() deve ser implementado');
    }

    /**
     * Busca benefícios inativos
     * @param {Object} options - Opções de busca
     * @returns {Promise<Array<Benefit>>} Lista de benefícios inativos
     * @throws {Error} Se houver erro na busca
     */
    async findInactive(options = {}) {
        throw new Error('Método findInactive() deve ser implementado');
    }

    /**
     * Busca benefícios por nome (busca parcial)
     * @param {string} name - Nome ou parte do nome para buscar
     * @param {Object} options - Opções de busca
     * @returns {Promise<Array<Benefit>>} Lista de benefícios encontrados
     * @throws {Error} Se houver erro na busca
     */
    async findByName(name, options = {}) {
        throw new Error('Método findByName() deve ser implementado');
    }

    /**
     * Atualiza um benefício existente
     * @param {number} id - ID do benefício a ser atualizado
     * @param {Benefit} benefit - Dados atualizados do benefício
     * @returns {Promise<Benefit|null>} Benefício atualizado ou null se não encontrado
     * @throws {Error} Se houver erro na atualização
     */
    async update(id, benefit) {
        throw new Error('Método update() deve ser implementado');
    }

    /**
     * Remove um benefício
     * @param {number} id - ID do benefício a ser removido
     * @returns {Promise<boolean>} True se removido com sucesso, false se não encontrado
     * @throws {Error} Se houver erro na remoção
     */
    async delete(id) {
        throw new Error('Método delete() deve ser implementado');
    }

    /**
     * Conta o total de benefícios
     * @param {Object} filters - Filtros para a contagem
     * @param {boolean} filters.isActive - Filtrar por status ativo/inativo
     * @returns {Promise<number>} Número total de benefícios
     * @throws {Error} Se houver erro na contagem
     */
    async count(filters = {}) {
        throw new Error('Método count() deve ser implementado');
    }

    /**
     * Verifica se existe um benefício com o nome especificado
     * @param {string} name - Nome do benefício
     * @param {number} excludeId - ID a ser excluído da verificação (para updates)
     * @returns {Promise<boolean>} True se existe, false caso contrário
     * @throws {Error} Se houver erro na verificação
     */
    async existsByName(name, excludeId = null) {
        throw new Error('Método existsByName() deve ser implementado');
    }

    /**
     * Executa operações em uma transação
     * @param {Function} callback - Função a ser executada na transação
     * @returns {Promise<any>} Resultado da transação
     * @throws {Error} Se houver erro na transação
     */
    async transaction(callback) {
        throw new Error('Método transaction() deve ser implementado');
    }
}

module.exports = IBenefitRepository;