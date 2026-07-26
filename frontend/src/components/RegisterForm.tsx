import React, { useState, JSX } from 'react'
import axios from 'axios'

interface RegisterFormProps {
  handleLogin: (username: string, password: string) => Promise<void>
  onSuccess?: () => void
  onCancel?: () => void
}

const RegisterForm = ({ handleLogin, onSuccess, onCancel }: RegisterFormProps): JSX.Element => {
  const [regUsername, setRegUsername] = useState<string>('')
  const [regPassword, setRegPassword] = useState<string>('')
  const [regPasswordAgain, setRegPasswordAgain] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [showOptional, setShowOptional] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleRegister = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault()
    if (regPassword !== regPasswordAgain) {
      setError('Passwords do not match')
      return
    }
    try {
      await axios.post('/api/users', {
        username: regUsername,
        password: regPassword
      })
      setShowModal(true)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed')
    }
  }

  const handleModalChoice = async (autoLogin: boolean): Promise<void> => {
    setShowModal(false)
    if (autoLogin) {
      await handleLogin(regUsername, regPassword)
    }
    setRegUsername('')
    setRegPassword('')
    setRegPasswordAgain('')
    setEmail('')
    setPhone('')
    if (onSuccess) {
      onSuccess()
    }
  }

  return (
    <div className="feature-editor" style={{ padding: '10px' }}>
      <h2>Register New Account</h2>
      {showModal && (
        <div className="info-box">
          <p>Registration successful! Would you like to log in now?</p>
          <button type="button" className="button" onClick={() => void handleModalChoice(true)}>
            Yes
          </button>
          <button type="button" className="button" onClick={() => void handleModalChoice(false)}>
            No
          </button>
        </div>
      )}
      <form onSubmit={handleRegister}>
        <div className="editor-section" style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={regUsername}
            onChange={({ target }) => setRegUsername(target.value)}
            placeholder="Username"
            required
          />
        </div>
        <div className="editor-section" style={{ marginBottom: '10px' }}>
          <input
            type="password"
            value={regPassword}
            onChange={({ target }) => setRegPassword(target.value)}
            placeholder="Password"
            required
          />
        </div>
        <div className="editor-section" style={{ marginBottom: '10px' }}>
          <input
            type="password"
            value={regPasswordAgain}
            onChange={({ target }) => setRegPasswordAgain(target.value)}
            placeholder="Password again"
            required
          />
        </div>
        <div className="editor-section" style={{ marginBottom: '10px' }}>
          <button
            type="button"
            className="button"
            onClick={() => setShowOptional(!showOptional)}
            style={{ cursor: 'pointer', margin: 0 }}
          >
            {showOptional ? 'Hide optional information' : 'Show optional information'}
          </button>
          {showOptional && (
            <div style={{ marginTop: '10px' }}>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="email"
                  value={email}
                  onChange={({ target }) => setEmail(target.value)}
                  placeholder="Email (optional)"
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  value={phone}
                  onChange={({ target }) => setPhone(target.value)}
                  placeholder="Phone number (optional)"
                />
              </div>
            </div>
          )}
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="inline-header-row">
          <button type="submit" className="button" style={{ margin: 0 }}>
            Register
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

export default RegisterForm
