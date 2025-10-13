import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { testPathAlias, greet } from '@/utils/test'
import { StoreTest } from '@/components/StoreTest'
import { DexieTest } from '@/components/DexieTest'
import { QueryTest } from '@/components/QueryTest'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { AnimationExamples } from '@/components/examples/AnimationExamples'

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

      {/* TanStack Query Test Component - Issue #8 */}
      <QueryTest />

      {/* Tailwind CSS Test - Issue #9 */}
      <div className="mt-8 p-6 rounded-lg bg-brand-indigo/10 border border-brand-violet">
        <h2 className="text-2xl font-sans font-bold text-brand-violet mb-2">
          Tailwind CSS Configured
        </h2>
        <p className="text-sm font-mono text-gray-300">
          Custom colors, typography, and dark mode working
        </p>
      </div>

      {/* Base UI Components Test - Issue #10 */}
      <div className="mt-8">
        <Card className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-white">Base UI Components</h2>

          {/* Button variants */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-white/60 mb-2">
                Button Variants
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>

            {/* Button sizes */}
            <div>
              <h3 className="text-sm font-medium text-white/60 mb-2">
                Button Sizes
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
          </div>

          {/* Input component */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-white/60 mb-2">
                Input Component
              </h3>
              <Input placeholder="Enter your text here..." />
            </div>

            <div>
              <h3 className="text-sm font-medium text-white/60 mb-2">
                Input with Error
              </h3>
              <Input
                placeholder="Invalid input"
                error="This field is required"
              />
            </div>
          </div>

          {/* Nested Card */}
          <div>
            <h3 className="text-sm font-medium text-white/60 mb-2">
              Nested Card
            </h3>
            <Card className="bg-white/3">
              <p className="text-white/80">
                Cards can be nested and styled with custom classes
              </p>
            </Card>
          </div>
        </Card>
      </div>

      {/* Animation Examples - Issue #11 */}
      <div className="mt-8">
        <AnimationExamples />
      </div>
    </>
  )
}

export default App
