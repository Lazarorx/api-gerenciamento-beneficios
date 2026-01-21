const DeleteBenefitUseCase = require('../../../src/usecases/DeleteBenefitUseCase');
const Benefit = require('../../../src/entities/Benefit');

describe('DeleteBenefitUseCase', () => {
    let useCase;
    let mockRepository;

    beforeEach(() => {
        // Mock do repositório
        mockRepository = {
            findById: jest.fn(),
            delete: jest.fn()
        };

        useCase = new DeleteBenefitUseCase(mockRepository);
    });

    describe('execute', () => {
        it('should delete an existing benefit successfully', async () => {
            // Arrange
            const benefit = new Benefit({
                id: 1,
                name: 'Plano de Saúde',
                description: 'Cobertura completa',
                isActive: true
            });

            mockRepository.findById.mockResolvedValue(benefit);
            mockRepository.delete.mockResolvedValue(true);

            // Act
            const result = await useCase.execute(1);

            // Assert
            expect(mockRepository.findById).toHaveBeenCalledWith(1);
            expect(mockRepository.delete).toHaveBeenCalledWith(1);
            expect(result).toBe(true);
        });

        it('should throw error for non-existent benefit', async () => {
            // Arrange
            mockRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(useCase.execute(999)).rejects.toThrow('Benefício não encontrado');
            expect(mockRepository.delete).not.toHaveBeenCalled();
        });

        it('should throw error if delete operation fails', async () => {
            // Arrange
            const benefit = new Benefit({
                id: 1,
                name: 'Plano de Saúde'
            });

            mockRepository.findById.mockResolvedValue(benefit);
            mockRepository.delete.mockResolvedValue(false);

            // Act & Assert
            await expect(useCase.execute(1)).rejects.toThrow('Erro ao excluir benefício: Falha ao excluir benefício');
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
            await expect(useCase.execute(1)).rejects.toThrow('Erro ao excluir benefício: Database error');
        });

        it('should propagate repository errors on delete', async () => {
            // Arrange
            const benefit = new Benefit({
                id: 1,
                name: 'Plano de Saúde'
            });

            mockRepository.findById.mockResolvedValue(benefit);
            mockRepository.delete.mockRejectedValue(new Error('Delete failed'));

            // Act & Assert
            await expect(useCase.execute(1)).rejects.toThrow('Erro ao excluir benefício: Delete failed');
        });

        it('should delete both active and inactive benefits', async () => {
            // Arrange - Benefício inativo
            const inactiveBenefit = new Benefit({
                id: 2,
                name: 'Vale Transporte',
                isActive: false
            });

            mockRepository.findById.mockResolvedValue(inactiveBenefit);
            mockRepository.delete.mockResolvedValue(true);

            // Act
            const result = await useCase.execute(2);

            // Assert
            expect(result).toBe(true);
            expect(mockRepository.delete).toHaveBeenCalledWith(2);
        });
    });
});
