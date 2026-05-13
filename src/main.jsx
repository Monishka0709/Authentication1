import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter as Router} from 'react-router-dom'
import './index.css'
import {AppContextProvider} from './context/AppContext'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppContextProvider>
      <Router>
        <App />
      </Router>
    </AppContextProvider>
  </StrictMode>,
)
