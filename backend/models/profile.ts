import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../utils/db'

export class Profile extends Model {
  declare id: number
  declare name: string
  declare email: string
  declare phone: string
  declare linkedinUrl: string
  declare aboutText: string
  declare location: string
  declare githubUrl: string
  declare status: string
}

Profile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    phone: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    aboutText: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    location: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    githubUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'profile'
  }
)

export default Profile
