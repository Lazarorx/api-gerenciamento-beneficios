const ListBenefitsUseCase = require('../../../src/usecases/ListBenefitsUseCase');
const Benefit = require('../../../src/entities/Benefit');

describe('ListBenefitsUseCase', () => {
    let useCase;
    let mockRepository;

    beforeEach(() => {
        // Mock do repositório
        mockRepository = {
            findAll: jest.fn(),
            findActive: jest.fn(),
            findInactive: jest.fn(),
            count: jest.fn()
        };

        useCase = new ListBenefitsUseCase(mockRepository);
    });

    describe('execute', () => {
        it('should list all benefits', async () => {
            // Arrange
            const benefits = [
                new Benefit({ id: 1, name: 'Plano de Saúde', isActive: true }),
                new Benefit({ id: 2, name: 'Vale Refeição', isActive: true }),
                new Benefit({ id: 3, name: 'Vale Transporte', isActive: false })
            ];

            mockRepository.findAll.mockResolvedValue(benefits);

            // Act
            const result = await useCase.execute();

            // Assert
            expect(mockRepository.findAll).toHaveBeenCalledWith({});
            expect(result).toEqual(benefits);
            expect(result).toHaveLength(3);
        });

        it('should list benefits with pagination options', async () => {
            // Arrange
            const benefits = [
                new Benefit({ id: 2, name: 'Vale Refeição', isActive: true }),
                new Benefit({ id: 3, name: 'Vale Transporte', isActive: false })
            ];

            const options = {
                limit: 2,
                offset: 1
            };

            mockRepository.findAll.mockResolvedValue(benefits);

            // Act
            const result = await useCase.execute(options);

            // Assert
            expect(mockRepository.findAll).toHaveBeenCalledWith(options);
            expect(result).toEqual(benefits);
            expect(result).toHaveLength(2);
        });

        it('should list benefits with ordering options', async () => {
            // Arrange
            const benefits = [
                new Benefit({ id: 3, name: 'Vale Transporte', isActive: false }),
                new Benefit({ id: 2, name: 'Vale Refeição', isActive: true }),
                new Benefit({ id: 1, name: 'Plano de Saúde', isActive: true })
            ];

            const options = {
                orderBy: 'name',
                orderDirection: 'DESC'
            };

            mockRepository.findAll.mockResolvedValue(benefits);

            // Act
            const result = await useCase.execute(options);

            // Assert
            expect(mockRepository.findAll).toHaveBeenCalledWith(options);
            expect(result).toEqual(benefits);
        });

        it('should list only active benefits when activeOnly is true', async () => {
            // Arrange
            const activeBenefits = [
                new Benefit({ id: 1, name: 'Plano de Saúde', isActive: true }),
                new Benefit({ id: 2, name: 'Vale Refeição', isActive: true })
            ];

            const options = { activeOnly: true };

            mockRepository.findActive.mockResolvedValue(activeBenefits);

            // Act
            const result = await useCase.execute(options);

            // Assert
            expect(mockRepository.findActive).toHaveBeenCalledWith(options);
            expect(mockRepository.findAll).not.toHaveBeenCalled();
            expect(result).toEqual(activeBenefits);
            expect(result.every(b => b.isActive)).toBe(true);
        });

        it('should list only inactive benefits when inactiveOnly is true', async () => {
            // Arrange
            const inactiveBenefits = [
                new Benefit({ id: 3, name: 'Vale Transporte', isActive: false }),
                new Benefit({ id: 4, name: 'Plano Odontológico', isActive: false })
            ];

            const options = { inactiveOnly: true };

            mockRepository.findInactive.mockResolvedValue(inactiveBenefits);

            // Act
            const result = await useCase.execute(options);

            // Assert
            expect(mockRepository.findInactive).toHaveBeenCalledWith(options);
            expect(mockRepository.findAll).not.toHaveBeenCalled();
            expect(result).toEqual(inactiveBenefits);
            expect(result.every(b => !b.isActive)).toBe(true);
        });

        it('should return empty array when no benefits exist', async () => {
            // Arrange
            mockRepository.findAll.mockResolvedValue([]);

            // Act
            const result = await useCase.execute();

            // Assert
            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });

        it('should propagate repository errors', async () => {
            // Arrange
            mockRepository.findAll.mockRejectedValue(new Error('Database error'));

            // Act & Assert
            await expect(useCase.execute()).rejects.toThrow('Erro ao listar benefícios: Database error');
        });

        it('should handle complex filtering and pagination', async () => {
            // Arrange
            const benefits = [
                new Benefit({ id: 5, name: 'Benefício 5', isActive: true })
            ];

            const options = {
                activeOnly: true,
                limit: 10,
                offset: 0,
                orderBy: 'createdAt',
                orderDirection: 'DESC'
            };

            mockRepository.findActive.mockResolvedValue(benefits);

            // Act
            const result = await useCase.execute(options);

            // Assert
            expect(mockRepository.findActive).toHaveBeenCalledWith(options);
            expect(result).toEqual(benefits);
        });
    });

    describe('count', () => {
        it('should count all benefits', async () => {
            // Arrange
            mockRepository.count.mockResolvedValue(5);

            // Act
            const result = await useCase.count();

            // Assert
            expect(mockRepository.count).toHaveBeenCalledWith({});
            expect(result).toBe(5);
        });

        it('should count only active benefits', async () => {
            // Arrange
            mockRepository.count.mockResolvedValue(3);

            // Act
            const result = await useCase.count({ isActive: true });

            // Assert
            expect(mockRepository.count).toHaveBeenCalledWith({ isActive: true });
            expect(result).toBe(3);
        });

        it('should count only inactive benefits', async () => {
            // Arrange
            mockRepository.count.mockResolvedValue(2);

            // Act
            const result = await useCase.count({ isActive: false });

            // Assert
            expect(mockRepository.count).toHaveBeenCalledWith({ isActive: false });
            expect(result).toBe(2);
        });

        it('should return zero when no benefits exist', async () => {
            // Arrange
            mockRepository.count.mockResolvedValue(0);

            // Act
            const result = await useCase.count();

            // Assert
            expect(result).toBe(0);
        });

        it('should propagate repository errors on count', async () => {
            // Arrange
            mockRepository.count.mockRejectedValue(new Error('Database error'));

            // Act & Assert
            await expect(useCase.count()).rejects.toThrow('Erro ao contar benefícios: Database error');
        });
    });
});
