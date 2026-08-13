import './App.css'
import { useState, useEffect, JSX } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Chip
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import CodeIcon from '@mui/icons-material/Code'
import BuildIcon from '@mui/icons-material/Build'
import BookIcon from '@mui/icons-material/Book'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

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
      <AppBar
        position="sticky"
        sx={{
          background: 'rgba(10, 5, 20, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '2px solid rgba(0, 255, 255, 0.4)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 255, 255, 0.3)',
          mb: 3
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', flexWrap: 'wrap', py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  mr: 2,
                  fontFamily: '"Orbitron", sans-serif',
                  fontWeight: 900,
                  color: '#00ffff',
                  textDecoration: 'none',
                  textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                  letterSpacing: '2px',
                  '&:hover': {
                    color: '#ff00a0',
                    textShadow: '0 0 10px rgba(255, 0, 160, 0.8)'
                  }
                }}
              >
                MY-CV//
              </Typography>

              <Button
                component={Link}
                to="/"
                startIcon={<HomeIcon />}
                sx={{ color: '#ffffff', '&:hover': { color: '#00ffff' } }}
              >
                Home
              </Button>
              <Button
                component={Link}
                to="/projects"
                startIcon={<CodeIcon />}
                sx={{ color: '#ffffff', '&:hover': { color: '#00ffff' } }}
              >
                Projects
              </Button>
              <Button
                component={Link}
                to="/skills"
                startIcon={<BuildIcon />}
                sx={{ color: '#ffffff', '&:hover': { color: '#00ffff' } }}
              >
                Skills
              </Button>
              <Button
                component={Link}
                to="/guestbook"
                startIcon={<BookIcon />}
                sx={{ color: '#ffffff', '&:hover': { color: '#00ffff' } }}
              >
                Guestbook
              </Button>
              {user && user.role === 'ADMIN' && (
                <Button
                  component={Link}
                  to="/admin"
                  startIcon={<AdminPanelSettingsIcon />}
                  sx={{
                    color: '#ff00a0',
                    border: '1px solid rgba(255, 0, 160, 0.5)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 0, 160, 0.15)',
                      boxShadow: '0 0 12px rgba(255, 0, 160, 0.6)'
                    }
                  }}
                >
                  Admin
                </Button>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: { xs: 1, sm: 0 } }}>
              {user ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Chip
                    label={`USER: ${user.username}`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(0, 255, 255, 0.1)',
                      color: '#00ffff',
                      border: '1px solid rgba(0, 255, 255, 0.4)',
                      fontWeight: 'bold',
                      fontFamily: 'monospace'
                    }}
                  />
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                    size="small"
                  >
                    Logout
                  </Button>
                </Box>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    onClick={() => setShowLoginModal(true)}
                    startIcon={<LoginIcon />}
                    size="small"
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setShowRegisterModal(true)}
                    startIcon={<PersonAddIcon />}
                    size="small"
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

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
