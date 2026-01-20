/**
 * Entidade Benefit - Representa um benefício no domínio da aplicação
 * Esta classe contém as regras de negócio puras, sem dependências externas
 */
class Benefit {
  /**
     * Construtor da entidade Benefit
     * @param {Object} params - Parâmetros do benefício
     * @param {number|null} params.id - Identificador único (null para novos benefícios)
     * @param {string} params.name - Nome do benefício
     * @param {string} params.description - Descrição do benefício
     * @param {boolean} params.isActive - Status ativo/inativo
     * @param {Date} params.createdAt - Data de criação
     * @param {Date} params.updatedAt - Data de atualização
     */
  constructor({ id, name, description = '', isActive = true, createdAt = null, updatedAt = null }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.isActive = isActive;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  /**
     * Cria uma nova instância de Benefit a partir de dados simples
     * @param {Object} data - Dados do benefício
     * @param {number} data.id - ID do benefício
     * @param {string} data.name - Nome do benefício
     * @param {string} data.description - Descrição do benefício
     * @param {boolean} data.isActive - Status ativo/inativo
     * @param {Date} data.createdAt - Data de criação
     * @param {Date} data.updatedAt - Data de atualização
     * @returns {Benefit} Nova instância de Benefit
     */
  static fromData(data) {
    return new Benefit({
      id: data.id,
      name: data.name,
      description: data.description,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }

  /**
     * Converte a entidade para um objeto simples
     * @returns {Object} Representação em objeto simples
     */
  toObject() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
     * Converte para JSON (usado automaticamente pelo JSON.stringify)
     * @returns {Object} Representação JSON
     */
  toJSON() {
    return this.toObject();
  }

  /**
     * Ativa o benefício
     * Regra de negócio: Um benefício pode ser ativado a qualquer momento
     */
  activate() {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  /**
     * Desativa o benefício
     * Regra de negócio: Um benefício pode ser desativado a qualquer momento
     */
  deactivate() {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  /**
     * Verifica se o benefício está ativo
     * @returns {boolean} True se ativo, false caso contrário
     */
  isActiveBenefit() {
    return this.isActive === true;
  }

  /**
     * Verifica se o benefício está inativo
     * @returns {boolean} True se inativo, false caso contrário
     */
  isInactive() {
    return this.isActive === false;
  }

  /**
     * Valida se o benefício atende às regras de negócio
     * @returns {Object} Resultado da validação com isValid e errors
     */
  isValid() {
    const errors = [];

    errors.push(...this._validateName());
    errors.push(...this._validateDescription());
    errors.push(...this._validateStatus());
    errors.push(...this._validateDates());

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
     * Valida o nome do benefício
     * @returns {Array} Array de erros de validação
     * @private
     */
  _validateName() {
    const errors = [];

    if (typeof this.name !== 'string') {
      errors.push('Nome é obrigatório e deve ser uma string');
      return errors;
    }

    const trimmedName = this.name.trim();
    if (trimmedName.length === 0) {
      errors.push('Nome não pode estar vazio');
    } else if (trimmedName.length < 3) {
      errors.push('Nome deve ter pelo menos 3 caracteres');
    } else if (trimmedName.length > 100) {
      errors.push('Nome deve ter no máximo 100 caracteres');
    }

    return errors;
  }

  /**
     * Valida a descrição do benefício
     * @returns {Array} Array de erros de validação
     * @private
     */
  _validateDescription() {
    const errors = [];

    if (this.description !== null && this.description !== undefined) {
      if (typeof this.description !== 'string') {
        errors.push('Descrição deve ser uma string');
      } else if (this.description.length > 255) {
        errors.push('Descrição deve ter no máximo 255 caracteres');
      }
    }

    return errors;
  }

  /**
     * Valida o status do benefício
     * @returns {Array} Array de erros de validação
     * @private
     */
  _validateStatus() {
    const errors = [];

    if (typeof this.isActive !== 'boolean') {
      errors.push('Status ativo deve ser um valor booleano');
    }

    return errors;
  }

  /**
     * Valida as datas do benefício
     * @returns {Array} Array de erros de validação
     * @private
     */
  _validateDates() {
    const errors = [];

    if (this.createdAt && !(this.createdAt instanceof Date)) {
      errors.push('Data de criação deve ser uma instância de Date');
    }

    if (this.updatedAt && !(this.updatedAt instanceof Date)) {
      errors.push('Data de atualização deve ser uma instância de Date');
    }

    return errors;
  }

  /**
     * Valida e lança erro se inválido
     * @throws {Error} Se o benefício for inválido
     */
  validate() {
    const validation = this.isValid();
    if (!validation.isValid) {
      throw new Error(`Benefício inválido: ${validation.errors.join(', ')}`);
    }
  }
}

module.exports = Benefit;
