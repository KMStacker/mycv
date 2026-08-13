import { useState, useEffect, JSX } from 'react'
import axios from 'axios'
import {
  Box,
  Typography,
  Paper,
  Button,
  ButtonGroup,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import InfoIcon from '@mui/icons-material/Info'
import PaletteIcon from '@mui/icons-material/Palette'

import SpaceConsoleHero from '../components/SpaceConsoleHero'

interface User {
  username: string
  token: string
  role: 'USER' | 'ADMIN'
}

interface ProfileData {
  name: string
  email: string
  phone: string
  aboutText: string
  location: string
  githubUrl: string
  status: string
}

interface HomePageProps {
  user: User | null
  theme: 'nightsky' | 'golden' | 'rainbow'
  setTheme: (theme: 'nightsky' | 'golden' | 'rainbow') => void
}

const HomePage = ({ user, theme, setTheme }: HomePageProps): JSX.Element => {
  const [profile, setProfile] = useState<ProfileData | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get<ProfileData>('/api/profile')
        setProfile(response.data)
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }
    void fetchProfile()
  }, [])

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={10}
        sx={{
          p: { xs: 2, sm: 4 },
          bgcolor: 'rgba(15, 8, 30, 0.75)',
          border: '1px solid rgba(0, 255, 255, 0.3)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.8), 0 0 20px rgba(0, 255, 255, 0.2)'
        }}
      >
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontFamily: '"Orbitron", sans-serif',
            fontWeight: 900,
            color: '#00ffff',
            textShadow: '0 0 12px rgba(0, 255, 255, 0.8)',
            letterSpacing: '2px',
            mb: 4
          }}
        >
          WELCOME//TO MY-CV
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ width: { xs: '100%', md: '360px' }, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper
              sx={{
                p: 2.5,
                bgcolor: 'rgba(10, 5, 20, 0.85)',
                border: '1px solid rgba(255, 0, 160, 0.4)',
                boxShadow: 'inset 0 0 15px rgba(0,0,0,0.8)'
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#ff00a0',
                  fontFamily: '"Orbitron", sans-serif',
                  fontWeight: 800,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <AccountCircleIcon sx={{ fontSize: '1.2rem' }} /> ABOUT ME
              </Typography>
              <Typography variant="body2" sx={{ color: '#e0e0e0', lineHeight: 1.6 }}>
                {profile?.aboutText || 'No info yet...'}
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 2.5,
                bgcolor: 'rgba(10, 5, 20, 0.85)',
                border: '1px solid rgba(0, 255, 255, 0.4)',
                boxShadow: 'inset 0 0 15px rgba(0,0,0,0.8)'
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#00ffff',
                  fontFamily: '"Orbitron", sans-serif',
                  fontWeight: 800,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <InfoIcon sx={{ fontSize: '1.2rem' }} /> CONTACT INFO
              </Typography>
              <List dense disablePadding>
                {profile?.name && (
                  <ListItem disablePadding sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 28, color: '#00ffff' }}>
                      <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={`Name: ${profile.name}`} primaryTypographyProps={{ fontSize: '0.85rem' }} />
                  </ListItem>
                )}
                {profile?.email && (
                  <ListItem disablePadding sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 28, color: '#00ffff' }}>
                      <EmailIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={`Email: ${profile.email}`} primaryTypographyProps={{ fontSize: '0.85rem' }} />
                  </ListItem>
                )}
                {profile?.phone && (
                  <ListItem disablePadding sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 28, color: '#00ffff' }}>
                      <PhoneIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={`Phone: ${profile.phone}`} primaryTypographyProps={{ fontSize: '0.85rem' }} />
                  </ListItem>
                )}
                {profile?.location && (
                  <ListItem disablePadding sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 28, color: '#00ffff' }}>
                      <LocationOnIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={`Location: ${profile.location}`} primaryTypographyProps={{ fontSize: '0.85rem' }} />
                  </ListItem>
                )}
                {!profile && <Typography variant="caption">No info yet...</Typography>}
              </List>

              <SpaceConsoleHero
                githubName="KMStacker"
                status={profile?.status}
                githubUrl={profile?.githubUrl}
              />
            </Paper>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper
              sx={{
                p: 3,
                bgcolor: 'rgba(10, 5, 20, 0.85)',
                border: '1px solid rgba(0, 255, 255, 0.3)',
                boxShadow: 'inset 0 0 15px rgba(0,0,0,0.8)'
              }}
            >
              <Typography variant="body1" sx={{ color: '#ffffff', mb: 1, lineHeight: 1.6 }}>
                Feel free to look around and leave a message in the Guestbook!
              </Typography>
              <Typography variant="body2" sx={{ color: '#00ffff' }}>
                Sign in to unlock and try custom visual themes below!
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 3,
                bgcolor: 'rgba(10, 5, 20, 0.85)',
                border: '1px solid rgba(255, 0, 160, 0.3)',
                boxShadow: 'inset 0 0 15px rgba(0,0,0,0.8)'
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#ff00a0',
                  fontFamily: '"Orbitron", sans-serif',
                  fontWeight: 800,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <PaletteIcon sx={{ fontSize: '1.2rem' }} /> VISUAL_THEMES//
              </Typography>

              <ButtonGroup variant="outlined" fullWidth sx={{ gap: 1 }}>
                <Button
                  onClick={() => setTheme('nightsky')}
                  sx={{
                    borderColor: theme === 'nightsky' ? '#00ffff' : 'rgba(0,255,255,0.3)',
                    color: theme === 'nightsky' ? '#00ffff' : '#fff',
                    bgcolor: theme === 'nightsky' ? 'rgba(0,255,255,0.15)' : 'transparent',
                    boxShadow: theme === 'nightsky' ? '0 0 10px rgba(0,255,255,0.5)' : 'none'
                  }}
                >
                  Night Sky
                </Button>

                <Tooltip title={!user ? 'Sign in to unlock Golden theme' : ''}>
                  <span>
                    <Button
                      disabled={!user}
                      onClick={() => user && setTheme('golden')}
                      sx={{
                        borderColor: theme === 'golden' ? '#ffd700' : 'rgba(255,215,0,0.3)',
                        color: theme === 'golden' ? '#ffd700' : '#fff',
                        bgcolor: theme === 'golden' ? 'rgba(255,215,0,0.15)' : 'transparent',
                        boxShadow: theme === 'golden' ? '0 0 10px rgba(255,215,0,0.5)' : 'none'
                      }}
                    >
                      Golden
                    </Button>
                  </span>
                </Tooltip>

                <Tooltip title={!user ? 'Sign in to unlock Rainbow theme' : ''}>
                  <span>
                    <Button
                      disabled={!user}
                      onClick={() => user && setTheme('rainbow')}
                      sx={{
                        borderColor: theme === 'rainbow' ? '#ff00a0' : 'rgba(255,0,160,0.3)',
                        color: theme === 'rainbow' ? '#ff00a0' : '#fff',
                        bgcolor: theme === 'rainbow' ? 'rgba(255,0,160,0.15)' : 'transparent',
                        boxShadow: theme === 'rainbow' ? '0 0 10px rgba(255,0,160,0.5)' : 'none'
                      }}
                    >
                      Rainbow
                    </Button>
                  </span>
                </Tooltip>
              </ButtonGroup>
            </Paper>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default HomePage
