import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import LoginForm from './LoginForm'

test('renders input fields and submits correct credentials', async () => {
  const handleLogin = vi.fn()
  const onSuccess = vi.fn()

  render(<LoginForm handleLogin={handleLogin} onSuccess={onSuccess} />)

  const usernameInput = screen.getByPlaceholderText('Username')
  const passwordInput = screen.getByPlaceholderText('Password')
  const loginButton = screen.getByRole('button', { name: /login/i })

  await userEvent.type(usernameInput, 'testuser')
  await userEvent.type(passwordInput, '12345')
  await userEvent.click(loginButton)

  expect(handleLogin).toHaveBeenCalledWith('testuser', '12345')
  expect(onSuccess).toHaveBeenCalled()
})

test('displays error message and does not trigger onSuccess when login fails', async () => {
  const handleLogin = vi.fn().mockRejectedValue({
    response: { data: { error: 'invalid username or password' } }
  })
  const onSuccess = vi.fn()

  render(<LoginForm handleLogin={handleLogin} onSuccess={onSuccess} />)

  const usernameInput = screen.getByPlaceholderText('Username')
  const passwordInput = screen.getByPlaceholderText('Password')
  const loginButton = screen.getByRole('button', { name: /login/i })

  await userEvent.type(usernameInput, 'wronguser')
  await userEvent.type(passwordInput, 'wrongpass')
  await userEvent.click(loginButton)

  expect(handleLogin).toHaveBeenCalledWith('wronguser', 'wrongpass')
  expect(await screen.findByText('invalid username or password')).toBeInTheDocument()
  expect(onSuccess).not.toHaveBeenCalled()
})
