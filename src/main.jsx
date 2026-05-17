import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1e2635',
            color: '#e8eaf0',
            border: '1px solid #2a3347',
            borderRadius: '10px',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#00c896', secondary: '#0f1117' } },
          error:   { iconTheme: { primary: '#ff5c7c', secondary: '#0f1117' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
