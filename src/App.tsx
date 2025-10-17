import './App.css'
import { useState } from 'react'
import { ChatInterface } from '@/components/conversation/ChatInterface'
import { MemoryList } from '@/components/memories/MemoryList'

function App() {
  const [showMemories, setShowMemories] = useState(false)

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Lumara</h1>
            <p className="text-xs md:text-sm text-gray-600">Your metacognitive AI partner</p>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setShowMemories(!showMemories)}
            className="md:hidden px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
            aria-label={showMemories ? 'Show chat' : 'Show memories'}
            aria-expanded={showMemories}
          >
            {showMemories ? 'Chat' : 'Memories'}
          </button>
        </div>
      </header>

      {/* Main Content - Responsive Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Interface - Hidden on mobile when memories are shown */}
        <div
          className={`
            flex-1 border-r border-gray-200
            ${showMemories ? 'hidden md:flex' : 'flex'}
          `}
          role="main"
          aria-label="Chat interface"
        >
          <ChatInterface />
        </div>

        {/* Memory List - Full width on mobile, sidebar on desktop */}
        <div
          className={`
            w-full md:w-96 bg-gray-50
            ${showMemories ? 'flex' : 'hidden md:flex'}
          `}
          role="complementary"
          aria-label="Memory list"
        >
          <div className="h-full flex flex-col w-full">
            <div className="p-4 bg-white border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Memories</h2>
            </div>
            <div className="flex-1 overflow-hidden">
              <MemoryList />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
