import express from 'express'
import Project from '../models/project'
import { adminAuthorization } from '../middleware/adminAuthorization'

const projectsRouter = express.Router()

// get all projects
projectsRouter.get('/', async (_request: express.Request, response: express.Response) => {
  const projects = await Project.findAll({
    order: [
      ['displayOrder', 'ASC'],
      ['id', 'ASC']
    ]
  })
  response.json(projects)
})

// reorder projects
projectsRouter.put(
  '/reorder',
  adminAuthorization,
  async (request: express.Request, response: express.Response) => {
    const { orderedIds } = request.body
    if (!Array.isArray(orderedIds)) {
      return response.status(400).json({ error: 'orderedIds must be an array' })
    }

    for (let i = 0; i < orderedIds.length; i++) {
      await Project.update({ displayOrder: i }, { where: { id: orderedIds[i] } })
    }

    const projects = await Project.findAll({
      order: [
        ['displayOrder', 'ASC'],
        ['id', 'ASC']
      ]
    })
    return response.json(projects)
  }
)

// create new project
projectsRouter.post(
  '/',
  adminAuthorization,
  async (request: express.Request, response: express.Response) => {
    const body = request.body
    if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
      return response.status(400).json({ error: 'title is required' })
    }
    const savedProject = await Project.create({
      title: body.title,
      description: body.description || '',
      technologies: body.technologies || '',
      githubUrl: body.githubUrl || ''
    })
    return response.status(201).json(savedProject)
  }
)

// update project
projectsRouter.put(
  '/:id',
  adminAuthorization,
  async (request: express.Request, response: express.Response) => {
    const projectId = Number(request.params.id)
    const project = await Project.findByPk(projectId)
    if (project) {
      const body = request.body
      project.title = body.title
      project.description = body.description || ''
      project.technologies = body.technologies || ''
      project.githubUrl = body.githubUrl || ''
      await project.save()
      response.json(project)
    } else {
      response.status(404).end()
    }
  }
)

// delete project
projectsRouter.delete(
  '/:id',
  adminAuthorization,
  async (request: express.Request, response: express.Response) => {
    const projectId = Number(request.params.id)
    const project = await Project.findByPk(projectId)
    if (project) {
      await project.destroy()
      response.status(204).end()
    } else {
      response.status(404).end()
    }
  }
)

export default projectsRouter
