const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('country_stats', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      country_code: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      },
      country_name: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      visit_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      }
    })

    await queryInterface.createTable('visitor_logs', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      ip_hash: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      },
      last_visited_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('visitor_logs')
    await queryInterface.dropTable('country_stats')
  }
}
