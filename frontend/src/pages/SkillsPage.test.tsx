import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi, beforeEach, describe } from 'vitest'
import axios from 'axios'
import SkillsPage from './SkillsPage'

vi.mock('axios')

const mockSkills = [
  {
    id: 1,
    name: 'GoLang',
    level: 'Expert',
    usedOn: 'Backend'
  },
  {
    id: 2,
    name: 'React',
    level: 'Intermediate',
    usedOn: 'Frontend'
  }
]

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(axios.get).mockResolvedValue({ data: mockSkills })
})

describe('SkillsPage', () => {
  test('renders page title and fetches skills successfully', async () => {
    render(<SkillsPage />)
    const skillNames = await screen.findAllByText('GoLang')
    expect(skillNames.length).toBeGreaterThan(0)
    expect(screen.getByText(/SKILLS\/\/SHOWCASE/i)).toBeInTheDocument()
  })

  test('displays first skill details by default', async () => {
    render(<SkillsPage />)
    await screen.findAllByText('GoLang')
    expect(screen.getByText(/LEVEL:\s*Expert/i)).toBeInTheDocument()
    expect(screen.getByText(/USED ON:\s*Backend/i)).toBeInTheDocument()
  })

  test('navigates between skills when clicking the next and previous buttons', async () => {
    render(<SkillsPage />)
    await screen.findAllByText('GoLang')

    const reactSidebarButton = screen.getByRole('button', { name: 'React' })
    await userEvent.click(reactSidebarButton)

    expect(screen.getByText(/LEVEL:\s*Intermediate/i)).toBeInTheDocument()
    expect(screen.getByText(/USED ON:\s*Frontend/i)).toBeInTheDocument()

    const prevButton = screen.getByRole('button', { name: /previous skill/i })
    await userEvent.click(prevButton)

    expect(screen.getByText(/LEVEL:\s*Expert/i)).toBeInTheDocument()
  })
})
