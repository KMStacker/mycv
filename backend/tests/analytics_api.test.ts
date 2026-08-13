import { beforeEach, describe, test, expect, afterAll, beforeAll } from '@jest/globals'
import supertest from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../app'
import User from '../models/user'
import CountryStat from '../models/countryStat'
import VisitorLog from '../models/visitorLog'
import { sequelize, connectDb } from '../utils/db'
import * as config from '../utils/config'

const api = supertest(app)

let adminToken: string
let userToken: string

beforeAll(async () => {
  await connectDb()
})

beforeEach(async () => {
  await VisitorLog.destroy({ where: {} })
  await CountryStat.destroy({ where: {} })
  await User.destroy({ where: {} })

  const adminUser = await User.create({
    username: 'admin',
    passwordHash: '12345',
    role: 'ADMIN'
  })

  const normalUser = await User.create({
    username: 'user',
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

describe('analytics api integration tests', () => {
  test('fetching analytics fails without token with status 401', async () => {
    await api.get('/api/analytics').expect(401)
  })

  test('fetching analytics fails for standard user with status 403', async () => {
    await api.get('/api/analytics').set('Authorization', `Bearer ${userToken}`).expect(403)
  })

  test('admin can fetch analytics summary successfully', async () => {
    await CountryStat.create({
      countryCode: 'FI',
      countryName: 'Finland',
      visitCount: 5
    })

    const response = await api
      .get('/api/analytics')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.totalVisits).toBe(5)
    expect(response.body.countryStats).toHaveLength(1)
    expect(response.body.countryStats[0].countryCode).toBe('FI')
  })
})

afterAll(async () => {
  await sequelize.close()
})
