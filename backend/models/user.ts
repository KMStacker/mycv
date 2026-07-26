import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../utils/db'

export class User extends Model {
  declare id: number
  declare username: string
  declare passwordHash: string
  declare role: string
  declare fullName: string | null
  declare email: string | null
  declare phone: string | null
  declare commentingDisabled: boolean
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    role: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'USER'
    },
    fullName: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    commentingDisabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'user'
  }
)

export default User
