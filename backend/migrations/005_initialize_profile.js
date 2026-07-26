const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('profiles', {
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
      about_text: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: ''
      },
      location: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: ''
      },
      github_url: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: ''
      },
      status: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: ''
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('profiles')
  }
}
