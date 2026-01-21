/**
 * Caso de uso para desativar um benefício
 * Responsável por buscar o benefício e desativá-lo
 */
class DeactivateBenefitUseCase {
  /**
     * @param {IBenefitRepository} benefitRepository - Repositório de benefícios
     */
  constructor(benefitRepository) {
    this.benefitRepository = benefitRepository;
  }

  /**
     * Executa o caso de uso de desativação de benefício
     * @param {number} id - ID do benefício a ser desativado
     * @returns {Promise<Benefit>} Benefício desativado
     * @throws {Error} Se o benefício não for encontrado ou houver erro na operação
     */
  async execute(id) {
    // Validar ID
    if (!id || typeof id !== 'number' || id <= 0) {
      throw new Error('ID inválido');
    }

    try {
      // Buscar benefício
      const benefit = await this.benefitRepository.findById(id);

      if (!benefit) {
        throw new Error('Benefício não encontrado');
      }

      // Verificar se já está inativo
      if (!benefit.isActive) {
        return benefit;
      }

      // Desativar benefício
      benefit.deactivate();

      // Persistir alteração
      const updatedBenefit = await this.benefitRepository.update(id, benefit);

      return updatedBenefit;
    } catch (error) {
      if (error.message === 'Benefício não encontrado') {
        throw error;
      }
      throw new Error(`Erro ao desativar benefício: ${error.message}`);
    }
  }
}

module.exports = DeactivateBenefitUseCase;
