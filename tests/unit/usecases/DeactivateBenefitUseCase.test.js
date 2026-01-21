const DeactivateBenefitUseCase = require('../../../src/usecases/DeactivateBenefitUseCase');
const Benefit = require('../../../src/entities/Benefit');

describe('DeactivateBenefitUseCase', () => {
    let useCase;
    let mockRepository;

    beforeEach(() => {
        // Mock do repositório
        mockRepository = {
            findById: jest.fn(),
            update: jest.fn()
        };

        useCase = new DeactivateBenefitUseCase(mockRepository);
    });

    describe('execute', () => {
        it('should deactivate an active benefit successfully', async () => {
            // Arrange
            const activeBenefit = new Benefit({
                id: 1,
                name: 'Plano de Saúde',
                description: 'Cobertura completa',
                isActive: true
            });

            const deactivatedBenefit = new Benefit({
                id: 1,
                name: 'Plano de Saúde',
                description: 'Cobertura completa',
                isActive: false
            });

            mockRepository.findById.mockResolvedValue(activeBenefit);
            mockRepository.update.mockResolvedValue(deactivatedBenefit);

            // Act
            const result = await useCase.execute(1);

            // Assert
            expect(mockRepository.findById).toHaveBeenCalledWith(1);
            expect(mockRepository.update).toHaveBeenCalled();
            expect(result.isActive).toBe(false);
        });

        it('should return benefit unchanged if already inactive', async () => {
            // Arrange
            const inactiveBenefit = new Benefit({
                id: 1,
                name: 'Plano de Saúde',
                description: 'Cobertura completa',
                isActive: false
            });

            mockRepository.findById.mockResolvedValue(inactiveBenefit);

            // Act
            const result = await useCase.execute(1);

            // Assert
            expect(mockRepository.findById).toHaveBeenCalledWith(1);
            expect(mockRepository.update).not.toHaveBeenCalled();
            expect(result.isActive).toBe(false);
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
            await expect(useCase.execute(1)).rejects.toThrow('Erro ao desativar benefício: Database error');
        });

        it('should propagate repository errors on update', async () => {
            // Arrange
            const activeBenefit = new Benefit({
                id: 1,
                name: 'Plano de Saúde',
                isActive: true
            });

            mockRepository.findById.mockResolvedValue(activeBenefit);
            mockRepository.update.mockRejectedValue(new Error('Update failed'));

            // Act & Assert
            await expect(useCase.execute(1)).rejects.toThrow('Erro ao desativar benefício: Update failed');
        });

        it('should call deactivate method on benefit entity', async () => {
            // Arrange
            const activeBenefit = new Benefit({
                id: 1,
                name: 'Plano de Saúde',
                isActive: true
            });

            const deactivateSpy = jest.spyOn(activeBenefit, 'deactivate');

            const deactivatedBenefit = new Benefit({
                id: 1,
                name: 'Plano de Saúde',
                isActive: false
            });

            mockRepository.findById.mockResolvedValue(activeBenefit);
            mockRepository.update.mockResolvedValue(deactivatedBenefit);

            // Act
            await useCase.execute(1);

            // Assert
            expect(deactivateSpy).toHaveBeenCalled();
        });
    });
});
