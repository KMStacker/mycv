import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../utils/db'
import User from './user'

export class Comment extends Model {
  declare id: number
  declare content: string
  declare userId: number | null
  declare isPublic: boolean
  declare guestName: string | null
  declare createdAt: Date
  declare parentId: number | null
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' }
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    guestName: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'comments', key: 'id' }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'comment'
  }
)

Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' })

export default Comment
