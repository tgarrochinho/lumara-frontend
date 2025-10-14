import './App.css'
import { ChatInterface } from '@/components/conversation/ChatInterface'
import { MemoryList } from '@/components/memories/MemoryList'

function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Lumara</h1>
        <p className="text-sm text-gray-600">Your metacognitive AI partner</p>
      </header>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Chat Interface */}
        <div className="flex-1 border-r border-gray-200">
          <ChatInterface />
        </div>

        {/* Right Column - Memory List */}
        <div className="w-96 bg-gray-50">
          <div className="h-full flex flex-col">
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
