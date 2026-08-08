import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi, beforeEach, describe } from 'vitest'
import axios from 'axios'
import AdminPage from './AdminPage'

vi.mock('axios')

const mockUser = {
  username: 'admin',
  token: 'admin-token',
  role: 'ADMIN' as const
}

const mockProjects = [
  { id: 1, title: 'Project A', description: 'Desc A', technologies: 'React A', githubUrl: 'url A' }
]

const mockSkills = [{ id: 1, name: 'Skill A', level: 'Advanced A', usedOn: 'Backend A' }]

const mockUsers = [
  { id: 1, username: 'testuser', role: 'USER', commentingDisabled: false, commentCount: 5 },
  { id: 2, username: 'banneduser', role: 'USER', commentingDisabled: true, commentCount: 0 }
]

const mockAnalytics = {
  totalVisits: 10,
  activeLast24h: 3,
  countryStats: [{ id: 1, countryCode: 'FI', countryName: 'Finland', visitCount: 10 }]
}

beforeEach(() => {
  vi.clearAllMocks()

  vi.mocked(axios.get).mockImplementation((url: string) => {
    if (url && typeof url === 'string') {
      if (url.includes('projects')) return Promise.resolve({ data: mockProjects })
      if (url.includes('skills')) return Promise.resolve({ data: mockSkills })
      if (url.includes('users')) return Promise.resolve({ data: mockUsers })
      if (url.includes('analytics')) return Promise.resolve({ data: mockAnalytics })
    }
    return Promise.resolve({ data: [] })
  })

  vi.mocked(axios.post).mockResolvedValue({ data: {} })

  vi.mocked(axios.put).mockImplementation((url: string) => {
    if (url && typeof url === 'string' && url.includes('comments-status')) {
      return Promise.resolve({
        data: {
          id: 1,
          username: 'testuser',
          role: 'USER',
          commentingDisabled: true,
          commentCount: 5
        }
      })
    }
    return Promise.resolve({ data: {} })
  })

  vi.mocked(axios.delete).mockResolvedValue({ data: {} })
})

describe('AdminPage', () => {
  test('renders page headers and fetches resource listings successfully', async () => {
    render(<AdminPage user={mockUser} />)
    expect(screen.getByText('This is the admin page!')).toBeInTheDocument()

    expect(await screen.findByText('Project A')).toBeInTheDocument()
    expect(await screen.findByText('Skill A')).toBeInTheDocument()
    expect(await screen.findByText('testuser')).toBeInTheDocument()
  })

  test('toggles the project creation form visibility when clicking buttons', async () => {
    render(<AdminPage user={mockUser} />)

    const toggleButton = screen.getByRole('button', { name: /add new project/i })
    await userEvent.click(toggleButton)

    expect(await screen.findByText(/Here you can add a new project:/i)).toBeInTheDocument()

    const stopButton = screen.getByRole('button', { name: /stop adding new project/i })
    await userEvent.click(stopButton)

    await waitFor(() => {
      expect(screen.queryByText(/Here you can add a new project:/i)).not.toBeInTheDocument()
    })
  })

  test('calls axios.delete with correct headers when project delete button is clicked', async () => {
    render(<AdminPage user={mockUser} />)

    await screen.findByText('Project A')
    await screen.findByText('Skill A')

    const deleteButtons = await screen.findAllByRole('button', { name: /delete/i })
    const projectDeleteButton = deleteButtons[0]

    await userEvent.click(projectDeleteButton)

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith('/api/projects/1', {
        headers: { Authorization: 'Bearer admin-token' }
      })
    })
  })

  test('admin can view users and toggle their ban status', async () => {
    render(<AdminPage user={mockUser} />)

    expect(await screen.findByText('testuser')).toBeInTheDocument()
    expect(screen.getByText('banneduser')).toBeInTheDocument()

    expect(screen.getByText('Banned')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()

    const banButton = screen.getByText('Ban User')
    await userEvent.click(banButton)

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        '/api/users/1/comments-status',
        {},
        { headers: { Authorization: 'Bearer admin-token' } }
      )
    })
  })

  test('admin can toggle user contact information visibility', async () => {
    const mockUsersWithDetails = [
      {
        id: 1,
        username: 'userinfo',
        role: 'USER',
        commentingDisabled: false,
        commentCount: 2,
        fullName: 'User User',
        email: 'user@example.com',
        phone: '0401234567'
      }
    ]

    vi.mocked(axios.get).mockImplementation((url: string) => {
      if (url.includes('users')) return Promise.resolve({ data: mockUsersWithDetails })
      return Promise.resolve({ data: [] })
    })

    render(<AdminPage user={mockUser} />)

    expect(await screen.findByText('userinfo')).toBeInTheDocument()
    expect(screen.queryByText('Email: user@example.com')).not.toBeInTheDocument()

    const showInfoBtn = screen.getByRole('button', { name: 'Show Info' })
    await userEvent.click(showInfoBtn)

    expect(screen.getByText('Name: User User')).toBeInTheDocument()
    expect(screen.getByText('Email: user@example.com')).toBeInTheDocument()
    expect(screen.getByText('Phone: 0401234567')).toBeInTheDocument()

    const hideInfoBtn = screen.getByRole('button', { name: 'Hide Info' })
    await userEvent.click(hideInfoBtn)

    expect(screen.queryByText('Email: user@example.com')).not.toBeInTheDocument()
  })
})
