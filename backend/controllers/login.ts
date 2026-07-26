import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '../models/user'
import * as config from '../utils/config'
import express from 'express'

const loginRouter = express.Router()

loginRouter.post('/', async (request: express.Request, response: express.Response) => {
  const { username, password } = request.body
  const user = await User.findOne({ where: { username } })
  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }
  const userForToken = {
    username: user.username,
    id: user.id,
    role: user.role
  }
  const token = jwt.sign(userForToken, config.SECRET || '', { expiresIn: 60 * 60 })
  return response.status(200).send({ token, username: user.username, role: user.role })
})

export default loginRouter
