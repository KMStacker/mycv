import { Sequelize } from 'sequelize'
import { Umzug, SequelizeStorage } from 'umzug'
import * as config from './config'

const isProduction = process.env.NODE_ENV === 'production'

export const sequelize = new Sequelize(config.DATABASE_URL || '', {
  dialect: 'postgres',
  dialectOptions: isProduction
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    : {}
})

const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: [
      {
        name: '001_initialize_projects.js',
        up: async (params) => require('../migrations/001_initialize_projects.js').up(params),
        down: async (params) => require('../migrations/001_initialize_projects.js').down(params)
      },
      {
        name: '002_initialize_skills.js',
        up: async (params) => require('../migrations/002_initialize_skills.js').up(params),
        down: async (params) => require('../migrations/002_initialize_skills.js').down(params)
      },
      {
        name: '003_initialize_users.js',
        up: async (params) => require('../migrations/003_initialize_users.js').up(params),
        down: async (params) => require('../migrations/003_initialize_users.js').down(params)
      },
      {
        name: '004_initialize_comments.js',
        up: async (params) => require('../migrations/004_initialize_comments.js').up(params),
        down: async (params) => require('../migrations/004_initialize_comments.js').down(params)
      },
      {
        name: '005_initialize_profile.js',
        up: async (params) => require('../migrations/005_initialize_profile.js').up(params),
        down: async (params) => require('../migrations/005_initialize_profile.js').down(params)
      }
    ],
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console
  })

  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name)
  })
}

export const connectDb = async (): Promise<void> => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('Connected to Postgres db')
  } catch (error) {
    console.error('Failed to connect to the database:', error)
    throw error
  }
}
