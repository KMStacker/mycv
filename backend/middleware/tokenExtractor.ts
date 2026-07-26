import { NextFunction, Request, Response } from 'express'

export interface CustomRequest extends Request {
  token?: string
}

const tokenExtractor = (request: CustomRequest, _response: Response, next: NextFunction) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}

export default tokenExtractor
