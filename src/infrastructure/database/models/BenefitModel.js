const { DataTypes } = require('sequelize');

/**
 * Define o modelo Sequelize para a entidade Benefit
 * Este modelo representa a estrutura da tabela no banco de dados
 *
 * @param {Sequelize} sequelize - Instância do Sequelize
 * @returns {Model} Modelo Benefit do Sequelize
 */
function defineBenefitModel(sequelize) {
  const BenefitModel = sequelize.define('Benefit', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'Identificador único do benefício'
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Nome não pode estar vazio'
        },
        len: {
          args: [3, 100],
          msg: 'Nome deve ter entre 3 e 100 caracteres'
        }
      },
      comment: 'Nome do benefício'
    },

    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: 'Descrição deve ter no máximo 255 caracteres'
        }
      },
      comment: 'Descrição opcional do benefício'
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Indica se o benefício está ativo'
    }
  }, {
    // Opções do modelo
    tableName: 'benefits',
    timestamps: true,

    // Índices
    indexes: [
      {
        name: 'idx_benefits_name',
        fields: ['name']
      },
      {
        name: 'idx_benefits_is_active',
        fields: ['isActive']
      }
    ],

    // Hooks do modelo
    hooks: {
      beforeValidate: (benefit) => {
        // Trim no nome se for string
        if (typeof benefit.name === 'string') {
          benefit.name = benefit.name.trim();
        }

        // Trim na descrição se for string
        if (typeof benefit.description === 'string') {
          benefit.description = benefit.description.trim();
        }
      }
    }
  });

  return BenefitModel;
}

module.exports = defineBenefitModel;
