import { useState } from 'react'
import './App.css'

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...')

  const testBackend = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/test')
      const data = await response.json()
      setBackendStatus('✅ Connected: ' + data.message)
    } catch (error) {
      setBackendStatus('❌ Backend not running')
    }
  }

  return (
    <div className="App">
      <h1>MyPCbuilder</h1>
      <p>Interactive 3D PC Builder</p>
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={testBackend}>
          Test Backend Connection
        </button>
        <p>{backendStatus}</p>
      </div>

      <div style={{ marginTop: '40px', textAlign: 'left', maxWidth: '600px', margin: '40px auto' }}>
        <h2>✅ Day 1 Setup Complete!</h2>
        <ul>
          <li>React + Vite ✓</li>
          <li>Express Backend ✓</li>
          <li>Folder Structure ✓</li>
          <li>Basic Connection Test ✓</li>
        </ul>
      </div>
    </div>
  )
}

export default App