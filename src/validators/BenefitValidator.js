/**
 * Validador para dados de benefícios
 * Responsável por validar dados de entrada antes de passar para os casos de uso
 */
class BenefitValidator {
  /**
     * Valida dados para criação de benefício
     * @param {Object} data - Dados do benefício
     * @returns {Object} { isValid: boolean, errors: string[] }
     */
  static validateCreate(data) {
    const errors = [];

    if (!data || typeof data !== 'object') {
      errors.push('Dados inválidos');
      return { isValid: false, errors };
    }

    // Validar nome
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.push('Nome é obrigatório');
    } else if (data.name.trim().length < 3) {
      errors.push('Nome deve ter pelo menos 3 caracteres');
    } else if (data.name.length > 100) {
      errors.push('Nome deve ter no máximo 100 caracteres');
    }

    // Validar descrição (opcional)
    if (data.description !== undefined && data.description !== null) {
      if (typeof data.description !== 'string') {
        errors.push('Descrição deve ser uma string');
      } else if (data.description.length > 255) {
        errors.push('Descrição deve ter no máximo 255 caracteres');
      }
    }

    // Validar isActive (opcional)
    if (data.isActive !== undefined && typeof data.isActive !== 'boolean') {
      errors.push('isActive deve ser um valor booleano');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
     * Valida ID de benefício
     * @param {any} id - ID a ser validado
     * @returns {Object} { isValid: boolean, errors: string[] }
     */
  static validateId(id) {
    const errors = [];

    const numericId = parseInt(id);

    if (isNaN(numericId) || numericId <= 0) {
      errors.push('ID inválido');
    }

    return {
      isValid: errors.length === 0,
      errors,
      id: numericId
    };
  }

  /**
     * Valida parâmetros de query para listagem
     * @param {Object} query - Query parameters
     * @returns {Object} { isValid: boolean, errors: string[], params: Object }
     */
  static validateListQuery(query) {
    const errors = [];
    const params = {};

    // Validar limit
    if (query.limit !== undefined) {
      const limit = parseInt(query.limit);
      if (isNaN(limit) || limit <= 0) {
        errors.push('Limit deve ser um número positivo');
      } else {
        params.limit = limit;
      }
    }

    // Validar offset
    if (query.offset !== undefined) {
      const offset = parseInt(query.offset);
      if (isNaN(offset) || offset < 0) {
        errors.push('Offset deve ser um número não negativo');
      } else {
        params.offset = offset;
      }
    }

    // Validar orderBy
    if (query.orderBy !== undefined) {
      const validFields = ['id', 'name', 'createdAt', 'updatedAt'];
      if (!validFields.includes(query.orderBy)) {
        errors.push(`OrderBy deve ser um dos seguintes: ${validFields.join(', ')}`);
      } else {
        params.orderBy = query.orderBy;
      }
    }

    // Validar orderDirection
    if (query.orderDirection !== undefined) {
      const validDirections = ['ASC', 'DESC'];
      if (!validDirections.includes(query.orderDirection.toUpperCase())) {
        errors.push('OrderDirection deve ser ASC ou DESC');
      } else {
        params.orderDirection = query.orderDirection.toUpperCase();
      }
    }

    // Validar activeOnly
    if (query.activeOnly !== undefined) {
      params.activeOnly = query.activeOnly === 'true';
    }

    // Validar inactiveOnly
    if (query.inactiveOnly !== undefined) {
      params.inactiveOnly = query.inactiveOnly === 'true';
    }

    return {
      isValid: errors.length === 0,
      errors,
      params
    };
  }
}

module.exports = BenefitValidator;
