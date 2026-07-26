import express from 'express'
import jwt from 'jsonwebtoken'
import { Op } from 'sequelize'
import Comment from '../models/comment'
import User from '../models/user'
import * as config from '../utils/config'
import { CustomRequest } from '../middleware/tokenExtractor'
import { adminAuthorization } from '../middleware/adminAuthorization'

const commentsRouter = express.Router()

commentsRouter.get('/', async (request: CustomRequest, response: express.Response) => {
  let whereClause = {}
  const token = request.token

  if (token) {
    try {
      const decodedToken = jwt.verify(token, config.SECRET || '') as jwt.JwtPayload
      if (decodedToken.role !== 'ADMIN') {
        whereClause = {
          [Op.or]: [{ isPublic: true }, { userId: decodedToken.id }]
        }
      }
    } catch (error) {
      whereClause = { isPublic: true }
    }
  } else {
    whereClause = { isPublic: true }
  }

  const comments = await Comment.findAll({
    where: whereClause,
    include: {
      model: User,
      as: 'user',
      attributes: ['username', 'role']
    },
    order: [['createdAt', 'DESC']]
  })
  response.json(comments)
})

commentsRouter.post(
  '/',
  async (request: CustomRequest, response: express.Response, next: express.NextFunction) => {
    try {
      const token = request.token
      let userId = null

      if (token) {
        try {
          const decodedToken = jwt.verify(token, config.SECRET || '') as jwt.JwtPayload
          if (decodedToken.id) {
            userId = decodedToken.id

            const checkUser = await User.findByPk(userId)
            if (checkUser && checkUser.commentingDisabled) {
              return response
                .status(403)
                .json({ error: 'Your commenting privileges have been disabled by an admin.' })
            }
          }
        } catch (error) {
          return response.status(401).json({ error: 'invalid token' })
        }
      }

      const { content, isPublic, guestName, parentId } = request.body

      if (!content || typeof content !== 'string' || content.trim() === '') {
        return response.status(400).json({ error: 'content is required' })
      }

      let validParentId = null
      if (parentId) {
        const parentComment = await Comment.findByPk(parentId)
        if (!parentComment) {
          return response.status(400).json({ error: 'parent comment not found' })
        }
        validParentId = parentComment.id
      }

      const savedComment = await Comment.create({
        content: content.trim(),
        userId: userId,
        isPublic: isPublic !== undefined ? isPublic : true,
        guestName: '',
        parentId: validParentId
      })

      if (!userId) {
        const suffix = guestName ? guestName.trim() : ''
        savedComment.guestName = `Guest_${savedComment.id}${suffix ? ' (' + suffix + ')' : ''}`
        await savedComment.save()
      }

      const completeComment = await Comment.findByPk(savedComment.id, {
        include: {
          model: User,
          as: 'user',
          attributes: ['username', 'role']
        }
      })

      return response.status(201).json(completeComment)
    } catch (error) {
      return next(error)
    }
  }
)

commentsRouter.delete(
  '/:id',
  adminAuthorization,
  async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    try {
      const commentId = Number(request.params.id)
      const comment = await Comment.findByPk(commentId)

      if (comment) {
        await comment.destroy()
        return response.status(204).end()
      } else {
        return response.status(404).end()
      }
    } catch (error) {
      return next(error)
    }
  }
)

export default commentsRouter
