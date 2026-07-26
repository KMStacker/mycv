import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi, beforeEach, describe } from 'vitest'
import commentService from '../services/comments'
import GuestbookPage from './GuestbookPage'

vi.mock('../services/comments')

const mockUser = {
  username: 'testuser',
  token: 'user-token',
  role: 'USER' as const
}

const mockComments = [
  {
    id: 1,
    content: 'Fun to be here!',
    createdAt: '2025-01-01T12:00:00.000Z',
    user: { username: 'testuser1', role: 'USER' },
    isPublic: true,
    guestName: null,
    parentId: null
  }
]

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(commentService.getAll).mockResolvedValue(mockComments)
})

describe('GuestbookPage', () => {
  test('fetches and renders existing visitor comments', async () => {
    render(<GuestbookPage user={null} handleLogin={vi.fn()} />)
    expect(screen.getByText('Guestbook')).toBeInTheDocument()
    const comment = await screen.findByText(/Fun to be here!/)
    expect(comment).toBeInTheDocument()
    expect(screen.getByText('testuser1')).toBeInTheDocument()
  })

  test('shows comment input form only when a user is logged in', async () => {
    const { rerender } = render(<GuestbookPage user={null} handleLogin={vi.fn()} />)
    expect(screen.queryByPlaceholderText('Write a comment...')).not.toBeInTheDocument()

    rerender(<GuestbookPage user={mockUser} handleLogin={vi.fn()} />)
    expect(screen.getByPlaceholderText('Write a comment...')).toBeInTheDocument()
  })

  test('submits a new comment successfully and updates layout feed', async () => {
    vi.mocked(commentService.create).mockResolvedValueOnce({
      id: 2,
      content: 'Super to be here!',
      createdAt: '2025-01-02T12:00:00.000Z',
      user: { username: 'testuser2', role: 'USER' },
      isPublic: true,
      guestName: null,
      parentId: null
    })

    render(<GuestbookPage user={mockUser} handleLogin={vi.fn()} />)
    const input = screen.getByPlaceholderText('Write a comment...')
    const postButton = screen.getByRole('button', { name: /post/i })

    await userEvent.type(input, 'Super to be here!')
    await userEvent.click(postButton)

    expect(commentService.create).toHaveBeenCalledWith(
      'Super to be here!',
      true,
      '',
      'user-token',
      null
    )
    expect(await screen.findByText(/Super to be here!/)).toBeInTheDocument()
  })
})
