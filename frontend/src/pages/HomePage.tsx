import { useState, useEffect, useCallback, JSX } from 'react'
import axios from 'axios'
import {
  Box,
  Typography,
  Paper,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button
} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import InfoIcon from '@mui/icons-material/Info'
import TerminalIcon from '@mui/icons-material/Terminal'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import SpaceConsoleHero from '../components/SpaceConsoleHero'

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
  profileData?: ProfileData
}

const HomePage = ({ profileData }: HomePageProps): JSX.Element => {
  const [profile, setProfile] = useState<ProfileData | null>(profileData || null)
  const [typedLine1, setTypedLine1] = useState<string>('')
  const [typedLine2, setTypedLine2] = useState<string>('')
  const [executionStatus, setExecutionStatus] = useState<'IDLE' | 'RUNNING' | 'COMPLETED'>('IDLE')

  const fullLine1 = 'Welcome to My CV portfolio!'
  const fullLine2 = 'Feel free to look around and leave a message in the Guestbook...'

  const handleExecuteStream = useCallback(() => {
    setTypedLine1('')
    setTypedLine2('')
    setExecutionStatus('RUNNING')

    let index1 = 0
    let index2 = 0
    let timer1: ReturnType<typeof setTimeout>
    let timer2: ReturnType<typeof setTimeout>

    const streamLine1 = (): void => {
      if (index1 < fullLine1.length) {
        setTypedLine1(fullLine1.slice(0, index1 + 1))
        index1 += 1
        timer1 = setTimeout(streamLine1, 25)
      } else {
        timer2 = setTimeout(streamLine2, 150)
      }
    }

    const streamLine2 = (): void => {
      if (index2 < fullLine2.length) {
        setTypedLine2(fullLine2.slice(0, index2 + 1))
        index2 += 1
        timer2 = setTimeout(streamLine2, 20)
      } else {
        setExecutionStatus('COMPLETED')
      }
    }

    streamLine1()

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [fullLine1, fullLine2])

  useEffect(() => {
    if (profileData) return
    const fetchProfile = async () => {
      try {
        const response = await axios.get<ProfileData>('/api/profile')
        setProfile(response.data)
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }
    void fetchProfile()
  }, [profileData])

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={10}
        sx={{
          p: { xs: 2, sm: 4 },
          bgcolor: 'var(--card-gradient)',
          border: '1px solid var(--box-border)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)'
        }}
      >
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontFamily: '"Orbitron", sans-serif',
            fontWeight: 900,
            color: 'var(--color-highlight-tertiary)',
            textShadow: '0 0 12px var(--box-shadow-glow)',
            letterSpacing: '2px',
            mb: 4
          }}
        >
          WELCOME//TO MY-CV
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            maxWidth: '800px',
            mx: 'auto',
            width: '100%'
          }}
        >
          <Paper
            sx={{
              p: 0,
              bgcolor: 'var(--input-bg)',
              border: '1px solid var(--box-border)',
              boxShadow: 'inset 0 0 15px rgba(0,0,0,0.2)',
              boxSizing: 'border-box',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                py: 1,
                bgcolor: 'rgba(0, 0, 0, 0.25)',
                borderBottom: '1px solid var(--box-border)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TerminalIcon sx={{ color: 'var(--color-highlight-secondary)', fontSize: '1.1rem' }} />
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: '"Orbitron", monospace',
                    fontWeight: 700,
                    color: 'var(--color-highlight-secondary)',
                    letterSpacing: '1px'
                  }}
                >
                  SYS_TERMINAL_CONSOLE//
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Chip
                  label={
                    executionStatus === 'RUNNING'
                      ? 'STREAMING...'
                      : executionStatus === 'COMPLETED'
                        ? 'EXEC: OK'
                        : 'READY'
                  }
                  size="small"
                  sx={{
                    fontFamily: '"Orbitron", monospace',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    height: '20px',
                    bgcolor:
                      executionStatus === 'RUNNING'
                        ? 'rgba(255, 170, 0, 0.15)'
                        : executionStatus === 'COMPLETED'
                          ? 'rgba(0, 255, 128, 0.15)'
                          : 'rgba(0, 255, 255, 0.15)',
                    color:
                      executionStatus === 'RUNNING'
                        ? '#ffaa00'
                        : executionStatus === 'COMPLETED'
                          ? '#00ff80'
                          : '#00ffff',
                    border: `1px solid ${
                      executionStatus === 'RUNNING'
                        ? '#ffaa00'
                        : executionStatus === 'COMPLETED'
                          ? '#00ff80'
                          : '#00ffff'
                    }`
                  }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PlayArrowIcon sx={{ fontSize: '0.9rem' }} />}
                  onClick={handleExecuteStream}
                  disabled={executionStatus === 'RUNNING'}
                  sx={{
                    color: 'var(--color-highlight-tertiary)',
                    borderColor: 'var(--color-highlight-tertiary)',
                    fontFamily: '"Orbitron", monospace',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    height: '24px',
                    px: 1.5,
                    '&:hover': {
                      borderColor: 'var(--color-highlight-secondary)',
                      bgcolor: 'rgba(255, 255, 255, 0.05)'
                    },
                    '&.Mui-disabled': {
                      color: 'rgba(255, 255, 255, 0.3)',
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  RUN
                </Button>
              </Box>
            </Box>

            <Box sx={{ p: 2.5, minHeight: '110px' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 1.5
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: 'var(--color-highlight-tertiary)',
                    fontFamily: '"Courier New", Courier, monospace',
                    fontWeight: 700
                  }}
                >
                  &gt; run welcome_msg.sh
                </Typography>
              </Box>

              {executionStatus === 'IDLE' && (
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontFamily: '"Courier New", Courier, monospace',
                    fontStyle: 'italic'
                  }}
                >
                  Press RUN to execute script...
                </Typography>
              )}

              {executionStatus !== 'IDLE' && (
                <>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'var(--text-main)',
                      mb: 1,
                      lineHeight: 1.6,
                      fontFamily: '"Courier New", Courier, monospace',
                      fontWeight: 600
                    }}
                  >
                    {typedLine1}
                    {executionStatus === 'RUNNING' && typedLine1.length < fullLine1.length && (
                      <Box
                        component="span"
                        sx={{
                          display: 'inline-block',
                          width: '8px',
                          height: '14px',
                          bgcolor: 'var(--color-highlight-tertiary)',
                          ml: 0.5,
                          animation: 'terminalBlink 0.8s infinite',
                          '@keyframes terminalBlink': {
                            '0%, 100%': { opacity: 1 },
                            '50%': { opacity: 0 }
                          }
                        }}
                      />
                    )}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: 'var(--color-highlight)',
                      fontFamily: '"Courier New", Courier, monospace',
                      lineHeight: 1.6
                    }}
                  >
                    {typedLine2}
                    {executionStatus === 'RUNNING' && typedLine1.length >= fullLine1.length && (
                      <Box
                        component="span"
                        sx={{
                          display: 'inline-block',
                          width: '8px',
                          height: '12px',
                          bgcolor: 'var(--color-highlight)',
                          ml: 0.5,
                          animation: 'terminalBlink 0.8s infinite',
                          '@keyframes terminalBlink': {
                            '0%, 100%': { opacity: 1 },
                            '50%': { opacity: 0 }
                          }
                        }}
                      />
                    )}
                  </Typography>
                </>
              )}
            </Box>
          </Paper>

          <Paper
            sx={{
              p: 2.5,
              bgcolor: 'var(--input-bg)',
              border: '1px solid var(--box-border)',
              boxShadow: 'inset 0 0 15px rgba(0,0,0,0.2)',
              boxSizing: 'border-box'
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'var(--color-highlight-secondary)',
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
            <Typography variant="body2" sx={{ color: 'var(--text-main)', lineHeight: 1.6 }}>
              {profile?.aboutText || 'No info yet...'}
            </Typography>
          </Paper>

          <Paper
            sx={{
              p: 2.5,
              bgcolor: 'var(--input-bg)',
              border: '1px solid var(--box-border)',
              boxShadow: 'inset 0 0 15px rgba(0,0,0,0.2)',
              boxSizing: 'border-box'
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'var(--color-highlight-secondary)',
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
            <List dense disablePadding sx={{ mb: 2 }}>
              {profile?.name && (
                <ListItem disablePadding sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 28, color: 'var(--color-highlight-primary)' }}>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Name: ${profile.name}`}
                    primaryTypographyProps={{ fontSize: '0.85rem', color: 'var(--text-main)' }}
                  />
                </ListItem>
              )}
              {profile?.email && (
                <ListItem disablePadding sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 28, color: 'var(--color-highlight-secondary)' }}>
                    <EmailIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Email: ${profile.email}`}
                    primaryTypographyProps={{ fontSize: '0.85rem', color: 'var(--text-main)' }}
                  />
                </ListItem>
              )}
              {profile?.phone && (
                <ListItem disablePadding sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 28, color: 'var(--color-highlight-tertiary)' }}>
                    <PhoneIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Phone: ${profile.phone}`}
                    primaryTypographyProps={{ fontSize: '0.85rem', color: 'var(--text-main)' }}
                  />
                </ListItem>
              )}
              {profile?.location && (
                <ListItem disablePadding sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 28, color: 'var(--color-highlight-primary)' }}>
                    <LocationOnIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Location: ${profile.location}`}
                    primaryTypographyProps={{ fontSize: '0.85rem', color: 'var(--text-main)' }}
                  />
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
      </Paper>
    </Container>
  )
}

export default HomePage