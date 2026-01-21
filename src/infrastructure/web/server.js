require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importar infraestrutura
const databaseManager = require('../database');

// Importar repositórios
const SequelizeBenefitRepository = require('../../repositories/SequelizeBenefitRepository');

// Importar casos de uso
const CreateBenefitUseCase = require('../../usecases/CreateBenefitUseCase');
const ListBenefitsUseCase = require('../../usecases/ListBenefitsUseCase');
const ActivateBenefitUseCase = require('../../usecases/ActivateBenefitUseCase');
const DeactivateBenefitUseCase = require('../../usecases/DeactivateBenefitUseCase');
const DeleteBenefitUseCase = require('../../usecases/DeleteBenefitUseCase');

// Importar controllers
const BenefitController = require('../../controllers/BenefitController');

// Importar rotas
const createBenefitRoutes = require('./routes/benefitRoutes');

// Importar middlewares
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

/**
 * Classe responsável por configurar e iniciar o servidor Express
 */
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
  }

  /**
     * Configura os middlewares da aplicação
     */
  setupMiddlewares() {
    // CORS
    this.app.use(cors());

    // Parser de JSON
    this.app.use(express.json());

    // Parser de URL encoded
    this.app.use(express.urlencoded({ extended: true }));

    // Log de requisições (apenas em desenvolvimento)
    if (process.env.NODE_ENV !== 'production') {
      this.app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
      });
    }
  }

  /**
     * Configura as rotas da aplicação com injeção de dependências
     */
  async setupRoutes() {
    // Inicializar banco de dados
    await databaseManager.initialize();

    // Obter modelo do banco
    const benefitModel = databaseManager.getModel('Benefit');

    // Criar repositório
    const benefitRepository = new SequelizeBenefitRepository(benefitModel, databaseManager);

    // Criar casos de uso
    const createBenefitUseCase = new CreateBenefitUseCase(benefitRepository);
    const listBenefitsUseCase = new ListBenefitsUseCase(benefitRepository);
    const activateBenefitUseCase = new ActivateBenefitUseCase(benefitRepository);
    const deactivateBenefitUseCase = new DeactivateBenefitUseCase(benefitRepository);
    const deleteBenefitUseCase = new DeleteBenefitUseCase(benefitRepository);

    // Criar controller
    const benefitController = new BenefitController(
      createBenefitUseCase,
      listBenefitsUseCase,
      activateBenefitUseCase,
      deactivateBenefitUseCase,
      deleteBenefitUseCase
    );

    // Rota de health check
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'API está funcionando',
        timestamp: new Date().toISOString()
      });
    });

    // Configurar rotas de benefícios
    const benefitRoutes = createBenefitRoutes(benefitController);
    this.app.use('/api', benefitRoutes);

    // Middleware de rota não encontrada (404)
    this.app.use(notFoundHandler);

    // Middleware de tratamento de erros (deve ser o último)
    this.app.use(errorHandler);
  }

  /**
     * Inicia o servidor
     */
  async start() {
    try {
      // Configurar middlewares
      this.setupMiddlewares();

      // Configurar rotas
      await this.setupRoutes();

      // Iniciar servidor
      this.server = this.app.listen(this.port, () => {
        console.log(`🚀 Servidor rodando na porta ${this.port}`);
        console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 Health check: http://localhost:${this.port}/health`);
        console.log(`🔗 API: http://localhost:${this.port}/api/benefits`);
      });

      return this.server;
    } catch (error) {
      console.error('❌ Erro ao iniciar servidor:', error);
      throw error;
    }
  }

  /**
     * Para o servidor
     */
  async stop() {
    if (this.server) {
      await new Promise((resolve) => {
        this.server.close(resolve);
      });
      await databaseManager.close();
      console.log('🛑 Servidor encerrado');
    }
  }
}

// Iniciar servidor se executado diretamente
if (require.main === module) {
  const server = new Server();
  server.start().catch((error) => {
    console.error('Falha ao iniciar servidor:', error);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM recebido, encerrando servidor...');
    await server.stop();
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('\nSIGINT recebido, encerrando servidor...');
    await server.stop();
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  });
}

module.exports = Server;
