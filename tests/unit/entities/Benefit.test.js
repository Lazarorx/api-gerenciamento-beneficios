const Benefit = require('../../../src/entities/Benefit');

describe('Benefit Entity', () => {
    describe('Constructor', () => {
        it('should create a benefit with all parameters', () => {
            const now = new Date();
            const benefit = new Benefit({
                id: 1,
                name: 'Plano de Saúde',
                description: 'Cobertura completa',
                isActive: true,
                createdAt: now,
                updatedAt: now
            });

            expect(benefit.id).toBe(1);
            expect(benefit.name).toBe('Plano de Saúde');
            expect(benefit.description).toBe('Cobertura completa');
            expect(benefit.isActive).toBe(true);
            expect(benefit.createdAt).toBe(now);
            expect(benefit.updatedAt).toBe(now);
        });

        it('should create a benefit with default values', () => {
            const benefit = new Benefit({
                id: null,
                name: 'Vale Refeição'
            });

            expect(benefit.id).toBeNull();
            expect(benefit.name).toBe('Vale Refeição');
            expect(benefit.description).toBe('');
            expect(benefit.isActive).toBe(true);
            expect(benefit.createdAt).toBeInstanceOf(Date);
            expect(benefit.updatedAt).toBeInstanceOf(Date);
        });
    });

    describe('fromData static method', () => {
        it('should create benefit from data object', () => {
            const data = {
                id: 2,
                name: 'Vale Transporte',
                description: 'Auxílio transporte',
                isActive: false,
                createdAt: new Date('2023-01-01'),
                updatedAt: new Date('2023-01-02')
            };

            const benefit = Benefit.fromData(data);

            expect(benefit).toBeInstanceOf(Benefit);
            expect(benefit.id).toBe(2);
            expect(benefit.name).toBe('Vale Transporte');
            expect(benefit.description).toBe('Auxílio transporte');
            expect(benefit.isActive).toBe(false);
        });
    });

    describe('toObject method', () => {
        it('should convert benefit to plain object', () => {
            const benefit = new Benefit({
                id: 3,
                name: 'Seguro de Vida',
                description: 'Proteção familiar',
                isActive: true
            });

            const obj = benefit.toObject();

            expect(obj).toEqual({
                id: 3,
                name: 'Seguro de Vida',
                description: 'Proteção familiar',
                isActive: true,
                createdAt: benefit.createdAt,
                updatedAt: benefit.updatedAt
            });
        });
    });

    describe('toJSON method', () => {
        it('should convert benefit to JSON serializable object', () => {
            const benefit = new Benefit({
                id: 4,
                name: 'Plano Odontológico'
            });

            const json = benefit.toJSON();
            const jsonString = JSON.stringify(benefit);

            expect(json).toEqual(benefit.toObject());
            expect(() => JSON.parse(jsonString)).not.toThrow();
        });
    });

    describe('activate method', () => {
        it('should activate an inactive benefit', () => {
            const benefit = new Benefit({
                id: 5,
                name: 'Gympass',
                isActive: false
            });

            benefit.activate();

            expect(benefit.isActive).toBe(true);
            expect(benefit.updatedAt).toBeInstanceOf(Date);
        });

        it('should activate an already active benefit', () => {
            const benefit = new Benefit({
                id: 6,
                name: 'Auxílio Creche',
                isActive: true
            });

            benefit.activate();

            expect(benefit.isActive).toBe(true);
        });
    });

    describe('deactivate method', () => {
        it('should deactivate an active benefit', () => {
            const benefit = new Benefit({
                id: 7,
                name: 'Vale Cultura',
                isActive: true
            });

            benefit.deactivate();

            expect(benefit.isActive).toBe(false);
            expect(benefit.updatedAt).toBeInstanceOf(Date);
        });

        it('should deactivate an already inactive benefit', () => {
            const benefit = new Benefit({
                id: 8,
                name: 'Previdência Privada',
                isActive: false
            });

            benefit.deactivate();

            expect(benefit.isActive).toBe(false);
        });
    });

    describe('isActiveBenefit method', () => {
        it('should return true for active benefit', () => {
            const benefit = new Benefit({
                id: 9,
                name: 'Auxílio Home Office',
                isActive: true
            });

            expect(benefit.isActiveBenefit()).toBe(true);
        });

        it('should return false for inactive benefit', () => {
            const benefit = new Benefit({
                id: 10,
                name: 'Carro da Empresa',
                isActive: false
            });

            expect(benefit.isActiveBenefit()).toBe(false);
        });
    });

    describe('isInactive method', () => {
        it('should return true for inactive benefit', () => {
            const benefit = new Benefit({
                id: 11,
                name: 'Notebook',
                isActive: false
            });

            expect(benefit.isInactive()).toBe(true);
        });

        it('should return false for active benefit', () => {
            const benefit = new Benefit({
                id: 12,
                name: 'Celular Corporativo',
                isActive: true
            });

            expect(benefit.isInactive()).toBe(false);
        });
    });

    describe('Validation', () => {
        describe('isValid method', () => {
            it('should return valid for correct benefit data', () => {
                const benefit = new Benefit({
                    id: 1,
                    name: 'Plano de Saúde',
                    description: 'Cobertura médica completa',
                    isActive: true
                });

                const validation = benefit.isValid();

                expect(validation.isValid).toBe(true);
                expect(validation.errors).toEqual([]);
            });

            it('should return invalid for missing name', () => {
                const benefit = new Benefit({
                    id: 1,
                    name: '',
                    description: 'Descrição válida'
                });

                const validation = benefit.isValid();

                expect(validation.isValid).toBe(false);
                expect(validation.errors).toContain('Nome não pode estar vazio');
            });

            it('should return invalid for null name', () => {
                const benefit = new Benefit({
                    id: 1,
                    name: null,
                    description: 'Descrição válida'
                });

                const validation = benefit.isValid();

                expect(validation.isValid).toBe(false);
                expect(validation.errors).toContain('Nome é obrigatório e deve ser uma string');
            });

            it('should return invalid for short name', () => {
                const benefit = new Benefit({
                    id: 1,
                    name: 'AB',
                    description: 'Descrição válida'
                });

                const validation = benefit.isValid();

                expect(validation.isValid).toBe(false);
                expect(validation.errors).toContain('Nome deve ter pelo menos 3 caracteres');
            });

            it('should return invalid for long name', () => {
                const longName = 'A'.repeat(101);
                const benefit = new Benefit({
                    id: 1,
                    name: longName,
                    description: 'Descrição válida'
                });

                const validation = benefit.isValid();

                expect(validation.isValid).toBe(false);
                expect(validation.errors).toContain('Nome deve ter no máximo 100 caracteres');
            });

            it('should return invalid for non-string name', () => {
                const benefit = new Benefit({
                    id: 1,
                    name: 123,
                    description: 'Descrição válida'
                });

                const validation = benefit.isValid();

                expect(validation.isValid).toBe(false);
                expect(validation.errors).toContain('Nome é obrigatório e deve ser uma string');
            });

            it('should return invalid for long description', () => {
                const longDescription = 'A'.repeat(256);
                const benefit = new Benefit({
                    id: 1,
                    name: 'Nome Válido',
                    description: longDescription
                });

                const validation = benefit.isValid();

                expect(validation.isValid).toBe(false);
                expect(validation.errors).toContain('Descrição deve ter no máximo 255 caracteres');
            });

            it('should return invalid for non-string description', () => {
                const benefit = new Benefit({
                    id: 1,
                    name: 'Nome Válido',
                    description: 123
                });

                const validation = benefit.isValid();

                expect(validation.isValid).toBe(false);
                expect(validation.errors).toContain('Descrição deve ser uma string');
            });

            it('should return invalid for non-boolean isActive', () => {
                const benefit = new Benefit({
                    id: 1,
                    name: 'Nome Válido',
                    description: 'Descrição válida',
                    isActive: 'true'
                });

                const validation = benefit.isValid();

                expect(validation.isValid).toBe(false);
                expect(validation.errors).toContain('Status ativo deve ser um valor booleano');
            });

            it('should accept null or undefined description', () => {
                const benefitWithNull = new Benefit({
                    id: 1,
                    name: 'Nome Válido',
                    description: null
                });

                const benefitWithUndefined = new Benefit({
                    id: 2,
                    name: 'Nome Válido',
                    description: undefined
                });

                expect(benefitWithNull.isValid().isValid).toBe(true);
                expect(benefitWithUndefined.isValid().isValid).toBe(true);
            });

            it('should return invalid for invalid createdAt date', () => {
                const benefit = new Benefit({
                    id: 1,
                    name: 'Nome Válido',
                    description: 'Descrição válida',
                    createdAt: 'invalid-date'
                });

                const validation = benefit.isValid();

                expect(validation.isValid).toBe(false);
                expect(validation.errors).toContain('Data de criação deve ser uma instância de Date');
            });

            it('should return invalid for invalid updatedAt date', () => {
                const benefit = new Benefit({
                    id: 1,
                    name: 'Nome Válido',
                    description: 'Descrição válida',
                    updatedAt: 'invalid-date'
                });

                const validation = benefit.isValid();

                expect(validation.isValid).toBe(false);
                expect(validation.errors).toContain('Data de atualização deve ser uma instância de Date');
            });
        });

        describe('validate method', () => {
            it('should not throw error for valid benefit', () => {
                const benefit = new Benefit({
                    id: 1,
                    name: 'Plano de Saúde',
                    description: 'Cobertura médica'
                });

                expect(() => benefit.validate()).not.toThrow();
            });

            it('should throw error for invalid benefit', () => {
                const benefit = new Benefit({
                    id: 1,
                    name: '',
                    description: 'Descrição válida'
                });

                expect(() => benefit.validate()).toThrow('Benefício inválido: Nome não pode estar vazio');
            });

            it('should throw error with multiple validation messages', () => {
                const benefit = new Benefit({
                    id: 1,
                    name: 'AB',
                    description: 'A'.repeat(256),
                    isActive: 'invalid'
                });

                expect(() => benefit.validate()).toThrow('Benefício inválido:');
            });
        });
    });
});