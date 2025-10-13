import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { testPathAlias, greet } from '@/utils/test'
import { StoreTest } from '@/components/StoreTest'
import { DexieTest } from '@/components/DexieTest'

function App() {
  const [count, setCount] = useState(0)

  // Test path aliases
  console.log(testPathAlias())
  console.log(greet('Lumara'))

  return (
    <>
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
        <button onClick={() => setCount(count => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      {/* Zustand Store Test Component */}
      <StoreTest />

      {/* Dexie Database Test Component - Issue #6 */}
      <DexieTest />

      {/* Tailwind CSS Test - Issue #9 */}
      <div className="mt-8 p-6 rounded-lg bg-brand-indigo/10 border border-brand-violet">
        <h2 className="text-2xl font-sans font-bold text-brand-violet mb-2">
          Tailwind CSS Configured
        </h2>
        <p className="text-sm font-mono text-gray-300">
          Custom colors, typography, and dark mode working
        </p>
      </div>
    </>
  )
}

export default App
