/**
 * Empty State Component
 *
 * Displays a friendly message when no memories exist yet.
 */

/**
 * Empty state for memory list
 *
 * Encourages users to create their first memory through conversation.
 */
export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
      <div className="max-w-md space-y-4">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-900">
          No memories yet
        </h2>

        {/* Description */}
        <p className="text-gray-600">
          Start a conversation to create your first memory. Tell me something
          you'd like to remember, and I'll help you capture it.
        </p>

        {/* Examples */}
        <div className="text-sm text-gray-500 pt-4">
          <p className="font-medium mb-2">Example prompts:</p>
          <ul className="space-y-1 text-left">
            <li className="pl-4">• "I learned how to use React hooks today"</li>
            <li className="pl-4">• "I prefer working in the morning"</li>
            <li className="pl-4">• "My approach to debugging is systematic"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
