import { beforeEach, describe, test, expect, afterAll, beforeAll } from '@jest/globals'
import supertest from 'supertest'
import app from '../app'
import User from '../models/user'
import { sequelize, connectDb } from '../utils/db'
import jwt from 'jsonwebtoken'
import * as config from '../utils/config'

const api = supertest(app)

let adminToken: string
let userToken: string
let normalUser: any

beforeAll(async () => {
  await connectDb()
})

beforeEach(async () => {
  await User.destroy({ where: {} })

  const adminUser = await User.create({
    username: 'admin',
    passwordHash: '12345',
    role: 'ADMIN'
  })

  normalUser = await User.create({
    username: 'testuser',
    passwordHash: '12345',
    role: 'USER'
  })

  adminToken = jwt.sign(
    { username: adminUser.username, id: adminUser.id, role: adminUser.role },
    config.SECRET || ''
  )

  userToken = jwt.sign(
    { username: normalUser.username, id: normalUser.id, role: normalUser.role },
    config.SECRET || ''
  )
})

describe('user registration endpoint', () => {
  test('successfully creates a new user with valid data', async () => {
    const newUser = {
      username: 'newuser',
      password: 'newpassword'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    expect(response.body.username).toBe('newuser')
    expect(response.body.role).toBe('USER')

    const usersInDb = await User.findAll()
    expect(usersInDb).toHaveLength(3)

    const usernames = usersInDb.map(u => u.username)
    expect(usernames).toContain('newuser')
  })

  test('returns 400 when username is too short', async () => {
    const invalidUser = {
      username: 'us',
      password: 'testpassword'
    }

    const response = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)

    expect(response.body.error).toContain('username must be at least 3 characters long')
  })

  test('admin can fetch user list with statistics', async () => {
    const response = await api
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(2)
  })

  test('admin can toggle user commenting status', async () => {
    const response = await api
      .put(`/api/users/${normalUser.id}/comments-status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)

    expect(response.body.commentingDisabled).toBe(true)
  })

  test('normal user cannot fetch user list', async () => {
    await api
      .get('/api/users')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403)
  })
})

afterAll(async () => {
  await sequelize.close()
})