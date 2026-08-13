import ReactDOM from 'react-dom/client'
import { ThemeProvider, CssBaseline } from '@mui/material'
import App from './App'
import { retroTheme } from './theme/retroTheme'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ThemeProvider theme={retroTheme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
)
