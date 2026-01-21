/**
 * Caso de uso para ativar um benefício
 * Responsável por buscar o benefício e ativá-lo
 */
class ActivateBenefitUseCase {
  /**
     * @param {IBenefitRepository} benefitRepository - Repositório de benefícios
     */
  constructor(benefitRepository) {
    this.benefitRepository = benefitRepository;
  }

  /**
     * Executa o caso de uso de ativação de benefício
     * @param {number} id - ID do benefício a ser ativado
     * @returns {Promise<Benefit>} Benefício ativado
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

      // Verificar se já está ativo
      if (benefit.isActive) {
        return benefit;
      }

      // Ativar benefício
      benefit.activate();

      // Persistir alteração
      const updatedBenefit = await this.benefitRepository.update(id, benefit);

      return updatedBenefit;
    } catch (error) {
      if (error.message === 'Benefício não encontrado') {
        throw error;
      }
      throw new Error(`Erro ao ativar benefício: ${error.message}`);
    }
  }
}

module.exports = ActivateBenefitUseCase;
