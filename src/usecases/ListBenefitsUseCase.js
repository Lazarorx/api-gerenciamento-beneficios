/**
 * Caso de uso para listar benefícios
 * Responsável por buscar e retornar a lista de benefícios do repositório
 */
class ListBenefitsUseCase {
  /**
     * @param {IBenefitRepository} benefitRepository - Repositório de benefícios
     */
  constructor(benefitRepository) {
    this.benefitRepository = benefitRepository;
  }

  /**
     * Executa o caso de uso de listagem de benefícios
     * @param {Object} options - Opções de busca
     * @param {number} options.limit - Limite de resultados
     * @param {number} options.offset - Offset para paginação
     * @param {string} options.orderBy - Campo para ordenação
     * @param {string} options.orderDirection - Direção da ordenação (ASC/DESC)
     * @param {boolean} options.activeOnly - Filtrar apenas benefícios ativos
     * @param {boolean} options.inactiveOnly - Filtrar apenas benefícios inativos
     * @returns {Promise<Array<Benefit>>} Lista de benefícios
     */
  async execute(options = {}) {
    try {
      // Se filtro de ativos for especificado
      if (options.activeOnly) {
        return await this.benefitRepository.findActive(options);
      }

      // Se filtro de inativos for especificado
      if (options.inactiveOnly) {
        return await this.benefitRepository.findInactive(options);
      }

      // Buscar todos os benefícios
      return await this.benefitRepository.findAll(options);
    } catch (error) {
      throw new Error(`Erro ao listar benefícios: ${error.message}`);
    }
  }

  /**
     * Conta o total de benefícios
     * @param {Object} filters - Filtros para contagem
     * @param {boolean} filters.isActive - Filtrar por status ativo/inativo
     * @returns {Promise<number>} Total de benefícios
     */
  async count(filters = {}) {
    try {
      return await this.benefitRepository.count(filters);
    } catch (error) {
      throw new Error(`Erro ao contar benefícios: ${error.message}`);
    }
  }
}

module.exports = ListBenefitsUseCase;
