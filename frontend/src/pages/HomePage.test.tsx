import { render, screen } from '@testing-library/react'
import { expect, test, describe, vi } from 'vitest'
import HomePage from './HomePage'

describe('HomePage', () => {
  test('renders welcome heading', () => {
    render(<HomePage user={null} theme="nightsky" setTheme={vi.fn()} />)
    expect(screen.getByText('Welcome to My CV!')).toBeInTheDocument()
  })

  test('renders about me profile section', () => {
    render(<HomePage user={null} theme="nightsky" setTheme={vi.fn()} />)
    expect(screen.getByText('About Me')).toBeInTheDocument()
  })

  test('renders contact information section', () => {
    render(<HomePage user={null} theme="nightsky" setTheme={vi.fn()} />)
    expect(screen.getByText('Contact Information')).toBeInTheDocument()
  })

  test('renders theme selector when user is logged in', () => {
    const mockUser = {
      username: 'testuser',
      token: 'token',
      role: 'USER' as const
    }
    render(<HomePage user={mockUser} theme="nightsky" setTheme={vi.fn()} />)
    expect(screen.getByText('Golden')).toBeInTheDocument()
  })
})
