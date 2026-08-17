import { useState, useEffect, JSX } from 'react'
import { Box, Typography, Paper, Chip, Button, Link as MuiLink } from '@mui/material'
import TerminalIcon from '@mui/icons-material/Terminal'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import GitHubIcon from '@mui/icons-material/GitHub'

interface SpaceConsoleHeroProps {
  githubName?: string
  status?: string
  githubUrl?: string
}

const SpaceConsoleHero = ({
  githubName = 'KMStacker',
  status = '',
  githubUrl
}: SpaceConsoleHeroProps): JSX.Element => {
  const [powerOn, setPowerOn] = useState<boolean>(true)
  const [typedText, setTypedText] = useState<string>('')
  const fullText = `LOADING PROFILE.SYS...\n> OPERATIVE: [${githubName}]...\n> STATUS: ${status}...`

  useEffect(() => {
    if (!powerOn) {
      setTypedText('')
      return
    }

    let index = 0
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
      }
    }, 35)

    return () => clearInterval(timer)
  }, [powerOn, fullText])

  return (
    <Paper
      elevation={12}
      sx={{
        p: 2,
        mt: 1,
        bgcolor: powerOn ? 'rgba(5, 20, 12, 0.55)' : 'rgba(5, 5, 8, 0.55)',
        backgroundImage: 'none !important',
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
        border: `1px solid ${powerOn ? '#00ff66' : 'rgba(255, 0, 160, 0.3)'}`,
        boxShadow: powerOn
          ? 'inset 0 0 15px rgba(0, 255, 102, 0.15), 0 0 12px rgba(0, 255, 102, 0.25)'
          : '0 0 10px rgba(0, 0, 0, 0.8)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s ease-in-out'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          opacity: powerOn ? 0.25 : 0,
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.5) 50%)',
          backgroundSize: '100% 4px',
          zIndex: 2
        }}
      />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1.5,
          zIndex: 3,
          position: 'relative'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <TerminalIcon sx={{ color: powerOn ? '#00ff66' : '#555', fontSize: '1.1rem' }} />
          <Typography
            variant="caption"
            sx={{
              fontFamily: '"Orbitron", sans-serif',
              color: powerOn ? '#00ff66' : '#555',
              letterSpacing: '1px',
              fontWeight: 'bold'
            }}
          >
            OPERATIVE_STATUS_CONSOLE//
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={powerOn ? 'ONLINE' : 'OFFLINE'}
            size="small"
            sx={{
              height: '20px',
              fontSize: '0.65rem',
              bgcolor: powerOn ? 'rgba(0, 255, 102, 0.15)' : 'rgba(255, 0, 85, 0.15)',
              color: powerOn ? '#00ff66' : '#ff0055',
              border: `1px solid ${powerOn ? '#00ff66' : '#ff0055'}`,
              fontWeight: 'bold',
              fontFamily: 'monospace'
            }}
          />
          <Button
            size="small"
            variant="outlined"
            onClick={() => setPowerOn(!powerOn)}
            startIcon={<PowerSettingsNewIcon sx={{ fontSize: '0.9rem !important' }} />}
            sx={{
              borderColor: powerOn ? '#00ff66' : '#ff0011',
              color: powerOn ? '#00ff66' : '#ff0011',
              fontSize: '0.65rem',
              py: 0.2,
              px: 1,
              minWidth: 'auto'
            }}
          >
            POWER
          </Button>
        </Box>
      </Box>

      {powerOn ? (
        <Box
          sx={{
            p: 1.5,
            bgcolor: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(0, 255, 102, 0.3)',
            borderRadius: '4px',
            zIndex: 3,
            position: 'relative'
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'monospace',
              color: '#00ff66',
              textShadow: '0 0 8px rgba(0, 255, 102, 0.8)',
              lineHeight: 1.5,
              fontSize: '0.8rem',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
              mb: githubUrl ? 1 : 0
            }}
          >
            {'> '}{typedText}
            <Box component="span" sx={{ animation: 'blink 1s infinite', fontWeight: 'bold' }}>
              _
            </Box>
          </Typography>

          {githubUrl && (
            <Box sx={{ mt: 1, pt: 1, borderTop: '1px dashed rgba(0, 255, 102, 0.3)', display: 'flex', alignItems: 'center', gap: 1 }}>
              <GitHubIcon sx={{ color: '#00ff66', fontSize: '1rem' }} />
              <MuiLink
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: '#00ff66',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  textDecoration: 'underline',
                  '&:hover': { color: '#00ffff' }
                }}
              >
                GITHUB_LINK//ACCESS
              </MuiLink>
            </Box>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            borderRadius: '4px'
          }}
        >
          <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#555' }}>
            [ CONSOLE POWERED DOWN ]
          </Typography>
        </Box>
      )}
    </Paper>
  )
}

export default SpaceConsoleHero