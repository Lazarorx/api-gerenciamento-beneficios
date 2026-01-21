/**
 * Middleware global de tratamento de erros
 * Captura erros não tratados e retorna respostas padronizadas
 */

/**
 * Middleware de tratamento de erros
 * @param {Error} err - Erro capturado
 * @param {Request} req - Objeto de requisição Express
 * @param {Response} res - Objeto de resposta Express
 * @param {Function} next - Próximo middleware
 */
function errorHandler(err, req, res, _next) {
  // Log do erro para debug
  console.error('Error:', err);

  // Erro de validação
  const isValidationError = err.name === 'ValidationError' ||
    err.message.includes('inválido') ||
    err.message.includes('obrigatório');

  if (isValidationError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
        details: err.errors || []
      }
    });
  }

  // Erro de recurso não encontrado
  if (err.name === 'NotFoundError' || err.message.includes('não encontrado')) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: err.message
      }
    });
  }

  // Erro de banco de dados
  if (err.name === 'SequelizeError' || err.name === 'DatabaseError') {
    return res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Erro ao acessar o banco de dados'
      }
    });
  }

  // Erro interno do servidor (padrão)
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'Erro interno do servidor'
        : err.message
    }
  });
}

/**
 * Middleware para rotas não encontradas (404)
 * @param {Request} req - Objeto de requisição Express
 * @param {Response} res - Objeto de resposta Express
 */
function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Rota ${req.method} ${req.path} não encontrada`
    }
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};
