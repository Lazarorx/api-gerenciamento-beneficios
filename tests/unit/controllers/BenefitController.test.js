const BenefitController = require('../../../src/controllers/BenefitController');
const Benefit = require('../../../src/entities/Benefit');

describe('BenefitController', () => {
    let controller;
    let mockCreateUseCase;
    let mockListUseCase;
    let mockActivateUseCase;
    let mockDeactivateUseCase;
    let mockDeleteUseCase;
    let req;
    let res;

    beforeEach(() => {
        // Mock dos casos de uso
        mockCreateUseCase = { execute: jest.fn() };
        mockListUseCase = { execute: jest.fn() };
        mockActivateUseCase = { execute: jest.fn() };
        mockDeactivateUseCase = { execute: jest.fn() };
        mockDeleteUseCase = { execute: jest.fn() };

        controller = new BenefitController(
            mockCreateUseCase,
            mockListUseCase,
            mockActivateUseCase,
            mockDeactivateUseCase,
            mockDeleteUseCase
        );

        // Mock de request e response
        req = {
            body: {},
            params: {},
            query: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        };
    });

    describe('list', () => {
        it('should list all benefits successfully', async () => {
            // Arrange
            const benefits = [
                new Benefit({ id: 1, name: 'Plano de Saúde', isActive: true }),
                new Benefit({ id: 2, name: 'Vale Refeição', isActive: true })
            ];

            mockListUseCase.execute.mockResolvedValue(benefits);

            // Act
            await controller.list(req, res);

            // Assert
            expect(mockListUseCase.execute).toHaveBeenCalledWith({
                limit: undefined,
                offset: undefined,
                orderBy: undefined,
                orderDirection: undefined,
                activeOnly: false,
                inactiveOnly: false
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: benefits.map(b => b.toJSON())
            });
        });

        it('should list benefits with query parameters', async () => {
            // Arrange
            req.query = {
                limit: '10',
                offset: '0',
                orderBy: 'name',
                orderDirection: 'ASC',
                activeOnly: 'true'
            };

            const benefits = [
                new Benefit({ id: 1, name: 'Plano de Saúde', isActive: true })
            ];

            mockListUseCase.execute.mockResolvedValue(benefits);

            // Act
            await controller.list(req, res);

            // Assert
            expect(mockListUseCase.execute).toHaveBeenCalledWith({
                limit: 10,
                offset: 0,
                orderBy: 'name',
                orderDirection: 'ASC',
                activeOnly: true,
                inactiveOnly: false
            });
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 500 on internal error', async () => {
            // Arrange
            mockListUseCase.execute.mockRejectedValue(new Error('Database error'));

            // Act
            await controller.list(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Database error'
                }
            });
        });
    });

    describe('create', () => {
        it('should create a benefit successfully', async () => {
            // Arrange
            req.body = {
                name: 'Plano de Saúde',
                description: 'Cobertura completa',
                isActive: true
            };

            const createdBenefit = new Benefit({
                id: 1,
                name: 'Plano de Saúde',
                description: 'Cobertura completa',
                isActive: true
            });

            mockCreateUseCase.execute.mockResolvedValue(createdBenefit);

            // Act
            await controller.create(req, res);

            // Assert
            expect(mockCreateUseCase.execute).toHaveBeenCalledWith({
                name: 'Plano de Saúde',
                description: 'Cobertura completa',
                isActive: true
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: createdBenefit.toJSON(),
                message: 'Benefício criado com sucesso'
            });
        });

        it('should return 400 for validation error', async () => {
            // Arrange
            req.body = { name: '' };
            mockCreateUseCase.execute.mockRejectedValue(new Error('Nome é obrigatório'));

            // Act
            await controller.create(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Nome é obrigatório'
                }
            });
        });

        it('should return 400 for duplicate name', async () => {
            // Arrange
            req.body = { name: 'Plano de Saúde' };
            mockCreateUseCase.execute.mockRejectedValue(new Error('Já existe um benefício com este nome'));

            // Act
            await controller.create(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Já existe um benefício com este nome'
                }
            });
        });

        it('should return 500 on internal error', async () => {
            // Arrange
            req.body = { name: 'Plano de Saúde' };
            mockCreateUseCase.execute.mockRejectedValue(new Error('Database connection failed'));

            // Act
            await controller.create(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Database connection failed'
                }
            });
        });
    });

    describe('activate', () => {
        it('should activate a benefit successfully', async () => {
            // Arrange
            req.params.id = '1';

            const activatedBenefit = new Benefit({
                id: 1,
                name: 'Plano de Saúde',
                isActive: true
            });

            mockActivateUseCase.execute.mockResolvedValue(activatedBenefit);

            // Act
            await controller.activate(req, res);

            // Assert
            expect(mockActivateUseCase.execute).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: activatedBenefit.toJSON(),
                message: 'Benefício ativado com sucesso'
            });
        });

        it('should return 404 for non-existent benefit', async () => {
            // Arrange
            req.params.id = '999';
            mockActivateUseCase.execute.mockRejectedValue(new Error('Benefício não encontrado'));

            // Act
            await controller.activate(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Benefício não encontrado'
                }
            });
        });

        it('should return 400 for invalid ID', async () => {
            // Arrange
            req.params.id = 'invalid';
            mockActivateUseCase.execute.mockRejectedValue(new Error('ID inválido'));

            // Act
            await controller.activate(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'ID inválido'
                }
            });
        });

        it('should return 500 on internal error', async () => {
            // Arrange
            req.params.id = '1';
            mockActivateUseCase.execute.mockRejectedValue(new Error('Database error'));

            // Act
            await controller.activate(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('deactivate', () => {
        it('should deactivate a benefit successfully', async () => {
            // Arrange
            req.params.id = '1';

            const deactivatedBenefit = new Benefit({
                id: 1,
                name: 'Plano de Saúde',
                isActive: false
            });

            mockDeactivateUseCase.execute.mockResolvedValue(deactivatedBenefit);

            // Act
            await controller.deactivate(req, res);

            // Assert
            expect(mockDeactivateUseCase.execute).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: deactivatedBenefit.toJSON(),
                message: 'Benefício desativado com sucesso'
            });
        });

        it('should return 404 for non-existent benefit', async () => {
            // Arrange
            req.params.id = '999';
            mockDeactivateUseCase.execute.mockRejectedValue(new Error('Benefício não encontrado'));

            // Act
            await controller.deactivate(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should return 400 for invalid ID', async () => {
            // Arrange
            req.params.id = 'invalid';
            mockDeactivateUseCase.execute.mockRejectedValue(new Error('ID inválido'));

            // Act
            await controller.deactivate(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('delete', () => {
        it('should delete a benefit successfully', async () => {
            // Arrange
            req.params.id = '1';
            mockDeleteUseCase.execute.mockResolvedValue(true);

            // Act
            await controller.delete(req, res);

            // Assert
            expect(mockDeleteUseCase.execute).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it('should return 404 for non-existent benefit', async () => {
            // Arrange
            req.params.id = '999';
            mockDeleteUseCase.execute.mockRejectedValue(new Error('Benefício não encontrado'));

            // Act
            await controller.delete(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Benefício não encontrado'
                }
            });
        });

        it('should return 400 for invalid ID', async () => {
            // Arrange
            req.params.id = 'invalid';
            mockDeleteUseCase.execute.mockRejectedValue(new Error('ID inválido'));

            // Act
            await controller.delete(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return 500 on internal error', async () => {
            // Arrange
            req.params.id = '1';
            mockDeleteUseCase.execute.mockRejectedValue(new Error('Database error'));

            // Act
            await controller.delete(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
