import { useState, useEffect, JSX } from 'react'
import axios from 'axios'
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  Stack,
  Container
} from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import StarIcon from '@mui/icons-material/Star'
import LayersIcon from '@mui/icons-material/Layers'

export interface Skill {
  id: number
  name: string
  level: string
  usedOn: string
}

const SkillsPage = (): JSX.Element => {
  const [skills, setSkills] = useState<Skill[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get<Skill[]>('/api/skills')
        setSkills(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    void fetchSkills()
  }, [])

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#00ffff', mb: 2 }} />
        <Typography variant="body1" sx={{ color: '#00ffff', fontFamily: 'monospace' }}>
          LOADING_SKILLS...
        </Typography>
      </Container>
    )
  }

  const handleNext = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % skills.length)
  }

  const handlePrevious = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + skills.length) % skills.length)
  }

  if (skills.length === 0) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
        <Paper sx={{ p: 4, bgcolor: 'rgba(15, 8, 30, 0.75)' }}>
          <Typography variant="h5" sx={{ color: '#00ffff', mb: 2 }}>
            SKILLS SHOWCASE
          </Typography>
          <Typography variant="body1" sx={{ color: '#aaa' }}>
            No skills found in databank.
          </Typography>
        </Paper>
      </Container>
    )
  }

  const currentSkill = skills[currentIndex]

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
          variant="h4"
          align="center"
          sx={{
            fontFamily: '"Orbitron", sans-serif',
            fontWeight: 900,
            color: '#00ffff',
            textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
            letterSpacing: '2px',
            mb: 4
          }}
        >
          SKILLS//SHOWCASE
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box
            sx={{
              width: { xs: '100%', md: '220px' },
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            {skills.map((skill, index) => (
              <Button
                key={skill.id}
                onClick={() => setCurrentIndex(index)}
                variant={currentIndex === index ? 'contained' : 'outlined'}
                fullWidth
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  borderColor: currentIndex === index ? '#00ffff' : 'rgba(255, 0, 160, 0.3)',
                  bgcolor: currentIndex === index ? 'rgba(0, 255, 255, 0.2)' : 'transparent',
                  color: currentIndex === index ? '#00ffff' : '#ffffff',
                  textShadow: currentIndex === index ? '0 0 8px rgba(0, 255, 255, 0.8)' : 'none',
                  '&:hover': {
                    bgcolor: 'rgba(255, 0, 160, 0.15)',
                    borderColor: '#ff00a0',
                    color: '#ff00a0'
                  }
                }}
              >
                {skill.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                gap: 2
              }}
            >
              <IconButton
                onClick={handlePrevious}
                sx={{
                  color: '#00ffff',
                  border: '1px solid rgba(0, 255, 255, 0.4)',
                  bgcolor: 'rgba(10, 5, 20, 0.6)',
                  '&:hover': {
                    bgcolor: 'rgba(0, 255, 255, 0.2)',
                    boxShadow: '0 0 12px rgba(0, 255, 255, 0.6)'
                  }
                }}
              >
                <ChevronLeftIcon />
              </IconButton>

              <Paper
                key={currentSkill.id}
                sx={{
                  flex: 1,
                  p: 4,
                  minHeight: '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  bgcolor: 'rgba(10, 5, 20, 0.85)',
                  border: '1px solid rgba(0, 255, 255, 0.4)',
                  boxShadow: 'inset 0 0 15px rgba(0,0,0,0.8), 0 0 15px rgba(255, 0, 160, 0.2)',
                  transition: 'all 0.3s ease'
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    color: '#00ffff',
                    fontWeight: 800,
                    fontFamily: '"Orbitron", sans-serif',
                    mb: 3,
                    textShadow: '0 0 10px rgba(0, 255, 255, 0.8)'
                  }}
                >
                  {currentSkill.name}
                </Typography>

                <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap sx={{ gap: 2 }}>
                  <Chip
                    icon={<StarIcon sx={{ color: '#ffd700 !important' }} />}
                    label={`LEVEL: ${currentSkill.level}`}
                    sx={{
                      bgcolor: 'rgba(255, 215, 0, 0.1)',
                      color: '#ffd700',
                      border: '1px solid rgba(255, 215, 0, 0.4)',
                      fontWeight: 'bold',
                      fontFamily: 'monospace',
                      fontSize: '0.85rem',
                      py: 2
                    }}
                  />
                  <Chip
                    icon={<LayersIcon sx={{ color: '#ff00a0 !important' }} />}
                    label={`USED ON: ${currentSkill.usedOn}`}
                    sx={{
                      bgcolor: 'rgba(255, 0, 160, 0.1)',
                      color: '#ff00a0',
                      border: '1px solid rgba(255, 0, 160, 0.4)',
                      fontWeight: 'bold',
                      fontFamily: 'monospace',
                      fontSize: '0.85rem',
                      py: 2
                    }}
                  />
                </Stack>
              </Paper>

              <IconButton
                onClick={handleNext}
                sx={{
                  color: '#00ffff',
                  border: '1px solid rgba(0, 255, 255, 0.4)',
                  bgcolor: 'rgba(10, 5, 20, 0.6)',
                  '&:hover': {
                    bgcolor: 'rgba(0, 255, 255, 0.2)',
                    boxShadow: '0 0 12px rgba(0, 255, 255, 0.6)'
                  }
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>

            <Stack direction="row" spacing={1} sx={{ mt: 3, justifyContent: 'center' }}>
              {skills.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  sx={{
                    width: currentIndex === index ? 24 : 10,
                    height: 10,
                    borderRadius: '5px',
                    bgcolor: currentIndex === index ? '#00ffff' : 'rgba(255, 255, 255, 0.3)',
                    boxShadow: currentIndex === index ? '0 0 8px #00ffff' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default SkillsPage
