import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "@fontsource/ibm-plex-mono"; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';





createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
