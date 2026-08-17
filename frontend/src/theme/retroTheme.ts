import { createTheme } from '@mui/material/styles'

export const retroTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ffff',
      contrastText: '#000000'
    },
    secondary: {
      main: '#ff00a0',
      contrastText: '#ffffff'
    },
    success: {
      main: '#00ff66',
      contrastText: '#000000'
    },
    background: {
      default: '#08040c',
      paper: 'rgba(15, 8, 30, 0.35)'
    },
    text: {
      primary: '#ffffff',
      secondary: '#00ffff'
    }
  },
  typography: {
    fontFamily: '"Courier New", Courier, monospace, sans-serif',
    h1: {
      fontFamily: '"Orbitron", sans-serif',
      color: '#00ffff',
      textShadow: '0 0 10px rgba(0, 255, 255, 0.6)'
    },
    h2: {
      fontFamily: '"Orbitron", sans-serif',
      color: '#ff00a0',
      textShadow: '0 0 10px rgba(255, 0, 160, 0.6)'
    },
    h3: {
      fontFamily: '"Orbitron", sans-serif',
      color: '#00ff66',
      textShadow: '0 0 10px rgba(0, 255, 102, 0.6)'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.8)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          border: '1px solid rgba(0, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 15px rgba(255, 0, 160, 0.2)'
        }
      }
    }
  }
})
