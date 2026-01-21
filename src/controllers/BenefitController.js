/**
 * Controlador HTTP para gerenciar benefícios
 * Responsável por receber requisições HTTP, chamar os casos de uso apropriados
 * e retornar respostas formatadas
 */
class BenefitController {
  /**
     * @param {CreateBenefitUseCase} createBenefitUseCase
     * @param {ListBenefitsUseCase} listBenefitsUseCase
     * @param {ActivateBenefitUseCase} activateBenefitUseCase
     * @param {DeactivateBenefitUseCase} deactivateBenefitUseCase
     * @param {DeleteBenefitUseCase} deleteBenefitUseCase
     */
  constructor(
    createBenefitUseCase,
    listBenefitsUseCase,
    activateBenefitUseCase,
    deactivateBenefitUseCase,
    deleteBenefitUseCase
  ) {
    this.createBenefitUseCase = createBenefitUseCase;
    this.listBenefitsUseCase = listBenefitsUseCase;
    this.activateBenefitUseCase = activateBenefitUseCase;
    this.deactivateBenefitUseCase = deactivateBenefitUseCase;
    this.deleteBenefitUseCase = deleteBenefitUseCase;
  }

  /**
     * Lista todos os benefícios
     * GET /benefits
     */
  async list(req, res) {
    try {
      const options = {
        limit: req.query.limit ? parseInt(req.query.limit) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset) : undefined,
        orderBy: req.query.orderBy,
        orderDirection: req.query.orderDirection,
        activeOnly: req.query.activeOnly === 'true',
        inactiveOnly: req.query.inactiveOnly === 'true'
      };

      const benefits = await this.listBenefitsUseCase.execute(options);

      return res.status(200).json({
        success: true,
        data: benefits.map(b => b.toJSON())
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message
        }
      });
    }
  }

  /**
     * Cria um novo benefício
     * POST /benefits
     */
  async create(req, res) {
    try {
      const { name, description, isActive } = req.body;

      const benefit = await this.createBenefitUseCase.execute({
        name,
        description,
        isActive
      });

      return res.status(201).json({
        success: true,
        data: benefit.toJSON(),
        message: 'Benefício criado com sucesso'
      });
    } catch (error) {
      // Erros de validação
      if (error.message.includes('inválido') ||
                error.message.includes('obrigatório') ||
                error.message.includes('caracteres') ||
                error.message.includes('existe')) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message
          }
        });
      }

      // Erro interno
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message
        }
      });
    }
  }

  /**
     * Ativa um benefício
     * PUT /benefits/:id/activate
     */
  async activate(req, res) {
    try {
      const id = parseInt(req.params.id);

      const benefit = await this.activateBenefitUseCase.execute(id);

      return res.status(200).json({
        success: true,
        data: benefit.toJSON(),
        message: 'Benefício ativado com sucesso'
      });
    } catch (error) {
      // Benefício não encontrado
      if (error.message === 'Benefício não encontrado') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message
          }
        });
      }

      // ID inválido
      if (error.message === 'ID inválido') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message
          }
        });
      }

      // Erro interno
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message
        }
      });
    }
  }

  /**
     * Desativa um benefício
     * PUT /benefits/:id/deactivate
     */
  async deactivate(req, res) {
    try {
      const id = parseInt(req.params.id);

      const benefit = await this.deactivateBenefitUseCase.execute(id);

      return res.status(200).json({
        success: true,
        data: benefit.toJSON(),
        message: 'Benefício desativado com sucesso'
      });
    } catch (error) {
      // Benefício não encontrado
      if (error.message === 'Benefício não encontrado') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message
          }
        });
      }

      // ID inválido
      if (error.message === 'ID inválido') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message
          }
        });
      }

      // Erro interno
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message
        }
      });
    }
  }

  /**
     * Exclui um benefício
     * DELETE /benefits/:id
     */
  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);

      await this.deleteBenefitUseCase.execute(id);

      return res.status(204).send();
    } catch (error) {
      // Benefício não encontrado
      if (error.message === 'Benefício não encontrado') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message
          }
        });
      }

      // ID inválido
      if (error.message === 'ID inválido') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message
          }
        });
      }

      // Erro interno
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message
        }
      });
    }
  }
}

module.exports = BenefitController;
