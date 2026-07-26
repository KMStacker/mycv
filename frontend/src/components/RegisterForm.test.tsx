import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { expect, test, vi, beforeEach } from 'vitest'
import axios from 'axios'
import RegisterForm from './RegisterForm'

vi.mock('axios')

beforeEach(() => {
  vi.clearAllMocks()
})

test('renders basic fields and handles optional info visibility toggle', async () => {
  const handleLogin = vi.fn()
  render(<RegisterForm handleLogin={handleLogin} />)

  expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
  expect(screen.queryByPlaceholderText('Email (optional)')).not.toBeInTheDocument()

  const toggleButton = screen.getByRole('button', { name: /show optional information/i })
  await userEvent.click(toggleButton)

  expect(screen.getByPlaceholderText('Email (optional)')).toBeInTheDocument()
})

test('shows error message if passwords do not match', async () => {
  const handleLogin = vi.fn()
  render(<RegisterForm handleLogin={handleLogin} />)

  const username = screen.getByPlaceholderText('Username')
  const password = screen.getByPlaceholderText('Password')
  const passwordAgain = screen.getByPlaceholderText('Password again')
  const registerButton = screen.getByRole('button', { name: /^register$/i })

  await userEvent.type(username, 'testuser')
  await userEvent.type(password, '12345')
  await userEvent.type(passwordAgain, '54321')
  await userEvent.click(registerButton)

  expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
})

test('handles successful registration and handles auto login modal choice', async () => {
  const handleLogin = vi.fn()
  const onSuccess = vi.fn()
  vi.mocked(axios.post).mockResolvedValueOnce({ data: {} })

  render(<RegisterForm handleLogin={handleLogin} onSuccess={onSuccess} />)

  const username = screen.getByPlaceholderText('Username')
  const password = screen.getByPlaceholderText('Password')
  const passwordAgain = screen.getByPlaceholderText('Password again')
  const registerButton = screen.getByRole('button', { name: /^register$/i })

  await userEvent.type(username, 'testuser')
  await userEvent.type(password, '12345')
  await userEvent.type(passwordAgain, '12345')
  await userEvent.click(registerButton)

  expect(axios.post).toHaveBeenCalledWith('/api/users', {
    username: 'testuser',
    password: '12345'
  })

  const modalText = await screen.findByText(/registration successful/i)
  expect(modalText).toBeInTheDocument()

  const yesButton = screen.getByRole('button', { name: /yes/i })
  await userEvent.click(yesButton)

  expect(handleLogin).toHaveBeenCalledWith('testuser', '12345')
  expect(onSuccess).toHaveBeenCalled()
})
