/**
 * Caso de uso para excluir um benefício
 * Responsável por buscar e remover o benefício do sistema
 */
class DeleteBenefitUseCase {
  /**
     * @param {IBenefitRepository} benefitRepository - Repositório de benefícios
     */
  constructor(benefitRepository) {
    this.benefitRepository = benefitRepository;
  }

  /**
     * Executa o caso de uso de exclusão de benefício
     * @param {number} id - ID do benefício a ser excluído
     * @returns {Promise<boolean>} True se excluído com sucesso
     * @throws {Error} Se o benefício não for encontrado ou houver erro na operação
     */
  async execute(id) {
    // Validar ID
    if (!id || typeof id !== 'number' || id <= 0) {
      throw new Error('ID inválido');
    }

    try {
      // Verificar se o benefício existe
      const benefit = await this.benefitRepository.findById(id);

      if (!benefit) {
        throw new Error('Benefício não encontrado');
      }

      // Excluir benefício
      const deleted = await this.benefitRepository.delete(id);

      if (!deleted) {
        throw new Error('Falha ao excluir benefício');
      }

      return true;
    } catch (error) {
      if (error.message === 'Benefício não encontrado') {
        throw error;
      }
      throw new Error(`Erro ao excluir benefício: ${error.message}`);
    }
  }
}

module.exports = DeleteBenefitUseCase;
