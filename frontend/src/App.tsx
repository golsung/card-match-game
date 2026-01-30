import { useState, useEffect } from 'react'
import { ThemeProvider } from 'styled-components'
import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { GlobalStyle } from './styles/GlobalStyle'
import theme from './styles/theme'

function App() {
  const [count, setCount] = useState(0)

  // Test CORS and Proxy connection to backend
  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        const response = await axios.get('/api/health')
        console.log('✅ Backend connection successful:', response.data)
        console.log('✅ No CORS errors!')
      } catch (error) {
        console.error('❌ Backend connection failed:', error)
      }
    }

    testBackendConnection()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </ThemeProvider>
  )
}

export default App
