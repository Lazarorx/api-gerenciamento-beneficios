const request = require('supertest');
const { setupTestServer, cleanDatabase, teardownTestServer } = require('./setup');

describe('Benefits API Integration Tests', () => {
    let app;

    beforeAll(async () => {
        app = await setupTestServer();
    });

    beforeEach(async () => {
        await cleanDatabase();
    });

    afterAll(async () => {
        await teardownTestServer();
    });

    describe('GET /api/benefits', () => {
        it('deve retornar lista vazia quando não há benefícios', async () => {
            const response = await request(app)
                .get('/api/benefits')
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                data: []
            });
        });

        it('deve retornar lista de benefícios cadastrados', async () => {
            // Criar benefícios
            await request(app)
                .post('/api/benefits')
                .send({ name: 'Vale Refeição' });

            await request(app)
                .post('/api/benefits')
                .send({ name: 'Vale Transporte' });

            const response = await request(app)
                .get('/api/benefits')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.data[0].name).toBe('Vale Refeição');
            expect(response.body.data[1].name).toBe('Vale Transporte');
        });

        it('deve filtrar benefícios por status ativo', async () => {
            // Criar benefícios
            const benefit1 = await request(app)
                .post('/api/benefits')
                .send({ name: 'Vale Refeição' });

            await request(app)
                .post('/api/benefits')
                .send({ name: 'Vale Transporte' });

            // Desativar um benefício
            await request(app)
                .put(`/api/benefits/${benefit1.body.data.id}/deactivate`);

            // Buscar apenas ativos
            const response = await request(app)
                .get('/api/benefits?activeOnly=true')
                .expect(200);

            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].name).toBe('Vale Transporte');
            expect(response.body.data[0].isActive).toBe(true);
        });

        it('deve filtrar benefícios por status inativo', async () => {
            // Criar benefícios
            const benefit1 = await request(app)
                .post('/api/benefits')
                .send({ name: 'Vale Refeição' });

            await request(app)
                .post('/api/benefits')
                .send({ name: 'Vale Transporte' });

            // Desativar um benefício
            await request(app)
                .put(`/api/benefits/${benefit1.body.data.id}/deactivate`);

            // Buscar apenas inativos
            const response = await request(app)
                .get('/api/benefits?inactiveOnly=true')
                .expect(200);

            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].name).toBe('Vale Refeição');
            expect(response.body.data[0].isActive).toBe(false);
        });
    });

    describe('POST /api/benefits', () => {
        it('deve criar um novo benefício com dados válidos', async () => {
            const benefitData = {
                name: 'Vale Refeição',
                description: 'Benefício de alimentação'
            };

            const response = await request(app)
                .post('/api/benefits')
                .send(benefitData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toMatchObject({
                name: 'Vale Refeição',
                description: 'Benefício de alimentação',
                isActive: true
            });
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.createdAt).toBeDefined();
        });

        it('deve retornar erro 400 quando nome está ausente', async () => {
            const response = await request(app)
                .post('/api/benefits')
                .send({ description: 'Teste' })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toContain('Nome');
        });

        it('deve retornar erro 400 quando nome está vazio', async () => {
            const response = await request(app)
                .post('/api/benefits')
                .send({ name: '' })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toContain('Nome');
        });

        it('deve retornar erro 400 quando nome tem menos de 3 caracteres', async () => {
            const response = await request(app)
                .post('/api/benefits')
                .send({ name: 'AB' })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toContain('3 caracteres');
        });

        it('deve retornar erro 400 quando nome já existe', async () => {
            // Criar primeiro benefício
            await request(app)
                .post('/api/benefits')
                .send({ name: 'Vale Refeição' });

            // Tentar criar com mesmo nome
            const response = await request(app)
                .post('/api/benefits')
                .send({ name: 'Vale Refeição' })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toContain('existe');
        });
    });

    describe('PUT /api/benefits/:id/activate', () => {
        it('deve ativar um benefício inativo', async () => {
            // Criar benefício
            const createResponse = await request(app)
                .post('/api/benefits')
                .send({ name: 'Vale Refeição' });

            const benefitId = createResponse.body.data.id;

            // Desativar
            await request(app)
                .put(`/api/benefits/${benefitId}/deactivate`)
                .expect(200);

            // Ativar novamente
            const response = await request(app)
                .put(`/api/benefits/${benefitId}/activate`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.isActive).toBe(true);
        });

        it('deve retornar erro 404 quando benefício não existe', async () => {
            const response = await request(app)
                .put('/api/benefits/999/activate')
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toContain('não encontrado');
        });

        it('deve retornar erro 400 quando ID é inválido', async () => {
            const response = await request(app)
                .put('/api/benefits/abc/activate')
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toContain('ID');
        });

        it('deve manter benefício ativo quando já está ativo', async () => {
            // Criar benefício (já vem ativo)
            const createResponse = await request(app)
                .post('/api/benefits')
                .send({ name: 'Vale Refeição' });

            const benefitId = createResponse.body.data.id;

            // Tentar ativar novamente
            const response = await request(app)
                .put(`/api/benefits/${benefitId}/activate`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.isActive).toBe(true);
        });
    });

    describe('PUT /api/benefits/:id/deactivate', () => {
        it('deve desativar um benefício ativo', async () => {
            // Criar benefício
            const createResponse = await request(app)
                .post('/api/benefits')
                .send({ name: 'Vale Refeição' });

            const benefitId = createResponse.body.data.id;

            // Desativar
            const response = await request(app)
                .put(`/api/benefits/${benefitId}/deactivate`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.isActive).toBe(false);
        });

        it('deve retornar erro 404 quando benefício não existe', async () => {
            const response = await request(app)
                .put('/api/benefits/999/deactivate')
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toContain('não encontrado');
        });

        it('deve retornar erro 400 quando ID é inválido', async () => {
            const response = await request(app)
                .put('/api/benefits/xyz/deactivate')
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toContain('ID');
        });

        it('deve manter benefício inativo quando já está inativo', async () => {
            // Criar benefício
            const createResponse = await request(app)
                .post('/api/benefits')
                .send({ name: 'Vale Refeição' });

            const benefitId = createResponse.body.data.id;

            // Desativar
            await request(app)
                .put(`/api/benefits/${benefitId}/deactivate`)
                .expect(200);

            // Tentar desativar novamente
            const response = await request(app)
                .put(`/api/benefits/${benefitId}/deactivate`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.isActive).toBe(false);
        });
    });

    describe('DELETE /api/benefits/:id', () => {
        it('deve excluir um benefício existente', async () => {
            // Criar benefício
            const createResponse = await request(app)
                .post('/api/benefits')
                .send({ name: 'Vale Refeição' });

            const benefitId = createResponse.body.data.id;

            // Excluir
            await request(app)
                .delete(`/api/benefits/${benefitId}`)
                .expect(204);

            // Verificar que não existe mais
            const listResponse = await request(app)
                .get('/api/benefits')
                .expect(200);

            expect(listResponse.body.data).toHaveLength(0);
        });

        it('deve retornar erro 404 quando benefício não existe', async () => {
            const response = await request(app)
                .delete('/api/benefits/999')
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toContain('não encontrado');
        });

        it('deve retornar erro 400 quando ID é inválido', async () => {
            const response = await request(app)
                .delete('/api/benefits/invalid')
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toContain('ID');
        });
    });

    describe('Cenários de erro gerais', () => {
        it('deve retornar erro 404 para rota não existente', async () => {
            const response = await request(app)
                .get('/api/rota-inexistente')
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.error.message).toContain('não encontrada');
        });

        it('deve retornar erro para JSON inválido', async () => {
            const response = await request(app)
                .post('/api/benefits')
                .set('Content-Type', 'application/json')
                .send('{ invalid json }');

            expect(response.status).toBeGreaterThanOrEqual(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe('Health Check', () => {
        it('deve retornar status 200 no health check', async () => {
            const response = await request(app)
                .get('/health')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toContain('funcionando');
            expect(response.body.timestamp).toBeDefined();
        });
    });
});
