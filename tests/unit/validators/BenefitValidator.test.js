const BenefitValidator = require('../../../src/validators/BenefitValidator');

describe('BenefitValidator', () => {
    describe('validateCreate', () => {
        it('should validate correct benefit data', () => {
            const data = {
                name: 'Plano de Saúde',
                description: 'Cobertura completa',
                isActive: true
            };

            const result = BenefitValidator.validateCreate(data);

            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
        });

        it('should validate benefit without description', () => {
            const data = {
                name: 'Vale Refeição'
            };

            const result = BenefitValidator.validateCreate(data);

            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
        });

        it('should reject null data', () => {
            const result = BenefitValidator.validateCreate(null);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Dados inválidos');
        });

        it('should reject non-object data', () => {
            const result = BenefitValidator.validateCreate('invalid');

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Dados inválidos');
        });

        it('should reject missing name', () => {
            const data = {
                description: 'Descrição'
            };

            const result = BenefitValidator.validateCreate(data);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Nome é obrigatório');
        });

        it('should reject empty name', () => {
            const data = {
                name: '   '
            };

            const result = BenefitValidator.validateCreate(data);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Nome é obrigatório');
        });

        it('should reject name too short', () => {
            const data = {
                name: 'AB'
            };

            const result = BenefitValidator.validateCreate(data);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Nome deve ter pelo menos 3 caracteres');
        });

        it('should reject name too long', () => {
            const data = {
                name: 'A'.repeat(101)
            };

            const result = BenefitValidator.validateCreate(data);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Nome deve ter no máximo 100 caracteres');
        });

        it('should reject non-string name', () => {
            const data = {
                name: 123
            };

            const result = BenefitValidator.validateCreate(data);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Nome é obrigatório');
        });

        it('should reject description too long', () => {
            const data = {
                name: 'Plano de Saúde',
                description: 'A'.repeat(256)
            };

            const result = BenefitValidator.validateCreate(data);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Descrição deve ter no máximo 255 caracteres');
        });

        it('should reject non-string description', () => {
            const data = {
                name: 'Plano de Saúde',
                description: 123
            };

            const result = BenefitValidator.validateCreate(data);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Descrição deve ser uma string');
        });

        it('should reject non-boolean isActive', () => {
            const data = {
                name: 'Plano de Saúde',
                isActive: 'true'
            };

            const result = BenefitValidator.validateCreate(data);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('isActive deve ser um valor booleano');
        });

        it('should return multiple errors', () => {
            const data = {
                name: 'AB',
                description: 'A'.repeat(256),
                isActive: 'invalid'
            };

            const result = BenefitValidator.validateCreate(data);

            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(1);
        });
    });

    describe('validateId', () => {
        it('should validate correct ID', () => {
            const result = BenefitValidator.validateId('1');

            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
            expect(result.id).toBe(1);
        });

        it('should validate numeric ID', () => {
            const result = BenefitValidator.validateId(42);

            expect(result.isValid).toBe(true);
            expect(result.id).toBe(42);
        });

        it('should reject zero ID', () => {
            const result = BenefitValidator.validateId('0');

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('ID inválido');
        });

        it('should reject negative ID', () => {
            const result = BenefitValidator.validateId('-1');

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('ID inválido');
        });

        it('should reject non-numeric ID', () => {
            const result = BenefitValidator.validateId('abc');

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('ID inválido');
        });

        it('should reject null ID', () => {
            const result = BenefitValidator.validateId(null);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('ID inválido');
        });
    });

    describe('validateListQuery', () => {
        it('should validate empty query', () => {
            const result = BenefitValidator.validateListQuery({});

            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual([]);
            expect(result.params).toEqual({});
        });

        it('should validate limit parameter', () => {
            const result = BenefitValidator.validateListQuery({ limit: '10' });

            expect(result.isValid).toBe(true);
            expect(result.params.limit).toBe(10);
        });

        it('should validate offset parameter', () => {
            const result = BenefitValidator.validateListQuery({ offset: '5' });

            expect(result.isValid).toBe(true);
            expect(result.params.offset).toBe(5);
        });

        it('should validate orderBy parameter', () => {
            const result = BenefitValidator.validateListQuery({ orderBy: 'name' });

            expect(result.isValid).toBe(true);
            expect(result.params.orderBy).toBe('name');
        });

        it('should validate orderDirection parameter', () => {
            const result = BenefitValidator.validateListQuery({ orderDirection: 'DESC' });

            expect(result.isValid).toBe(true);
            expect(result.params.orderDirection).toBe('DESC');
        });

        it('should validate activeOnly parameter', () => {
            const result = BenefitValidator.validateListQuery({ activeOnly: 'true' });

            expect(result.isValid).toBe(true);
            expect(result.params.activeOnly).toBe(true);
        });

        it('should validate inactiveOnly parameter', () => {
            const result = BenefitValidator.validateListQuery({ inactiveOnly: 'true' });

            expect(result.isValid).toBe(true);
            expect(result.params.inactiveOnly).toBe(true);
        });

        it('should reject invalid limit', () => {
            const result = BenefitValidator.validateListQuery({ limit: '-1' });

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Limit deve ser um número positivo');
        });

        it('should reject invalid offset', () => {
            const result = BenefitValidator.validateListQuery({ offset: '-1' });

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Offset deve ser um número não negativo');
        });

        it('should reject invalid orderBy', () => {
            const result = BenefitValidator.validateListQuery({ orderBy: 'invalid' });

            expect(result.isValid).toBe(false);
            expect(result.errors[0]).toContain('OrderBy deve ser um dos seguintes');
        });

        it('should reject invalid orderDirection', () => {
            const result = BenefitValidator.validateListQuery({ orderDirection: 'INVALID' });

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('OrderDirection deve ser ASC ou DESC');
        });

        it('should validate all parameters together', () => {
            const query = {
                limit: '10',
                offset: '0',
                orderBy: 'name',
                orderDirection: 'ASC',
                activeOnly: 'true'
            };

            const result = BenefitValidator.validateListQuery(query);

            expect(result.isValid).toBe(true);
            expect(result.params).toEqual({
                limit: 10,
                offset: 0,
                orderBy: 'name',
                orderDirection: 'ASC',
                activeOnly: true
            });
        });
    });
});
