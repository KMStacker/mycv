import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../utils/db'

export class Project extends Model {
  declare id: number
  declare title: string
  declare description: string
  declare technologies: string
  declare githubUrl: string
  declare displayOrder: number
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    technologies: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    githubUrl: {
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
    modelName: 'project'
  }
)

export default Project
