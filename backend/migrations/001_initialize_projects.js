const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('projects', {
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
      github_url: {
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
    await queryInterface.dropTable('projects')
  }
}
