import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import App from './App.tsx'
import DialogManager from './common/components/DialogManager.tsx'
import './index.css'
import store from './stores/index.ts'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <HelmetProvider>
      <DialogManager />
      <App />
    </HelmetProvider>
  </Provider>
)
