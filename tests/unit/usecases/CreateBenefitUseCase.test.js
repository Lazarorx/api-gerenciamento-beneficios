const CreateBenefitUseCase = require('../../../src/usecases/CreateBenefitUseCase');
const Benefit = require('../../../src/entities/Benefit');

describe('CreateBenefitUseCase', () => {
    let useCase;
    let mockRepository;

    beforeEach(() => {
        // Mock do repositório
        mockRepository = {
            create: jest.fn(),
            existsByName: jest.fn()
        };

        useCase = new CreateBenefitUseCase(mockRepository);
    });

    describe('execute', () => {
        it('should create a new benefit successfully', async () => {
            // Arrange
            const input = {
                name: 'Plano de Saúde',
                description: 'Cobertura completa',
                isActive: true
            };

            const createdBenefit = new Benefit({
                id: 1,
                name: input.name,
                description: input.description,
                isActive: input.isActive
            });

            mockRepository.existsByName.mockResolvedValue(false);
            mockRepository.create.mockResolvedValue(createdBenefit);

            // Act
            const result = await useCase.execute(input);

            // Assert
            expect(mockRepository.existsByName).toHaveBeenCalledWith(input.name);
            expect(mockRepository.create).toHaveBeenCalled();
            expect(result).toEqual(createdBenefit);
            expect(result.id).toBe(1);
            expect(result.name).toBe(input.name);
        });

        it('should create benefit with default isActive=true when not provided', async () => {
            // Arrange
            const input = {
                name: 'Vale Refeição',
                description: 'Auxílio alimentação'
            };

            const createdBenefit = new Benefit({
                id: 1,
                name: input.name,
                description: input.description,
                isActive: true
            });

            mockRepository.existsByName.mockResolvedValue(false);
            mockRepository.create.mockResolvedValue(createdBenefit);

            // Act
            const result = await useCase.execute(input);

            // Assert
            expect(result.isActive).toBe(true);
        });

        it('should throw error for invalid input (null)', async () => {
            // Act & Assert
            await expect(useCase.execute(null)).rejects.toThrow('Dados de entrada inválidos');
        });

        it('should throw error for invalid input (not an object)', async () => {
            // Act & Assert
            await expect(useCase.execute('invalid')).rejects.toThrow('Dados de entrada inválidos');
        });

        it('should throw error for missing name', async () => {
            // Arrange
            const input = {
                description: 'Descrição sem nome'
            };

            // Act & Assert
            await expect(useCase.execute(input)).rejects.toThrow('Nome é obrigatório');
        });

        it('should throw error for empty name', async () => {
            // Arrange
            const input = {
                name: '',
                description: 'Descrição'
            };

            // Act & Assert
            await expect(useCase.execute(input)).rejects.toThrow('Nome não pode estar vazio');
        });

        it('should throw error for name too short', async () => {
            // Arrange
            const input = {
                name: 'AB',
                description: 'Descrição'
            };

            // Act & Assert
            await expect(useCase.execute(input)).rejects.toThrow('Nome deve ter pelo menos 3 caracteres');
        });

        it('should throw error for name too long', async () => {
            // Arrange
            const input = {
                name: 'A'.repeat(101),
                description: 'Descrição'
            };

            // Act & Assert
            await expect(useCase.execute(input)).rejects.toThrow('Nome deve ter no máximo 100 caracteres');
        });

        it('should throw error for description too long', async () => {
            // Arrange
            const input = {
                name: 'Plano de Saúde',
                description: 'A'.repeat(256)
            };

            // Act & Assert
            await expect(useCase.execute(input)).rejects.toThrow('Descrição deve ter no máximo 255 caracteres');
        });

        it('should throw error when benefit name already exists', async () => {
            // Arrange
            const input = {
                name: 'Plano de Saúde',
                description: 'Cobertura completa'
            };

            mockRepository.existsByName.mockResolvedValue(true);

            // Act & Assert
            await expect(useCase.execute(input)).rejects.toThrow('Já existe um benefício com este nome');
            expect(mockRepository.create).not.toHaveBeenCalled();
        });

        it('should create benefit without description', async () => {
            // Arrange
            const input = {
                name: 'Vale Transporte'
            };

            const createdBenefit = new Benefit({
                id: 1,
                name: input.name,
                description: '',
                isActive: true
            });

            mockRepository.existsByName.mockResolvedValue(false);
            mockRepository.create.mockResolvedValue(createdBenefit);

            // Act
            const result = await useCase.execute(input);

            // Assert
            expect(result.name).toBe(input.name);
            expect(result.description).toBe('');
        });

        it('should propagate repository errors', async () => {
            // Arrange
            const input = {
                name: 'Plano de Saúde',
                description: 'Cobertura completa'
            };

            mockRepository.existsByName.mockResolvedValue(false);
            mockRepository.create.mockRejectedValue(new Error('Erro ao criar benefício: Database error'));

            // Act & Assert
            await expect(useCase.execute(input)).rejects.toThrow('Erro ao criar benefício: Database error');
        });
    });
});
