import dotenv from 'dotenv'
dotenv.config()
import { connectDb, sequelize } from './utils/db'
import User from './models/user'
import Comment from './models/comment'
import { Op } from 'sequelize'

const resetTestDb = async (): Promise<void> => {
  if (process.env.NODE_ENV !== 'test') {
    return
  }

  try {
    await connectDb()
    await Comment.destroy({ where: {} })
    await User.destroy({
      where: {
        username: {
          [Op.ne]: 'admin'
        }
      }
    })
  } catch (error) {
    console.error('Error resetting test database:', error)
  } finally {
    await sequelize.close()
  }
}

void resetTestDb()