import { beforeEach, describe, test, expect, afterAll, beforeAll } from '@jest/globals'
import supertest from 'supertest'
import bcrypt from 'bcrypt'
import app from '../app'
import User from '../models/user'
import { sequelize, connectDb } from '../utils/db'

const api = supertest(app)

beforeAll(async () => {
  await connectDb()
})

beforeEach(async () => {
  await User.destroy({ where: {} })

  const passwordHash = await bcrypt.hash('secretpass', 10)
  await User.create({
    username: 'testlogin',
    passwordHash,
    role: 'USER'
  })
})

describe('login endpoint', () => {
  test('succeeds with valid credentials', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'testlogin', password: 'secretpass' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.token).toBeDefined()
    expect(response.body.username).toBe('testlogin')
    expect(response.body.role).toBe('USER')
  })

  test('fails with wrong password', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'testlogin', password: 'wrongpassword' })
      .expect(401)

    expect(response.body.error).toBe('invalid username or password')
  })

  test('fails with non-existent user', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'nobody', password: 'secretpass' })
      .expect(401)

    expect(response.body.error).toBe('invalid username or password')
  })
})

afterAll(async () => {
  await sequelize.close()
})
