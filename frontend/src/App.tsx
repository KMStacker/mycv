import './App.css'
import { useState, useEffect, JSX } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import SkillsPage from './pages/SkillsPage'
import AdminPage from './pages/AdminPage'
import GuestbookPage from './pages/GuestbookPage'
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import RegisterForm from './components/RegisterForm'
import SparkleOverlay from './components/SparkleOverlay'

export type AppTheme = 'nightsky' | 'golden' | 'rainbow'

interface User {
  username: string
  token: string
  role: 'USER' | 'ADMIN'
}

const App = (): JSX.Element => {
  const [user, setUser] = useState<User | null>(null)
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false)
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false)
  const [theme, setTheme] = useState<AppTheme>('nightsky')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const userObj = JSON.parse(loggedUserJSON) as User
      setUser(userObj)
      loginService.setToken(userObj.token)
    }

    const savedTheme = window.localStorage.getItem('appTheme') as AppTheme
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    document.body.className = theme === 'nightsky' ? '' : `theme-${theme}`
    window.localStorage.setItem('appTheme', theme)
  }, [theme])

  const handleLogin = async (username: string, password: string): Promise<void> => {
    const loggedUser = await loginService.login({ username, password })
    window.localStorage.setItem('loggedInUser', JSON.stringify(loggedUser))
    setUser(loggedUser)
    loginService.setToken(loggedUser.token)
  }

  const handleLogout = (): void => {
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  return (
    <BrowserRouter>
      <SparkleOverlay />
      <div className="nav-bar">
        <div>
          <Link className="button" to="/">
            Home
          </Link>
          <Link className="button" to="/projects">
            Projects
          </Link>
          <Link className="button" to="/skills">
            Skills
          </Link>
          <Link className="button" to="/guestbook">
            Guestbook
          </Link>
          {user && user.role === 'ADMIN' && (
            <Link className="button" to="/admin">
              Admin
            </Link>
          )}
        </div>
        <div className="separate-boxes">
          {user ? (
            <div className="login-form">
              <p>
                Welcome, {user.username}! &nbsp;
                <button className="button" onClick={handleLogout}>
                  Logout
                </button>
              </p>
            </div>
          ) : (
            <>
              <button className="button" type="button" onClick={() => setShowLoginModal(true)}>
                Login
              </button>
              <button className="button" type="button" onClick={() => setShowRegisterModal(true)}>
                Register
              </button>
            </>
          )}
        </div>
      </div>
      <Routes>
        <Route path="/" element={<HomePage user={user} theme={theme} setTheme={setTheme} />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/admin" element={<AdminPage user={user} />} />
        <Route
          path="/guestbook"
          element={<GuestbookPage user={user} handleLogin={handleLogin} />}
        />
      </Routes>

      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <LoginForm handleLogin={handleLogin} onSuccess={() => setShowLoginModal(false)} />
          </div>
        </div>
      )}

      {showRegisterModal && (
        <div className="modal-overlay" onClick={() => setShowRegisterModal(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <RegisterForm
              handleLogin={handleLogin}
              onSuccess={() => setShowRegisterModal(false)}
              onCancel={() => setShowRegisterModal(false)}
            />
          </div>
        </div>
      )}
    </BrowserRouter>
  )
}

export default App
