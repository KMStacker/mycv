import express from 'express'
import path from 'path'
import projectsRouter from './controllers/projects'
import skillsRouter from './controllers/skills'
import tokenExtractor from './middleware/tokenExtractor'
import unknownEndpoint from './middleware/unknownEndpoint'
import errorHandler from './middleware/errorHandler'
import usersRouter from './controllers/users'
import loginRouter from './controllers/login'
import requestLogger from './middleware/requestLogger'
import commentsRouter from './controllers/comments'
import profileRouter from './controllers/profiles'

const app = express()

app.use(express.json())

app.use(requestLogger)
app.use(tokenExtractor)

app.use('/api/projects', projectsRouter)
app.use('/api/skills', skillsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/profile', profileRouter)

app.use(express.static(path.join(__dirname, '../../frontend/dist')))

app.get(/.*/, (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next()
  }
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'))
})

app.use(unknownEndpoint)
app.use(errorHandler)

export default app
