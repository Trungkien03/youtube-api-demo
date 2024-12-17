import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.tsx'
import DialogManager from './common/components/DialogManager.tsx'

import store from './stores/index.ts'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <DialogManager />
      <App />
    </Provider>
  </StrictMode>
)