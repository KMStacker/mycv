import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../utils/db'

export class VisitorLog extends Model {
  declare id: number
  declare ipHash: string
  declare lastVisitedAt: Date
}

VisitorLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ipHash: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    lastVisitedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'visitorLog'
  }
)

export default VisitorLog