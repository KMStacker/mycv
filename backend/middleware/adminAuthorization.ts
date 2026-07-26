import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { CustomRequest } from './tokenExtractor'
import * as config from '../utils/config'

export const adminAuthorization = (
  request: CustomRequest,
  _response: Response,
  next: NextFunction
) => {
  try {
    const token = request.token
    if (!token) {
      return next({
        name: 'JsonWebTokenError',
        message: 'token missing'
      })
    }

    const decodedToken = jwt.verify(token, config.SECRET || '') as jwt.JwtPayload
    if (!decodedToken.id || decodedToken.role !== 'ADMIN') {
      return next({
        name: 'AuthorizationError',
        message: 'admin access required'
      })
    }

    next()
  } catch (error) {
    next(error)
  }
}
