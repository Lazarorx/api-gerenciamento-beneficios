const express = require('express');

/**
 * Cria as rotas de benefícios
 * @param {BenefitController} benefitController - Controlador de benefícios
 * @returns {Router} Router do Express com as rotas configuradas
 */
function createBenefitRoutes(benefitController) {
  const router = express.Router();

  // GET /benefits - Listar todos os benefícios
  router.get('/benefits', (req, res) => benefitController.list(req, res));

  // POST /benefits - Criar novo benefício
  router.post('/benefits', (req, res) => benefitController.create(req, res));

  // PUT /benefits/:id/activate - Ativar benefício
  router.put('/benefits/:id/activate', (req, res) => benefitController.activate(req, res));

  // PUT /benefits/:id/deactivate - Desativar benefício
  router.put('/benefits/:id/deactivate', (req, res) => benefitController.deactivate(req, res));

  // DELETE /benefits/:id - Excluir benefício
  router.delete('/benefits/:id', (req, res) => benefitController.delete(req, res));

  return router;
}

module.exports = createBenefitRoutes;
