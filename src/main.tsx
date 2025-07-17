import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
import React from 'react'
import { Provider } from 'react-redux'
import { store } from './app/store'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
