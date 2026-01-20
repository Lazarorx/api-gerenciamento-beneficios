const SequelizeBenefitRepository = require('../../../src/repositories/SequelizeBenefitRepository');
const Benefit = require('../../../src/entities/Benefit');
const databaseManager = require('../../../src/infrastructure/database');

describe('SequelizeBenefitRepository Integration Tests', () => {
    let repository;
    let benefitModel;

    beforeAll(async () => {
        // Configurar ambiente de teste
        process.env.NODE_ENV = 'test';
        process.env.DB_STORAGE = ':memory:';

        // Inicializar banco de dados
        await databaseManager.initialize({ force: true });
        benefitModel = databaseManager.getModel('Benefit');

        // Criar instância do repositório
        repository = new SequelizeBenefitRepository(benefitModel, databaseManager);
    });

    beforeEach(async () => {
        // Limpar dados antes de cada teste
        await databaseManager.clearAllData();
    });

    afterAll(async () => {
        // Fechar conexão após todos os testes
        await databaseManager.close();
    });

    describe('create', () => {
        it('should create a new benefit successfully', async () => {
            const benefit = new Benefit({
                id: null,
                name: 'Plano de Saúde',
                description: 'Cobertura médica completa',
                isActive: true
            });

            const createdBenefit = await repository.create(benefit);

            expect(createdBenefit).toBeInstanceOf(Benefit);
            expect(createdBenefit.id).toBeDefined();
            expect(createdBenefit.name).toBe('Plano de Saúde');
            expect(createdBenefit.description).toBe('Cobertura médica completa');
            expect(createdBenefit.isActive).toBe(true);
            expect(createdBenefit.createdAt).toBeInstanceOf(Date);
            expect(createdBenefit.updatedAt).toBeInstanceOf(Date);
        });

        it('should throw error for invalid benefit', async () => {
            const invalidBenefit = new Benefit({
                id: null,
                name: '', // Nome inválido
                description: 'Descrição válida'
            });

            await expect(repository.create(invalidBenefit)).rejects.toThrow('Erro ao criar benefício');
        });
    });

    describe('findById', () => {
        it('should find benefit by id', async () => {
            // Criar benefício primeiro
            const benefit = new Benefit({
                id: null,
                name: 'Vale Refeição',
                description: 'Auxílio alimentação'
            });

            const created = await repository.create(benefit);

            // Buscar por ID
            const found = await repository.findById(created.id);

            expect(found).toBeInstanceOf(Benefit);
            expect(found.id).toBe(created.id);
            expect(found.name).toBe('Vale Refeição');
        });

        it('should return null for non-existent id', async () => {
            const found = await repository.findById(999);
            expect(found).toBeNull();
        });
    });

    describe('findAll', () => {
        it('should return all benefits', async () => {
            // Criar alguns benefícios
            await repository.create(new Benefit({ id: null, name: 'Benefício 1' }));
            await repository.create(new Benefit({ id: null, name: 'Benefício 2' }));
            await repository.create(new Benefit({ id: null, name: 'Benefício 3' }));

            const benefits = await repository.findAll();

            expect(benefits).toHaveLength(3);
            expect(benefits[0]).toBeInstanceOf(Benefit);
            expect(benefits.map(b => b.name)).toEqual(['Benefício 1', 'Benefício 2', 'Benefício 3']);
        });

        it('should return empty array when no benefits exist', async () => {
            const benefits = await repository.findAll();
            expect(benefits).toEqual([]);
        });

        it('should respect limit and offset options', async () => {
            // Criar 5 benefícios
            for (let i = 1; i <= 5; i++) {
                await repository.create(new Benefit({ id: null, name: `Benefício ${i}` }));
            }

            const benefits = await repository.findAll({ limit: 2, offset: 1 });

            expect(benefits).toHaveLength(2);
            expect(benefits[0].name).toBe('Benefício 2');
            expect(benefits[1].name).toBe('Benefício 3');
        });

        it('should respect order options', async () => {
            await repository.create(new Benefit({ id: null, name: 'Zebra' }));
            await repository.create(new Benefit({ id: null, name: 'Alpha' }));
            await repository.create(new Benefit({ id: null, name: 'Beta' }));

            const benefits = await repository.findAll({
                orderBy: 'name',
                orderDirection: 'DESC'
            });

            expect(benefits.map(b => b.name)).toEqual(['Zebra', 'Beta', 'Alpha']);
        });
    });

    describe('findActive', () => {
        it('should return only active benefits', async () => {
            await repository.create(new Benefit({ id: null, name: 'Ativo 1', isActive: true }));
            await repository.create(new Benefit({ id: null, name: 'Inativo 1', isActive: false }));
            await repository.create(new Benefit({ id: null, name: 'Ativo 2', isActive: true }));

            const activeBenefits = await repository.findActive();

            expect(activeBenefits).toHaveLength(2);
            expect(activeBenefits.every(b => b.isActive)).toBe(true);
            expect(activeBenefits.map(b => b.name)).toEqual(['Ativo 1', 'Ativo 2']);
        });
    });

    describe('findInactive', () => {
        it('should return only inactive benefits', async () => {
            await repository.create(new Benefit({ id: null, name: 'Ativo 1', isActive: true }));
            await repository.create(new Benefit({ id: null, name: 'Inativo 1', isActive: false }));
            await repository.create(new Benefit({ id: null, name: 'Inativo 2', isActive: false }));

            const inactiveBenefits = await repository.findInactive();

            expect(inactiveBenefits).toHaveLength(2);
            expect(inactiveBenefits.every(b => !b.isActive)).toBe(true);
            expect(inactiveBenefits.map(b => b.name)).toEqual(['Inativo 1', 'Inativo 2']);
        });
    });

    describe('findByName', () => {
        it('should find benefits by partial name match', async () => {
            await repository.create(new Benefit({ id: null, name: 'Plano de Saúde' }));
            await repository.create(new Benefit({ id: null, name: 'Vale Refeição' }));
            await repository.create(new Benefit({ id: null, name: 'Plano Odontológico' }));

            const benefits = await repository.findByName('Plano');

            expect(benefits).toHaveLength(2);
            expect(benefits.map(b => b.name)).toEqual(['Plano Odontológico', 'Plano de Saúde']);
        });

        it('should return empty array for non-matching name', async () => {
            await repository.create(new Benefit({ id: null, name: 'Vale Refeição' }));

            const benefits = await repository.findByName('Inexistente');

            expect(benefits).toEqual([]);
        });
    });

    describe('update', () => {
        it('should update existing benefit', async () => {
            // Criar benefício
            const benefit = await repository.create(new Benefit({
                id: null,
                name: 'Nome Original',
                description: 'Descrição Original'
            }));

            // Atualizar
            const updatedBenefit = new Benefit({
                id: benefit.id,
                name: 'Nome Atualizado',
                description: 'Descrição Atualizada',
                isActive: false
            });

            const result = await repository.update(benefit.id, updatedBenefit);

            expect(result).toBeInstanceOf(Benefit);
            expect(result.id).toBe(benefit.id);
            expect(result.name).toBe('Nome Atualizado');
            expect(result.description).toBe('Descrição Atualizada');
            expect(result.isActive).toBe(false);
        });

        it('should return null for non-existent benefit', async () => {
            const benefit = new Benefit({
                id: 999,
                name: 'Nome Qualquer'
            });

            const result = await repository.update(999, benefit);
            expect(result).toBeNull();
        });

        it('should throw error for invalid benefit data', async () => {
            // Criar benefício válido primeiro
            const created = await repository.create(new Benefit({
                id: null,
                name: 'Nome Válido'
            }));

            // Tentar atualizar com dados inválidos
            const invalidBenefit = new Benefit({
                id: created.id,
                name: '' // Nome inválido
            });

            await expect(repository.update(created.id, invalidBenefit))
                .rejects.toThrow('Erro ao atualizar benefício');
        });
    });

    describe('delete', () => {
        it('should delete existing benefit', async () => {
            const benefit = await repository.create(new Benefit({
                id: null,
                name: 'Para Deletar'
            }));

            const deleted = await repository.delete(benefit.id);
            expect(deleted).toBe(true);

            // Verificar se foi realmente deletado
            const found = await repository.findById(benefit.id);
            expect(found).toBeNull();
        });

        it('should return false for non-existent benefit', async () => {
            const deleted = await repository.delete(999);
            expect(deleted).toBe(false);
        });
    });

    describe('count', () => {
        it('should count all benefits', async () => {
            await repository.create(new Benefit({ id: null, name: 'Benefício 1' }));
            await repository.create(new Benefit({ id: null, name: 'Benefício 2' }));

            const count = await repository.count();
            expect(count).toBe(2);
        });

        it('should count active benefits only', async () => {
            await repository.create(new Benefit({ id: null, name: 'Ativo', isActive: true }));
            await repository.create(new Benefit({ id: null, name: 'Inativo', isActive: false }));

            const activeCount = await repository.count({ isActive: true });
            expect(activeCount).toBe(1);
        });

        it('should count inactive benefits only', async () => {
            await repository.create(new Benefit({ id: null, name: 'Ativo', isActive: true }));
            await repository.create(new Benefit({ id: null, name: 'Inativo', isActive: false }));

            const inactiveCount = await repository.count({ isActive: false });
            expect(inactiveCount).toBe(1);
        });
    });

    describe('existsByName', () => {
        it('should return true for existing name', async () => {
            await repository.create(new Benefit({ id: null, name: 'Nome Único' }));

            const exists = await repository.existsByName('Nome Único');
            expect(exists).toBe(true);
        });

        it('should return false for non-existing name', async () => {
            const exists = await repository.existsByName('Nome Inexistente');
            expect(exists).toBe(false);
        });

        it('should exclude specific id from check', async () => {
            const benefit = await repository.create(new Benefit({
                id: null,
                name: 'Nome Para Excluir'
            }));

            const exists = await repository.existsByName('Nome Para Excluir', benefit.id);
            expect(exists).toBe(false);
        });
    });

    describe('transaction', () => {
        it('should execute operations in transaction successfully', async () => {
            const result = await repository.transaction(async (t) => {
                const benefit1 = await repository.create(new Benefit({
                    id: null,
                    name: 'Transacional 1'
                }));

                const benefit2 = await repository.create(new Benefit({
                    id: null,
                    name: 'Transacional 2'
                }));

                return { benefit1, benefit2 };
            });

            expect(result.benefit1).toBeInstanceOf(Benefit);
            expect(result.benefit2).toBeInstanceOf(Benefit);

            // Verificar se os benefícios foram realmente criados
            const count = await repository.count();
            expect(count).toBe(2);
        });

        it('should rollback transaction on error', async () => {
            try {
                await repository.transaction(async (t) => {
                    await repository.create(new Benefit({
                        id: null,
                        name: 'Será Revertido'
                    }));

                    // Forçar erro
                    throw new Error('Erro simulado');
                });
            } catch (error) {
                expect(error.message).toContain('Erro na transação');
            }

            // Verificar se nenhum benefício foi criado
            const count = await repository.count();
            expect(count).toBe(0);
        });
    });
});