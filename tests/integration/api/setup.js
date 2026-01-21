const Server = require('../../../src/infrastructure/web/server');
const databaseManager = require('../../../src/infrastructure/database');

/**
 * Setup para testes de integração da API
 * Cria uma instância do servidor para cada suite de testes
 */

let server;
let app;

/**
 * Inicializa o servidor antes de todos os testes
 */
async function setupTestServer() {
    // Garantir que estamos em ambiente de teste
    process.env.NODE_ENV = 'test';

    // Criar instância do servidor
    server = new Server();

    // Configurar middlewares
    server.setupMiddlewares();

    // Configurar rotas (isso inicializa o banco)
    await server.setupRoutes();

    // Retornar a aplicação Express para uso com supertest
    app = server.app;

    return app;
}

/**
 * Limpa o banco de dados antes de cada teste
 */
async function cleanDatabase() {
    const benefitModel = databaseManager.getModel('Benefit');
    await benefitModel.destroy({ where: {}, truncate: true });
}

/**
 * Encerra o servidor após todos os testes
 */
async function teardownTestServer() {
    if (server) {
        await server.stop();
    }
}

module.exports = {
    setupTestServer,
    cleanDatabase,
    teardownTestServer
};
