import { NextFunction, Request, Response } from 'express'
import * as logger from '../utils/logger'

const errorHandler = (
  error: Error,
  _request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    return response.status(400).json({ error: 'username must be unique' })
  } else if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'AuthorizationError') {
    return response.status(403).json({ error: 'forbidden: admin access required' })
  }

  next(error)
}

export default errorHandler
