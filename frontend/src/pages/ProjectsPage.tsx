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
import GitHubIcon from '@mui/icons-material/GitHub'
import CodeIcon from '@mui/icons-material/Code'

export interface Project {
  id: number
  title: string
  description: string
  technologies: string
  githubUrl: string
}

const ProjectsPage = (): JSX.Element => {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get<Project[]>('/api/projects')
        setProjects(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    void fetchProjects()
  }, [])

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#00ffff', mb: 2 }} />
        <Typography variant="body1" sx={{ color: '#00ffff', fontFamily: 'monospace' }}>
          LOADING_PROJECTS...
        </Typography>
      </Container>
    )
  }

  const handleNext = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length)
  }

  const handlePrevious = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length)
  }

  if (projects.length === 0) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
        <Paper sx={{ p: 4, bgcolor: 'rgba(15, 8, 30, 0.75)' }}>
          <Typography variant="h5" sx={{ color: '#00ffff', mb: 2 }}>
            PROJECTS SHOWCASE
          </Typography>
          <Typography variant="body1" sx={{ color: '#aaa' }}>
            No projects found in databank.
          </Typography>
        </Paper>
      </Container>
    )
  }

  const currentProject = projects[currentIndex]
  const techList = currentProject.technologies
    ? currentProject.technologies.split(',').map((tech) => tech.trim())
    : []

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={10}
        sx={{
          p: { xs: 2, sm: 4 },
          bgcolor: 'rgba(15, 8, 30, 0.75)',
          border: '1px solid rgba(0, 255, 255, 0.3)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.8), 0 0 20px rgba(255, 0, 160, 0.3)'
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
          PROJECTS//SHOWCASE
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
            {projects.map((project, index) => (
              <Button
                key={project.id}
                onClick={() => setCurrentIndex(index)}
                variant={currentIndex === index ? 'contained' : 'outlined'}
                fullWidth
                sx={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  borderColor: currentIndex === index ? '#ff00a0' : 'rgba(0, 255, 255, 0.3)',
                  bgcolor: currentIndex === index ? 'rgba(255, 0, 160, 0.2)' : 'transparent',
                  color: currentIndex === index ? '#ff00a0' : '#ffffff',
                  textShadow: currentIndex === index ? '0 0 8px rgba(255, 0, 160, 0.8)' : 'none',
                  '&:hover': {
                    bgcolor: 'rgba(0, 255, 255, 0.15)',
                    borderColor: '#00ffff',
                    color: '#00ffff'
                  }
                }}
              >
                {project.title}
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
                aria-label="Previous project"
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
                key={currentProject.id}
                sx={{
                  flex: 1,
                  p: 3,
                  minHeight: '260px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  bgcolor: 'rgba(10, 5, 20, 0.85)',
                  border: '1px solid rgba(255, 0, 160, 0.4)',
                  boxShadow: 'inset 0 0 15px rgba(0,0,0,0.8), 0 0 15px rgba(0, 255, 255, 0.2)',
                  transition: 'all 0.3s ease'
                }}
              >
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#ff00a0',
                      fontWeight: 800,
                      fontFamily: '"Orbitron", sans-serif',
                      mb: 2,
                      textShadow: '0 0 8px rgba(255, 0, 160, 0.6)'
                    }}
                  >
                    {currentProject.title}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{ color: '#e0e0e0', lineHeight: 1.6, mb: 3 }}
                  >
                    {currentProject.description}
                  </Typography>

                  {techList.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="caption"
                        sx={{ color: '#00ffff', display: 'block', mb: 1, fontWeight: 'bold' }}
                      >
                        STACK_INTEGRATION:
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
                        {techList.map((tech, idx) => (
                          <Chip
                            key={idx}
                            icon={<CodeIcon sx={{ fontSize: '0.9rem !important' }} />}
                            label={tech}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(0, 255, 255, 0.1)',
                              color: '#00ffff',
                              border: '1px solid rgba(0, 255, 255, 0.3)',
                              fontWeight: 'bold',
                              fontFamily: 'monospace'
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Box>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  {currentProject.githubUrl && (
                    <Button
                      component="a"
                      href={currentProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      startIcon={<GitHubIcon />}
                      sx={{
                        borderColor: '#00ffff',
                        color: '#00ffff',
                        '&:hover': {
                          bgcolor: 'rgba(0, 255, 255, 0.2)',
                          boxShadow: '0 0 12px rgba(0, 255, 255, 0.6)'
                        }
                      }}
                    >
                      View in GitHub
                    </Button>
                  )}
                </Box>
              </Paper>

              <IconButton
                aria-label="Next project"
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
              {projects.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  sx={{
                    width: currentIndex === index ? 24 : 10,
                    height: 10,
                    borderRadius: '5px',
                    bgcolor: currentIndex === index ? '#ff00a0' : 'rgba(255, 255, 255, 0.3)',
                    boxShadow: currentIndex === index ? '0 0 8px #ff00a0' : 'none',
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

export default ProjectsPage
