import dotenv from 'dotenv'
dotenv.config()

export const PORT = process.env.PORT
if (!PORT) {
  console.error('PORT is not defined in .env')
}

export const DATABASE_URL =
  process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('DATABASE_URL is not defined in .env')
}

export const SECRET = process.env.SECRET
if (!SECRET) {
  console.error('SECRET is not defined in .env')
}

export const ADMIN_PSW = process.env.ADMIN_PSW
if (!ADMIN_PSW) {
  console.error('ADMIN_PSW is not defined in .env')
}
