import { render, screen } from '@testing-library/react'
import { expect, test, describe, vi, beforeEach } from 'vitest'
import axios from 'axios'
import HomePage from './HomePage'

vi.mock('axios')

const mockProfile = {
  name: 'Kyösti Männistö',
  email: 'kmannisto@hotmail.com',
  phone: '+358 50 5179151',
  aboutText: 'Software developer with a Master of Laws degree.',
  location: 'Espoo, Finland',
  githubUrl: 'https://github.com/KMStacker',
  status: 'Open for Software Engineering Opportunities'
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(axios.get).mockResolvedValue({ data: mockProfile })
})

describe('HomePage', () => {
  test('renders welcome heading and introduction text', async () => {
    render(<HomePage />)
    expect(screen.getByText(/WELCOME\/\/TO MY-CV/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Welcome to My CV portfolio! Feel free to look around and leave a message in the Guestbook!/i)
    ).toBeInTheDocument()
  })

  test('fetches and renders about me section content', async () => {
    render(<HomePage />)
    expect(screen.getByText(/ABOUT ME/i)).toBeInTheDocument()
    expect(
      await screen.findByText('Software developer with a Master of Laws degree.')
    ).toBeInTheDocument()
  })

  test('fetches and renders contact information details correctly', async () => {
    render(<HomePage />)
    expect(screen.getByText(/CONTACT INFO/i)).toBeInTheDocument()
    expect(await screen.findByText(/Name: Kyösti Männistö/i)).toBeInTheDocument()
    expect(screen.getByText(/Email: kmannisto@hotmail.com/i)).toBeInTheDocument()
    expect(screen.getByText(/Phone: \+358 50 5179151/i)).toBeInTheDocument()
    expect(screen.getByText(/Location: Espoo, Finland/i)).toBeInTheDocument()
  })

  test('renders profile directly when provided via props without making an API call', () => {
    render(<HomePage profileData={mockProfile} />)
    expect(axios.get).not.toHaveBeenCalled()
    expect(screen.getByText('Software developer with a Master of Laws degree.')).toBeInTheDocument()
    expect(screen.getByText(/Name: Kyösti Männistö/i)).toBeInTheDocument()
  })

  test('renders operative terminal hero component with active status', () => {
    render(<HomePage profileData={mockProfile} />)
    expect(screen.getByText(/OPERATIVE_STATUS_CONSOLE\/\//i)).toBeInTheDocument()
    expect(screen.getByText(/ONLINE/i)).toBeInTheDocument()
  })
})
