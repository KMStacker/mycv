import express from 'express'
import bcrypt from 'bcrypt'
import User from '../models/user'
import Comment from '../models/comment'
import { adminAuthorization } from '../middleware/adminAuthorization'

const usersRouter = express.Router()

usersRouter.get(
  '/',
  adminAuthorization,
  async (_request: express.Request, response: express.Response, next: express.NextFunction) => {
    try {
      const users = await User.findAll({ order: [['id', 'ASC']] })
      const usersWithStats = await Promise.all(
        users.map(async (u) => {
          const count = await Comment.count({ where: { userId: u.id } })
          return {
            id: u.id,
            username: u.username,
            role: u.role,
            commentingDisabled: u.commentingDisabled,
            commentCount: count
          }
        })
      )
      return response.json(usersWithStats)
    } catch (error) {
      return next(error)
    }
  }
)

usersRouter.put(
  '/:id/comments-status',
  adminAuthorization,
  async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    try {
      const user = await User.findByPk(Number(request.params.id))
      if (!user) {
        return response.status(404).json({ error: 'user not found' })
      }
      if (user.role === 'ADMIN') {
        return response.status(403).json({ error: 'cannot modify admin commenting status' })
      }
      user.commentingDisabled = !user.commentingDisabled
      await user.save()

      const count = await Comment.count({ where: { userId: user.id } })

      return response.json({
        id: user.id,
        username: user.username,
        role: user.role,
        commentingDisabled: user.commentingDisabled,
        commentCount: count
      })
    } catch (error) {
      return next(error)
    }
  }
)

usersRouter.post(
  '/',
  async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    try {
      const { username, password } = request.body

      if (!username || typeof username !== 'string' || username.trim().length < 3) {
        return response.status(400).json({ error: 'username must be at least 3 characters long' })
      }
      if (username.trim().toLowerCase().startsWith('guest_')) {
        return response.status(400).json({ error: 'Usernames starting with guest_ are reserved' })
      }
      if (!password || typeof password !== 'string' || password.length < 5) {
        return response.status(400).json({ error: 'password must be at least 5 characters long' })
      }

      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)
      const savedUser = await User.create({
        username: username.trim(),
        passwordHash
      })

      return response.status(201).json({
        id: savedUser.id,
        username: savedUser.username,
        role: savedUser.role
      })
    } catch (error) {
      return next(error)
    }
  }
)

export default usersRouter
