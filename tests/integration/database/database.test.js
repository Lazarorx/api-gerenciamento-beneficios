const databaseManager = require('../../../src/infrastructure/database');
const databaseConnection = require('../../../src/infrastructure/database/connection');

describe('Database Integration', () => {
    beforeAll(async () => {
        // Configurar ambiente de teste
        process.env.NODE_ENV = 'test';
        process.env.DB_STORAGE = ':memory:';
    });

    afterAll(async () => {
        // Fechar conexão após todos os testes
        await databaseManager.close();
    });

    describe('Database Connection', () => {
        it('should initialize database connection successfully', async () => {
            const sequelize = await databaseConnection.initialize();

            expect(sequelize).toBeDefined();
            expect(databaseConnection.isConnectionActive()).toBe(true);
        });

        it('should return existing connection on subsequent calls', async () => {
            const sequelize1 = await databaseConnection.initialize();
            const sequelize2 = await databaseConnection.initialize();

            expect(sequelize1).toBe(sequelize2);
        });
    });

    describe('Database Manager', () => {
        it('should initialize database manager with models', async () => {
            const { sequelize, models } = await databaseManager.initialize();

            expect(sequelize).toBeDefined();
            expect(models).toBeDefined();
            expect(models.Benefit).toBeDefined();
            expect(databaseManager.isReady()).toBe(true);
        });

        it('should get model by name', async () => {
            await databaseManager.initialize();

            const BenefitModel = databaseManager.getModel('Benefit');
            expect(BenefitModel).toBeDefined();
            expect(BenefitModel.name).toBe('Benefit');
        });

        it('should throw error for non-existent model', async () => {
            await databaseManager.initialize();

            expect(() => {
                databaseManager.getModel('NonExistentModel');
            }).toThrow('Modelo \'NonExistentModel\' não encontrado');
        });

        it('should get all models', async () => {
            await databaseManager.initialize();

            const models = databaseManager.getModels();
            expect(models).toBeDefined();
            expect(models.Benefit).toBeDefined();
        });

        it('should sync models successfully', async () => {
            await databaseManager.initialize();

            await expect(databaseManager.syncModels({ force: true })).resolves.not.toThrow();
        });
    });

    describe('Benefit Model', () => {
        beforeEach(async () => {
            await databaseManager.initialize({ force: true });
        });

        it('should create a benefit successfully', async () => {
            const BenefitModel = databaseManager.getModel('Benefit');

            const benefitData = {
                name: 'Plano de Saúde',
                description: 'Cobertura médica completa',
                isActive: true
            };

            const benefit = await BenefitModel.create(benefitData);

            expect(benefit.id).toBeDefined();
            expect(benefit.name).toBe('Plano de Saúde');
            expect(benefit.description).toBe('Cobertura médica completa');
            expect(benefit.isActive).toBe(true);
            expect(benefit.createdAt).toBeInstanceOf(Date);
            expect(benefit.updatedAt).toBeInstanceOf(Date);
        });

        it('should validate required fields', async () => {
            const BenefitModel = databaseManager.getModel('Benefit');

            await expect(BenefitModel.create({})).rejects.toThrow();
            await expect(BenefitModel.create({ name: '' })).rejects.toThrow();
            await expect(BenefitModel.create({ name: 'AB' })).rejects.toThrow();
        });

        it('should validate field lengths', async () => {
            const BenefitModel = databaseManager.getModel('Benefit');

            const longName = 'A'.repeat(101);
            const longDescription = 'A'.repeat(256);

            await expect(BenefitModel.create({
                name: longName
            })).rejects.toThrow();

            await expect(BenefitModel.create({
                name: 'Valid Name',
                description: longDescription
            })).rejects.toThrow();
        });

        it('should set default values correctly', async () => {
            const BenefitModel = databaseManager.getModel('Benefit');

            const benefit = await BenefitModel.create({
                name: 'Vale Refeição'
            });

            expect(benefit.isActive).toBe(true);
            expect(benefit.description == null).toBe(true); // aceita null ou undefined
        });

        it('should trim whitespace from fields', async () => {
            const BenefitModel = databaseManager.getModel('Benefit');

            const benefit = await BenefitModel.create({
                name: '  Plano de Saúde  ',
                description: '  Cobertura completa  '
            });

            expect(benefit.name).toBe('Plano de Saúde');
            expect(benefit.description).toBe('Cobertura completa');
        });

        it('should find benefits by status', async () => {
            const BenefitModel = databaseManager.getModel('Benefit');

            // Criar benefícios de teste
            await BenefitModel.create({ name: 'Ativo 1', isActive: true });
            await BenefitModel.create({ name: 'Ativo 2', isActive: true });
            await BenefitModel.create({ name: 'Inativo 1', isActive: false });

            const activeBenefits = await BenefitModel.findAll({
                where: { isActive: true }
            });

            const inactiveBenefits = await BenefitModel.findAll({
                where: { isActive: false }
            });

            expect(activeBenefits).toHaveLength(2);
            expect(inactiveBenefits).toHaveLength(1);
        });
    });

    describe('Database Utilities', () => {
        beforeEach(async () => {
            await databaseManager.initialize({ force: true });
        });

        it('should clear all data successfully', async () => {
            const BenefitModel = databaseManager.getModel('Benefit');

            // Criar alguns benefícios
            await BenefitModel.create({ name: 'Benefit 1' });
            await BenefitModel.create({ name: 'Benefit 2' });

            let count = await BenefitModel.count();
            expect(count).toBe(2);

            // Limpar dados
            await databaseManager.clearAllData();

            count = await BenefitModel.count();
            expect(count).toBe(0);
        });

        it('should seed data successfully', async () => {
            const BenefitModel = databaseManager.getModel('Benefit');

            await databaseManager.seedData();

            const count = await BenefitModel.count();
            expect(count).toBeGreaterThan(0);

            const benefits = await BenefitModel.findAll();
            expect(benefits.some(b => b.name === 'Plano de Saúde')).toBe(true);
        });

        it('should execute transactions successfully', async () => {
            const BenefitModel = databaseManager.getModel('Benefit');

            await databaseManager.transaction(async (t) => {
                await BenefitModel.create({
                    name: 'Transactional Benefit',
                    description: 'Created in transaction'
                }, { transaction: t });

                const count = await BenefitModel.count({ transaction: t });
                expect(count).toBe(1);
            });

            const finalCount = await BenefitModel.count();
            expect(finalCount).toBe(1);
        });

        it('should rollback failed transactions', async () => {
            const BenefitModel = databaseManager.getModel('Benefit');

            try {
                await databaseManager.transaction(async (t) => {
                    await BenefitModel.create({
                        name: 'Valid Benefit'
                    }, { transaction: t });

                    // Forçar erro
                    throw new Error('Simulated error');
                });
            } catch (error) {
                expect(error.message).toBe('Simulated error');
            }

            const count = await BenefitModel.count();
            expect(count).toBe(0);
        });
    });
});