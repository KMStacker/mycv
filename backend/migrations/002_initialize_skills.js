const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('skills', {
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
      used_on: {
        type: DataTypes.TEXT,
        defaultValue: ''
      },
      display_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('skills')
  }
}
