import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../utils/db'

export class CountryStat extends Model {
  declare id: number
  declare countryCode: string
  declare countryName: string
  declare visitCount: number
}

CountryStat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    countryCode: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    countryName: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    visitCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'countryStat'
  }
)

export default CountryStat