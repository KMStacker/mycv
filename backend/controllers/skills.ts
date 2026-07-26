import express from 'express'
import Skill from '../models/skill'
import { adminAuthorization } from '../middleware/adminAuthorization'

const skillsRouter = express.Router()

// get all skills
skillsRouter.get('/', async (_request: express.Request, response: express.Response) => {
  const skills = await Skill.findAll({
    order: [
      ['displayOrder', 'ASC'],
      ['id', 'ASC']
    ]
  })
  response.json(skills)
})

// reorder skills
skillsRouter.put(
  '/reorder',
  adminAuthorization,
  async (request: express.Request, response: express.Response) => {
    const { orderedIds } = request.body
    if (!Array.isArray(orderedIds)) {
      return response.status(400).json({ error: 'orderedIds must be an array' })
    }

    for (let i = 0; i < orderedIds.length; i++) {
      await Skill.update({ displayOrder: i }, { where: { id: orderedIds[i] } })
    }

    const skills = await Skill.findAll({
      order: [
        ['displayOrder', 'ASC'],
        ['id', 'ASC']
      ]
    })
    return response.json(skills)
  }
)

// create new skill
skillsRouter.post(
  '/',
  adminAuthorization,
  async (request: express.Request, response: express.Response) => {
    const body = request.body
    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      return response.status(400).json({ error: 'name is required' })
    }
    const savedSkill = await Skill.create({
      name: body.name,
      level: body.level,
      usedOn: body.usedOn || ''
    })
    return response.status(201).json(savedSkill)
  }
)

// update skill
skillsRouter.put(
  '/:id',
  adminAuthorization,
  async (request: express.Request, response: express.Response) => {
    const skillId = Number(request.params.id)
    const skill = await Skill.findByPk(skillId)
    if (skill) {
      const body = request.body
      skill.name = body.name
      skill.level = body.level
      skill.usedOn = body.usedOn || ''
      await skill.save()
      response.json(skill)
    } else {
      response.status(404).end()
    }
  }
)

// delete skill
skillsRouter.delete(
  '/:id',
  adminAuthorization,
  async (request: express.Request, response: express.Response) => {
    const skillId = Number(request.params.id)
    const skill = await Skill.findByPk(skillId)
    if (skill) {
      await skill.destroy()
      response.status(204).end()
    } else {
      response.status(404).end()
    }
  }
)

export default skillsRouter
