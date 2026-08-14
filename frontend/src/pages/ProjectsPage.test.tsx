import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi, beforeEach, describe } from 'vitest'
import axios from 'axios'
import ProjectsPage from './ProjectsPage'

vi.mock('axios')

const mockProjects = [
  {
    id: 1,
    title: 'First App',
    description: 'First description',
    technologies: 'Node, React',
    githubUrl: 'https://github.com/test'
  },
  {
    id: 2,
    title: 'Second App',
    description: 'Second description',
    technologies: 'Go, TypeScript',
    githubUrl: 'https://github.com/test2'
  }
]

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(axios.get).mockResolvedValue({ data: mockProjects })
})

describe('ProjectsPage', () => {
  test('renders page title and fetches projects successfully', async () => {
    render(<ProjectsPage />)
    const projectTitles = await screen.findAllByText('First App')
    expect(projectTitles.length).toBeGreaterThan(0)
    expect(screen.getByText(/PROJECTS\/\/SHOWCASE/i)).toBeInTheDocument()
  })

  test('displays first project details by default', async () => {
    render(<ProjectsPage />)
    await screen.findAllByText('First App')
    expect(screen.getByText('First description')).toBeInTheDocument()
    expect(screen.getByText('Node')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  test('navigates between projects when clicking the next and previous buttons', async () => {
    render(<ProjectsPage />)
    await screen.findAllByText('First App')

    const secondAppSidebarButton = screen.getByRole('button', { name: 'Second App' })
    await userEvent.click(secondAppSidebarButton)

    expect(screen.getByText('Second description')).toBeInTheDocument()

    const prevButton = screen.getByRole('button', { name: /previous project/i })
    await userEvent.click(prevButton)

    expect(screen.getByText('First description')).toBeInTheDocument()
  })
})
