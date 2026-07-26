import express from 'express'
import Profile from '../models/profile'
import { adminAuthorization } from '../middleware/adminAuthorization'

const profileRouter = express.Router()

profileRouter.get('/', async (_request: express.Request, response: express.Response) => {
  const profile = await Profile.findOne()
  if (profile) {
    response.json(profile)
  } else {
    response.status(404).end()
  }
})

profileRouter.put(
  '/',
  adminAuthorization,
  async (request: express.Request, response: express.Response) => {
    let profile = await Profile.findOne()
    const { name, email, phone, aboutText, location, githubUrl, status } = request.body

    if (!profile) {
      profile = await Profile.create({ name, email, phone, aboutText, location, githubUrl, status })
    } else {
      profile.name = name !== undefined ? name : profile.name
      profile.email = email !== undefined ? email : profile.email
      profile.phone = phone !== undefined ? phone : profile.phone
      profile.aboutText = aboutText !== undefined ? aboutText : profile.aboutText
      profile.location = location !== undefined ? location : profile.location
      profile.githubUrl = githubUrl !== undefined ? githubUrl : profile.githubUrl
      profile.status = status !== undefined ? status : profile.status
      await profile.save()
    }
    response.json(profile)
  }
)

export default profileRouter
