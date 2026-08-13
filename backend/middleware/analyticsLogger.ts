import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import geoip from 'geoip-lite'
import CountryStat from '../models/countryStat'
import VisitorLog from '../models/visitorLog'

export const analyticsLogger = async (
  request: Request,
  _response: Response,
  next: NextFunction
): Promise<void> => {
  if (request.path.startsWith('/api/analytics')) {
    return next()
  }

  try {
    let rawIp =
      (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      request.socket.remoteAddress ||
      '127.0.0.1'
    if (
      process.env.NODE_ENV === 'development' &&
      (rawIp === '127.0.0.1' || rawIp === '::1' || rawIp.includes('127.0.0.1'))
    ) {
      rawIp = '83.145.201.21'
    }

    const ipHash = crypto.createHash('sha256').update(rawIp).digest('hex')
    const now = new Date()
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const existingLog = await VisitorLog.findOne({ where: { ipHash } })

    if (!existingLog || existingLog.lastVisitedAt < twentyFourHoursAgo) {
      const geo = geoip.lookup(rawIp)
      const countryCode = geo?.country || 'UNKNOWN'
      const countryName = geoCodeToName(countryCode)

      const [stat] = await CountryStat.findOrCreate({
        where: { countryCode },
        defaults: { countryCode, countryName, visitCount: 0 }
      })

      await stat.increment('visitCount', { by: 1 })

      if (existingLog) {
        existingLog.lastVisitedAt = now
        await existingLog.save()
      } else {
        await VisitorLog.create({ ipHash, lastVisitedAt: now })
      }
    }
  } catch (error) {
    console.error('Analytics middleware error:', error)
  } finally {
    next()
  }
}

const geoCodeToName = (code: string): string => {
  if (code === 'UNKNOWN') return 'Unknown Region'
  try {
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
    return regionNames.of(code) || code
  } catch {
    return code
  }
}
