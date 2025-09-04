import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { APP_VERSION } from './version'

window.APP_VERSION = APP_VERSION

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
