import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './store/index.js'
import { persistStore } from 'redux-persist'
import { PersistGate} from 'redux-persist/integration/react'

let persistor= persistStore(store)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <PersistGate persistor={persistor}></PersistGate>
    <App />
    </Provider>
  </StrictMode>,
)
