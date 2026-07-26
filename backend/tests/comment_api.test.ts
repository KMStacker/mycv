import { beforeEach, describe, test, expect, afterAll, beforeAll } from '@jest/globals'
import supertest from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../app'
import Comment from '../models/comment'
import User from '../models/user'
import { sequelize, connectDb } from '../utils/db'
import * as config from '../utils/config'

const api = supertest(app)

let userToken: string
let adminToken: string
let testUser: any

beforeAll(async () => {
  await connectDb()
})

beforeEach(async () => {
  await Comment.destroy({ where: {} })
  await User.destroy({ where: {} })

  testUser = await User.create({
    username: 'testuser',
    passwordHash: '12345',
    role: 'USER'
  })

  const adminUser = await User.create({
    username: 'admin',
    passwordHash: '12345',
    role: 'ADMIN'
  })

  userToken = jwt.sign(
    { username: testUser.username, id: testUser.id, role: testUser.role },
    config.SECRET || ''
  )

  adminToken = jwt.sign(
    { username: adminUser.username, id: adminUser.id, role: adminUser.role },
    config.SECRET || ''
  )
})

describe('comments api', () => {
  test('get all comments returns comments with user attributes', async () => {
    await Comment.create({
      content: 'Hello world',
      userId: testUser.id
    })

    const response = await api
      .get('/api/comments')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(1)
    expect(response.body[0].content).toBe('Hello world')
    expect(response.body[0].user).toBeDefined()
    expect(response.body[0].user.username).toBe('testuser')
  })

  test('create comment succeeds with valid token', async () => {
    const newComment = {
      content: 'Nice portfolio!'
    }

    const response = await api
      .post('/api/comments')
      .set('Authorization', `Bearer ${userToken}`)
      .send(newComment)
      .expect(201)

    expect(response.body.content).toBe('Nice portfolio!')
    expect(response.body.user.username).toBe('testuser')

    const commentsAtEnd = await Comment.findAll()
    expect(commentsAtEnd).toHaveLength(1)
  })

  test('create comment succeeds without token as guest', async () => {
    const newComment = {
      content: 'Unauthenticated comment'
    }

    const response = await api.post('/api/comments').send(newComment).expect(201)

    expect(response.body.guestName).toMatch(/^Guest_/)

    const commentsAtEnd = await Comment.findAll()
    expect(commentsAtEnd).toHaveLength(1)
  })

  test('create comment fails with empty content', async () => {
    const newComment = {
      content: '   '
    }

    await api
      .post('/api/comments')
      .set('Authorization', `Bearer ${userToken}`)
      .send(newComment)
      .expect(400)
  })

  test('admin can delete a comment', async () => {
    const comment = await Comment.create({
      content: 'To be deleted',
      userId: testUser.id
    })

    await api
      .delete(`/api/comments/${comment.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204)

    const commentsAtEnd = await Comment.findAll()
    expect(commentsAtEnd).toHaveLength(0)
  })
})

afterAll(async () => {
  await sequelize.close()
})
