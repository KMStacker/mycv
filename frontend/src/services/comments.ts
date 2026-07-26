import axios from 'axios'

const baseUrl = '/api/comments'

export interface Comment {
  id: number
  content: string
  createdAt: string
  user: {
    username: string
    role: string
  } | null
  isPublic: boolean
  guestName: string | null
  parentId: number | null
}

export const getAll = async (token: string | null = null): Promise<Comment[]> => {
  const config = token
    ? {
        headers: { Authorization: `Bearer ${token}` }
      }
    : {}
  const response = await axios.get<Comment[]>(baseUrl, config)
  return response.data
}

export const create = async (
  content: string,
  isPublic: boolean,
  guestName: string,
  token: string | null,
  parentId: number | null = null
): Promise<Comment> => {
  const config = token
    ? {
        headers: { Authorization: `Bearer ${token}` }
      }
    : {}

  const response = await axios.post<Comment>(
    baseUrl,
    { content, isPublic, guestName, parentId },
    config
  )
  return response.data
}

export const remove = async (id: number, token: string): Promise<void> => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  await axios.delete(`${baseUrl}/${id}`, config)
}

const commentService = { getAll, create, remove }
export default commentService
