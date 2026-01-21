const ActivateBenefitUseCase = require('../../../src/usecases/ActivateBenefitUseCase');
const Benefit = require('../../../src/entities/Benefit');

describe('ActivateBenefitUseCase', () => {
    let useCase;
    let mockRepository;

    beforeEach(() => {
        // Mock do repositório
        mockRepository = {
            findById: jest.fn(),
            update: jest.fn()
        };

        useCase = new ActivateBenefitUseCase(mockRepository);
    });

    describe('execute', () => {
        it('should activate an inactive benefit successfully', async () => {
            // Arrange
            const inactiveBenefit = new Benefit({
                id: 1,
                name: 'Plano de Saúde',
                description: 'Cobertura completa',
                isActive: false
            });

            const activatedBenefit = new Benefit({
                id: 1,
                name: 'Plano de Saúde',
                description: 'Cobertura completa',
                isActive: true
            });

            mockRepository.findById.mockResolvedValue(inactiveBenefit);
            mockRepository.update.mockResolvedValue(activatedBenefit);

            // Act
            const result = await useCase.execute(1);

            // Assert
            expect(mockRepository.findById).toHaveBeenCalledWith(1);
            expect(mockRepository.update).toHaveBeenCalled();
            expect(result.isActive).toBe(true);
        });

        it('should return benefit unchanged if already active', async () => {
            // Arrange
            const activeBenefit = new Benefit({
                id: 1,
                name: 'Plano de Saúde',
                description: 'Cobertura completa',
                isActive: true
            });

            mockRepository.findById.mockResolvedValue(activeBenefit);

            // Act
            const result = await useCase.execute(1);

            // Assert
            expect(mockRepository.findById).toHaveBeenCalledWith(1);
            expect(mockRepository.update).not.toHaveBeenCalled();
            expect(result.isActive).toBe(true);
        });

        it('should throw error for non-existent benefit', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(useCase.execute(999)).rejects.toThrow('Benefício não encontrado');
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should throw error for invalid ID (null)', async () => {
            // Act & Assert
            await expect(useCase.execute(null)).rejects.toThrow('ID inválido');
            expect(mockRepository.findById).not.toHaveBeenCalled();
        });

        it('should throw error for invalid ID (undefined)', async () => {
            // Act & Assert
            await expect(useCase.execute(undefined)).rejects.toThrow('ID inválido');
            expect(mockRepository.findById).not.toHaveBeenCalled();
        });

        it('should throw error for invalid ID (zero)', async () => {
            // Act & Assert
            await expect(useCase.execute(0)).rejects.toThrow('ID inválido');
            expect(mockRepository.findById).not.toHaveBeenCalled();
        });

        it('should throw error for invalid ID (negative)', async () => {
            // Act & Assert
            await expect(useCase.execute(-1)).rejects.toThrow('ID inválido');
            expect(mockRepository.findById).not.toHaveBeenCalled();
        });

        it('should throw error for invalid ID (string)', async () => {
            // Act & Assert
            await expect(useCase.execute('invalid')).rejects.toThrow('ID inválido');
            expect(mockRepository.findById).not.toHaveBeenCalled();
        });

        it('should propagate repository errors on findById', async () => {
            // Arrange
            mockRepository.findById.mockRejectedValue(new Error('Database error'));

            // Act & Assert
            await expect(useCase.execute(1)).rejects.toThrow('Erro ao ativar benefício: Database error');
        });

        it('should propagate repository errors on update', async () => {
            // Arrange
            const inactiveBenefit = new Benefit({
                id: 1,
                name: 'Plano de Saúde',
                isActive: false
            });

            mockRepository.findById.mockResolvedValue(inactiveBenefit);
            mockRepository.update.mockRejectedValue(new Error('Update failed'));

            // Act & Assert
            await expect(useCase.execute(1)).rejects.toThrow('Erro ao ativar benefício: Update failed');
        });

        it('should call activate method on benefit entity', async () => {
            // Arrange
            const inactiveBenefit = new Benefit({
                id: 1,
                name: 'Plano de Saúde',
                isActive: false
            });

            const activateSpy = jest.spyOn(inactiveBenefit, 'activate');

            const activatedBenefit = new Benefit({
                id: 1,
                name: 'Plano de Saúde',
                isActive: true
            });

            mockRepository.findById.mockResolvedValue(inactiveBenefit);
            mockRepository.update.mockResolvedValue(activatedBenefit);

            // Act
            await useCase.execute(1);

            // Assert
            expect(activateSpy).toHaveBeenCalled();
        });
    });
});
