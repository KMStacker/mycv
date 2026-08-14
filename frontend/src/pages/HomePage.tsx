import { useState, useEffect, JSX } from 'react'
import axios from 'axios'
import {
  Box,
  Typography,
  Paper,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import InfoIcon from '@mui/icons-material/Info'
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

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ width: { xs: '100%', md: '360px' }, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper
              sx={{
                p: 2.5,
                bgcolor: 'var(--input-bg)',
                border: '1px solid var(--box-border)',
                boxShadow: 'inset 0 0 15px rgba(0,0,0,0.2)'
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
                boxShadow: 'inset 0 0 15px rgba(0,0,0,0.2)'
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
              <List dense disablePadding>
                {profile?.name && (
                  <ListItem disablePadding sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 28, color: 'var(--color-highlight-primary)' }}>
                      <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={`Name: ${profile.name}`} primaryTypographyProps={{ fontSize: '0.85rem', color: 'var(--text-main)' }} />
                  </ListItem>
                )}
                {profile?.email && (
                  <ListItem disablePadding sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 28, color: 'var(--color-highlight-secondary)' }}>
                      <EmailIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={`Email: ${profile.email}`} primaryTypographyProps={{ fontSize: '0.85rem', color: 'var(--text-main)' }} />
                  </ListItem>
                )}
                {profile?.phone && (
                  <ListItem disablePadding sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 28, color: 'var(--color-highlight-tertiary)' }}>
                      <PhoneIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={`Phone: ${profile.phone}`} primaryTypographyProps={{ fontSize: '0.85rem', color: 'var(--text-main)' }} />
                  </ListItem>
                )}
                {profile?.location && (
                  <ListItem disablePadding sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 28, color: 'var(--color-highlight-primary)' }}>
                      <LocationOnIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={`Location: ${profile.location}`} primaryTypographyProps={{ fontSize: '0.85rem', color: 'var(--text-main)' }} />
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
                bgcolor: 'var(--input-bg)',
                border: '1px solid var(--box-border)',
                boxShadow: 'inset 0 0 15px rgba(0,0,0,0.2)'
              }}
            >
              <Typography variant="body1" sx={{ color: 'var(--text-main)', mb: 1, lineHeight: 1.6 }}>
                Welcome to My CV portfolio! Feel free to look around and leave a message in the Guestbook!
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--color-highlight)' }}>
                You can switch between Night Sky and Day Sky themes using the icons in the top navigation bar.
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default HomePage