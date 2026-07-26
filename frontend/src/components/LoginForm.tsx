import React, { useState, JSX } from 'react'

interface LoginFormProps {
  handleLogin: (username: string, password: string) => Promise<void> | void
  onSuccess: () => void
  onCancel?: () => void
}

const LoginForm = ({ handleLogin, onSuccess, onCancel }: LoginFormProps): JSX.Element => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const submitLogin = async (event: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    await handleLogin(username, password)
    setUsername('')
    setPassword('')
    onSuccess()
  }

  return (
    <div className="feature-editor" style={{ padding: '10px' }}>
      <h2>Login to Account</h2>
      <form onSubmit={submitLogin}>
        <div className="editor-section" style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            placeholder="Username"
            required
          />
        </div>
        <div className="editor-section" style={{ marginBottom: '10px' }}>
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            placeholder="Password"
            required
          />
        </div>
        <div className="inline-header-row">
          <button type="submit" className="button">
            Login
          </button>
          {onCancel && (
            <button type="button" className="button" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginForm
