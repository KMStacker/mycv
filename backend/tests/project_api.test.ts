import { beforeEach, describe, test, expect, afterAll, beforeAll } from '@jest/globals'
import supertest from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../app'
import Project from '../models/project'
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
  await Project.destroy({ where: {} })
  await User.destroy({ where: {} })

  const adminUser = await User.create({
    username: 'testadmin',
    passwordHash: '12345',
    role: 'ADMIN'
  })

  const normalUser = await User.create({
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

describe('projects api', () => {
  test('get all projects returns empty list initially', async () => {
    const response = await api.get('/api/projects').expect(200)
    expect(response.body).toHaveLength(0)
  })

  test('create project fails without token', async () => {
    const newProject = {
      title: 'Just Some Title',
      description: 'Just some Description',
      technologies: 'Node, React',
      githubUrl: 'https://github.com'
    }
    await api.post('/api/projects').send(newProject).expect(401)
  })

  test('create project succeeds with valid admin token', async () => {
    const newProject = {
      title: 'Admin Title',
      description: 'Admin test',
      technologies: 'Node, React',
      githubUrl: 'https://github.com'
    }
    const response = await api
      .post('/api/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newProject)
      .expect(201)

    expect(response.body.title).toBe('Admin Title')
    const projects = await Project.findAll()
    expect(projects).toHaveLength(1)
  })

  test('create project fails with standard user token', async () => {
    const newProject = {
      title: 'User Title',
      description: 'User test',
      technologies: 'Node, React',
      githubUrl: 'https://github.com'
    }
    await api
      .post('/api/projects')
      .set('Authorization', `Bearer ${userToken}`)
      .send(newProject)
      .expect(403)

    const projects = await Project.findAll()
    expect(projects).toHaveLength(0)
  })

  test('admin can reorder projects', async () => {
    const p1 = await Project.create({
      title: 'P1',
      description: '',
      technologies: '',
      githubUrl: '',
      displayOrder: 0
    })
    const p2 = await Project.create({
      title: 'P2',
      description: '',
      technologies: '',
      githubUrl: '',
      displayOrder: 1
    })

    const response = await api
      .put('/api/projects/reorder')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ orderedIds: [p2.id, p1.id] })
      .expect(200)

    expect(response.body[0].title).toBe('P2')
    expect(response.body[1].title).toBe('P1')
  })
})

afterAll(async () => {
  await sequelize.close()
})
