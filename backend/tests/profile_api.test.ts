import { beforeEach, describe, test, expect, afterAll, beforeAll } from '@jest/globals'
import supertest from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../app'
import Profile from '../models/profile'
import User from '../models/user'
import { sequelize, connectDb } from '../utils/db'
import * as config from '../utils/config'

const api = supertest(app)

let adminToken: string
let userToken: string

beforeAll(async () => {
  await connectDb()
})

beforeEach(async () => {
  await Profile.destroy({ where: {} })
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

describe('profile api', () => {
  test('get profile returns 404 when no profile exists', async () => {
    await api.get('/api/profile').expect(404)
  })

  test('get profile returns profile data when profile exists', async () => {
    await Profile.create({
      name: 'Test Name',
      email: 'test@example.com',
      aboutText: 'Developer'
    })

    const response = await api
      .get('/api/profile')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.name).toBe('Test Name')
    expect(response.body.email).toBe('test@example.com')
  })

  test('put profile creates new profile when none exists if admin', async () => {
    const newProfile = {
      name: 'New Admin',
      email: 'admin@example.com',
      aboutText: 'System Admin'
    }

    const response = await api
      .put('/api/profile')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newProfile)
      .expect(200)

    expect(response.body.name).toBe('New Admin')

    const profiles = await Profile.findAll()
    expect(profiles).toHaveLength(1)
  })

  test('put profile updates existing profile when admin', async () => {
    await Profile.create({
      name: 'Old Name',
      email: 'old@example.com'
    })

    const updatedProfile = {
      name: 'Updated Name'
    }

    const response = await api
      .put('/api/profile')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updatedProfile)
      .expect(200)

    expect(response.body.name).toBe('Updated Name')
    expect(response.body.email).toBe('old@example.com')
  })

  test('put profile fails without admin authorization', async () => {
    await api
      .put('/api/profile')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Unauthorized' })
      .expect(403)
  })
})

afterAll(async () => {
  await sequelize.close()
})
