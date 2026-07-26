import app from './app'
import * as config from './utils/config'
import { connectDb } from './utils/db'

const start = async () => {
  await connectDb()
  app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT} at -> http://localhost:${config.PORT}/`)
  })
}

void start()
