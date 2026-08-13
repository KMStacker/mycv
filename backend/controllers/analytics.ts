import express from 'express'
import CountryStat from '../models/countryStat'
import VisitorLog from '../models/visitorLog'
import { adminAuthorization } from '../middleware/adminAuthorization'
import { Op } from 'sequelize'

const analyticsRouter = express.Router()

analyticsRouter.get(
  '/',
  adminAuthorization,
  async (_request: express.Request, response: express.Response, next: express.NextFunction) => {
    try {
      const countryStats = await CountryStat.findAll({
        order: [['visitCount', 'DESC']]
      })

      const totalVisits = countryStats.reduce((sum, stat) => sum + stat.visitCount, 0)

      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const activeLast24h = await VisitorLog.count({
        where: {
          lastVisitedAt: {
            [Op.gte]: twentyFourHoursAgo
          }
        }
      })

      return response.json({
        totalVisits,
        activeLast24h,
        countryStats
      })
    } catch (error) {
      return next(error)
    }
  }
)

export default analyticsRouter
