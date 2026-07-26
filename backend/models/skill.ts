import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../utils/db'

export class Skill extends Model {
  declare id: number
  declare name: string
  declare level: string
  declare usedOn: string
  declare displayOrder: number
}

Skill.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    level: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    usedOn: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'skill'
  }
)

export default Skill
