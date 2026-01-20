const Benefit = require('../entities/Benefit');

/**
 * Caso de uso para criar um novo benefício
 * Responsável por validar os dados e persistir no repositório
 */
class CreateBenefitUseCase {
    /**
     * @param {IBenefitRepository} benefitRepository - Repositório de benefícios
     */
    constructor(benefitRepository) {
        this.benefitRepository = benefitRepository;
    }

    /**
     * Executa o caso de uso de criação de benefício
     * @param {Object} input - Dados do benefício a ser criado
     * @param {string} input.name - Nome do benefício (obrigatório, 3-100 caracteres)
     * @param {string} input.description - Descrição do benefício (opcional, máx 255 caracteres)
     * @param {boolean} input.isActive - Status do benefício (opcional, padrão: true)
     * @returns {Promise<Benefit>} Benefício criado com ID
     * @throws {Error} Se os dados forem inválidos
     */
    async execute(input) {
        // Validar entrada
        if (!input || typeof input !== 'object') {
            throw new Error('Dados de entrada inválidos');
        }

        // Criar entidade de domínio
        const benefit = new Benefit({
            id: null, // ID será gerado pelo banco
            name: input.name,
            description: input.description,
            isActive: input.isActive !== undefined ? input.isActive : true
        });

        // Validar entidade
        benefit.validate();

        // Verificar se já existe benefício com o mesmo nome
        const existingBenefit = await this.benefitRepository.existsByName(benefit.name);
        if (existingBenefit) {
            throw new Error('Já existe um benefício com este nome');
        }

        // Persistir no repositório
        const createdBenefit = await this.benefitRepository.create(benefit);

        return createdBenefit;
    }
}

module.exports = CreateBenefitUseCase;
