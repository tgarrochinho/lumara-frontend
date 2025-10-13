# Panel Components - MVP Specification

**Timeline:** 3 months to working product  
**Philosophy:** Build what works, measure, then enhance  
**Scope:** Core 3-panel functionality with solid error handling

---

## ⚠️ What This MVP Is NOT

This MVP deliberately EXCLUDES features from the full spec that add complexity:

❌ **NOT in MVP:**
- Progressive disclosure / expandable sections
- Real-time updates (WebSocket)
- AI-driven adaptive defaults
- Celebration animations (confetti, morphing badges)
- Context-aware features
- Panel collapsing/resizing
- Advanced gesture support
- Analytics-driven behavior
- Sound effects
- Responsive breakpoints (desktop only for MVP)

✅ **IS in MVP:**
- Basic 3-panel layout (fixed widths)
- Conversation list and chat view
- Output generation (2 templates)
- Static expertise stages
- Simple error handling
- Manual refresh
- Basic animations (fade, slide)
- Clear data models

**Why?** These excluded features can be added AFTER we have a working product. MVP focuses on core functionality that's testable and debuggable.

---

## 1. Component Registry (Single Source of Truth)

```typescript
// components/registry.ts
export const COMPONENTS = {
  // Left Panel (Explore)
  SubjectOverviewCard: 'SubjectOverviewCard',
  TopicsList: 'TopicsList',
  InsightsList: 'InsightsList',
  
  // Center Panel (Chat)
  ConversationList: 'ConversationList',
  ConversationCard: 'ConversationCard',
  MessageView: 'MessageView',
  MessageBubble: 'MessageBubble',
  
  // Right Panel (Create)
  OutputGenerator: 'OutputGenerator',
  TemplateCard: 'TemplateCard',
  RecentOutputsList: 'RecentOutputsList',
  
  // Shared
  ErrorBoundary: 'ErrorBoundary',
  LoadingState: 'LoadingState',
  EmptyState: 'EmptyState',
} as const;

export type ComponentName = keyof typeof COMPONENTS;
```

**Rule:** Use ONLY these names. No variations, no aliases.

---

## 2. Data Models (Contracts with Backend)

### Core Entities

```typescript
// types/entities.ts

export type ExpertiseStage = 'exploring' | 'building' | 'synthesizing' | 'mature';

export interface Subject {
  id: string;
  title: string;
  expertiseStage: ExpertiseStage;
  lastActiveAt: Date;
  createdAt: Date;
}

export interface Insight {
  id: string;
  subjectId: string;
  content: string;
  category: string; // Topic name
  createdAt: Date;
  status?: 'active' | 'superseded'; // For duplication/contradiction handling
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  emoji: string;
  insightCount: number; // For display only, not for logic
  createdAt: Date;
}

export interface Conversation {
  id: string;
  subjectId: string;
  title: string;
  preview: string; // First message or last message
  lastMessageAt: Date;
  createdAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  isUser: boolean;
  createdAt: Date;
}

export interface Output {
  id: string;
  subjectId: string;
  type: 'summary' | 'guide';
  title: string;
  content: string;
  generatedAt: Date;
}
```

### Panel Data Models

```typescript
// types/panels.ts

export interface ExplorePanelData {
  subject: Subject;
  recentInsights: Insight[]; // Last 5, max 7 days
  topics: Topic[]; // All topics, no pagination for MVP
}

export interface ChatPanelData {
  // List mode
  conversations: Conversation[]; // Last 20
  
  // Active mode
  activeConversation: Conversation | null;
  messages: Message[];
}

export interface CreatePanelData {
  subject: Subject;
  recentOutputs: Output[]; // Last 3
  canGenerate: boolean; // Based on expertise stage
}
```

### Error States

```typescript
// types/errors.ts

export type ErrorType = 'loading' | 'empty' | 'error' | 'offline';

export interface ErrorState {
  type: ErrorType;
  message: string;
  retryAction?: () => void;
  details?: string; // For debugging
}

// Standard error messages
export const ERROR_MESSAGES = {
  loading: 'Loading...',
  empty: {
    insights: 'No insights yet. Start chatting to build knowledge.',
    topics: 'Topics will appear as you chat and explore.',
    conversations: 'No conversations yet. Start your first conversation!',
    outputs: 'No outputs generated yet.',
  },
  error: {
    fetch: 'Could not load data. Please try again.',
    generate: 'Generation failed. Please try again.',
    network: 'Network error. Check your connection.',
  },
  offline: 'You are offline. Some features may not work.',
} as const;
```

---

## 3. Panel Layout Specifications

### Fixed Dimensions (MVP)

```css
/* No responsive breakpoints in MVP */
/* No collapsing panels in MVP */
/* No resizing in MVP */

.app-layout {
  display: flex;
  height: 100vh;
  width: 100%;
}

.explore-panel {
  width: 380px;
  flex-shrink: 0;
  border-right: 1px solid var(--border);
  overflow-y: auto;
}

.chat-panel {
  flex: 1;
  min-width: 500px;
  display: flex;
  flex-direction: column;
}

.create-panel {
  width: 380px;
  flex-shrink: 0;
  border-left: 1px solid var(--border);
  overflow-y: auto;
}

/* Minimum window width: 1260px (380 + 500 + 380) */
/* Below this: Show warning "Please use larger screen" */
```

### Panel Communication

```typescript
// utils/panelEvents.ts

export type PanelEvent =
  | { type: 'INSIGHT_CLICKED'; payload: { insightId: string } }
  | { type: 'TOPIC_CLICKED'; payload: { topicId: string } }
  | { type: 'CONVERSATION_OPENED'; payload: { conversationId: string } }
  | { type: 'OUTPUT_GENERATED'; payload: { outputId: string } };

class PanelEventBus {
  private handlers = new Map<string, Array<(payload: any) => void>>();
  
  emit(event: PanelEvent) {
    const handlers = this.handlers.get(event.type) || [];
    handlers.forEach(handler => handler(event.payload));
  }
  
  on(type: PanelEvent['type'], handler: (payload: any) => void) {
    const handlers = this.handlers.get(type) || [];
    handlers.push(handler);
    this.handlers.set(type, handlers);
  }
  
  off(type: PanelEvent['type'], handler: (payload: any) => void) {
    const handlers = this.handlers.get(type) || [];
    const filtered = handlers.filter(h => h !== handler);
    this.handlers.set(type, filtered);
  }
}

export const panelEvents = new PanelEventBus();
```

**Usage Example:**
```typescript
// In ExplorePanelComponent
const handleInsightClick = (insightId: string) => {
  panelEvents.emit({ 
    type: 'INSIGHT_CLICKED', 
    payload: { insightId } 
  });
};

// In ChatPanelComponent
useEffect(() => {
  const handler = ({ insightId }: { insightId: string }) => {
    // Find and highlight message that created this insight
    scrollToMessage(insightId);
  };
  
  panelEvents.on('INSIGHT_CLICKED', handler);
  return () => panelEvents.off('INSIGHT_CLICKED', handler);
}, []);
```

---

## 4. Component Specifications

### Left Panel: Explore

#### SubjectOverviewCard

```typescript
interface SubjectOverviewCardProps {
  subject: Subject;
  error?: ErrorState;
}

// Visual (MVP - Simple)
<div className="subject-overview">
  <h2>{subject.title}</h2>
  <div className="stage-badge stage-{stage}">
    {STAGE_LABELS[stage]}
  </div>
  <p className="stage-description">
    {STAGE_DESCRIPTIONS[stage]}
  </p>
  <p className="last-active">
    Last active: {formatTimestamp(subject.lastActiveAt)}
  </p>
</div>

// Timestamp Format (MVP - Simple)
function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// Stage Labels
const STAGE_LABELS = {
  exploring: '● Exploring',
  building: '◆ Building Knowledge',
  synthesizing: '◆ Ready to Synthesize',
  mature: '★ Knowledge Mature',
} as const;

const STAGE_DESCRIPTIONS = {
  exploring: 'Just getting started',
  building: 'Building substantial understanding',
  synthesizing: "You've built solid understanding",
  mature: 'Rich understanding with insights',
} as const;

// Error Handling
if (error) {
  return <ErrorDisplay error={error} />;
}

// No animations in MVP
// No confetti in MVP
// No celebrations in MVP
```

#### InsightsList

```typescript
interface InsightsListProps {
  insights: Insight[];
  error?: ErrorState;
  onInsightClick?: (insightId: string) => void;
}

// Visual (MVP)
<div className="insights-list">
  <h3>Recent Insights</h3>
  {insights.length === 0 ? (
    <EmptyState message={ERROR_MESSAGES.empty.insights} />
  ) : (
    <ul>
      {insights.slice(0, 5).map(insight => (
        <li 
          key={insight.id}
          onClick={() => onInsightClick?.(insight.id)}
          className="insight-item"
        >
          <p className="insight-content">{insight.content}</p>
          <div className="insight-meta">
            <span className="category">{insight.category}</span>
            <span className="time">{formatTimestamp(insight.createdAt)}</span>
          </div>
        </li>
      ))}
    </ul>
  )}
</div>

// Limits:
// - Show max 5 insights
// - Max 7 days old
// - No "View all" modal in MVP (comes later)
// - No glow animations in MVP
```

#### TopicsList

```typescript
interface TopicsListProps {
  topics: Topic[];
  error?: ErrorState;
  onTopicClick?: (topicId: string) => void;
}

// Visual (MVP - Flat list, no tree)
<div className="topics-list">
  <h3>Topics</h3>
  {topics.length === 0 ? (
    <EmptyState message={ERROR_MESSAGES.empty.topics} />
  ) : (
    <ul>
      {topics.map(topic => (
        <li 
          key={topic.id}
          onClick={() => onTopicClick?.(topic.id)}
          className="topic-item"
        >
          <span className="topic-emoji">{topic.emoji}</span>
          <span className="topic-name">{topic.name}</span>
        </li>
      ))}
    </ul>
  )}
</div>

// MVP Constraints:
// - Flat list (no tree hierarchy)
// - No expandable sections
// - No "unread" indicators
// - Show all topics (assume <50 for MVP)
// - If >50 topics, show first 50 with "View all" button
```

---

### Center Panel: Chat

#### ConversationList

```typescript
interface ConversationListProps {
  conversations: Conversation[];
  onConversationClick: (conversationId: string) => void;
  error?: ErrorState;
}

// Visual (MVP - Simple list, no grouping)
<div className="conversation-list">
  <div className="header">
    <h2>Conversations</h2>
    <button onClick={onNewConversation}>New</button>
  </div>
  
  {conversations.length === 0 ? (
    <EmptyState message={ERROR_MESSAGES.empty.conversations} />
  ) : (
    <ul>
      {conversations.map(conv => (
        <ConversationCard
          key={conv.id}
          conversation={conv}
          onClick={() => onConversationClick(conv.id)}
        />
      ))}
    </ul>
  )}
</div>

// MVP Constraints:
// - Show last 20 conversations (no pagination)
// - Simple list (no "Today/Yesterday" grouping)
// - No search (comes later)
// - No filters (comes later)
```

#### ConversationCard

```typescript
interface ConversationCardProps {
  conversation: Conversation;
  onClick: () => void;
}

// Visual (MVP - Minimal metadata)
<div className="conversation-card" onClick={onClick}>
  <h4 className="title">{conversation.title}</h4>
  <p className="preview">{conversation.preview}</p>
  <span className="time">{formatTimestamp(conversation.lastMessageAt)}</span>
</div>

// MVP - Show ONLY:
// - Title
// - Preview (1 line, truncated at 60 chars)
// - Timestamp

// NOT in MVP:
// - Message count
// - Insight count
// - Topic tags
// - Read progress
// - Unread indicator
```

#### MessageView

```typescript
interface MessageViewProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onBack: () => void;
  error?: ErrorState;
}

// Visual (MVP - Basic chat)
<div className="message-view">
  <div className="header">
    <button onClick={onBack}>← Back</button>
    <h3>{conversation.title}</h3>
  </div>
  
  <div className="messages">
    {messages.map(msg => (
      <MessageBubble key={msg.id} message={msg} />
    ))}
  </div>
  
  <div className="input-area">
    <input 
      type="text"
      placeholder="Type a message..."
      onKeyPress={handleEnter}
    />
    <button onClick={handleSend}>Send</button>
  </div>
</div>

// MVP Constraints:
// - Simple scroll (no virtual scrolling)
// - Max 500 messages loaded (assume conversations are short)
// - No inline insight cards
// - No typing indicators
// - No read receipts
```

#### MessageBubble

```typescript
interface MessageBubbleProps {
  message: Message;
}

// Visual (MVP - Text only)
<div className={`message ${message.isUser ? 'user' : 'assistant'}`}>
  <p>{message.content}</p>
  <span className="time">{formatTimestamp(message.createdAt)}</span>
</div>

// MVP - Show ONLY:
// - Message content
// - Timestamp

// NOT in MVP:
// - Inline insight cards
// - Avatar images
// - Edit/delete actions
// - Copy button
// - Regenerate button
```

---

### Right Panel: Create

#### OutputGenerator

```typescript
interface OutputGeneratorProps {
  subject: Subject;
  canGenerate: boolean;
  onGenerate: (type: 'summary' | 'guide') => void;
  isGenerating: boolean;
}

// Visual (MVP - 2 templates only)
<div className="output-generator">
  <h3>Generate</h3>
  
  {!canGenerate ? (
    <div className="locked-state">
      <p>Keep chatting to unlock output generation</p>
      <p className="hint">
        Available at: {getNextStage(subject.expertiseStage)}
      </p>
    </div>
  ) : (
    <>
      <TemplateCard
        type="summary"
        title="Quick Summary"
        description="Overview of key insights"
        estimatedTime="30 seconds"
        onGenerate={() => onGenerate('summary')}
        disabled={isGenerating}
      />
      
      <TemplateCard
        type="guide"
        title="Study Guide"
        description="Structured learning guide"
        estimatedTime="2 minutes"
        onGenerate={() => onGenerate('guide')}
        disabled={isGenerating}
      />
    </>
  )}
</div>

// MVP Constraints:
// - ONLY 2 templates (Summary, Guide)
// - No custom generation
// - No template library
// - No expandable sections
// - Generation unlocked at "building" stage and above
```

#### TemplateCard

```typescript
interface TemplateCardProps {
  type: string;
  title: string;
  description: string;
  estimatedTime: string;
  onGenerate: () => void;
  disabled: boolean;
}

// Visual (MVP - Simple card)
<div className="template-card">
  <h4>{title}</h4>
  <p>{description}</p>
  <p className="estimated-time">⚡ {estimatedTime}</p>
  <button 
    onClick={onGenerate}
    disabled={disabled}
    className="generate-btn"
  >
    {disabled ? 'Generating...' : 'Generate'}
  </button>
</div>

// MVP - Show ONLY:
// - Title
// - Description
// - Estimated time
// - Generate button

// NOT in MVP:
// - "Recommended" badge
// - "Uses X insights" metadata
// - Progress bar during generation
// - Customization options
```

#### RecentOutputsList

```typescript
interface RecentOutputsListProps {
  outputs: Output[];
  onOutputClick: (outputId: string) => void;
}

// Visual (MVP - Simple list)
<div className="recent-outputs">
  <h3>Recent Outputs</h3>
  {outputs.length === 0 ? (
    <EmptyState message={ERROR_MESSAGES.empty.outputs} />
  ) : (
    <ul>
      {outputs.slice(0, 3).map(output => (
        <li 
          key={output.id}
          onClick={() => onOutputClick(output.id)}
          className="output-item"
        >
          <span className="output-title">{output.title}</span>
          <span className="output-time">
            {formatTimestamp(output.generatedAt)}
          </span>
        </li>
      ))}
    </ul>
  )}
</div>

// MVP Constraints:
// - Show last 3 outputs only
// - Click opens output in modal
// - No hover actions
// - No regenerate button
// - No export button
```

---

## 5. Error Handling (Every Component)

### Standard Error Component

```typescript
interface ErrorDisplayProps {
  error: ErrorState;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (error.type === 'loading') {
    return <LoadingState />;
  }
  
  if (error.type === 'empty') {
    return <EmptyState message={error.message} />;
  }
  
  return (
    <div className="error-state">
      <p className="error-message">{error.message}</p>
      {error.retryAction && (
        <button onClick={error.retryAction}>Try Again</button>
      )}
      {process.env.NODE_ENV === 'development' && error.details && (
        <details>
          <summary>Debug Info</summary>
          <pre>{error.details}</pre>
        </details>
      )}
    </div>
  );
};
```

### Loading States

```typescript
export const LoadingState: React.FC = () => (
  <div className="loading-state">
    <div className="spinner" />
    <p>Loading...</p>
  </div>
);

// MVP: Simple spinner, no skeleton screens
```

### Empty States

```typescript
export const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="empty-state">
    <p>{message}</p>
  </div>
);

// MVP: Text only, no illustrations
```

### Network Error Handling

```typescript
// utils/errorHandling.ts

export function handleApiError(error: unknown): ErrorState {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      type: 'offline',
      message: ERROR_MESSAGES.offline,
      retryAction: () => window.location.reload(),
    };
  }
  
  if (error instanceof Error) {
    return {
      type: 'error',
      message: ERROR_MESSAGES.error.fetch,
      details: error.message,
      retryAction: () => window.location.reload(),
    };
  }
  
  return {
    type: 'error',
    message: 'Something went wrong',
  };
}
```

---

## 6. Animation Specifications (MVP - Minimal)

```css
/* Only basic transitions in MVP */

/* Panel transitions: NONE in MVP */
/* (Fixed layout, no expanding/collapsing) */

/* View transitions: Simple fade */
.view-transition {
  animation: fadeIn 200ms ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Button hover */
button {
  transition: background-color 150ms ease;
}

/* Focus states */
*:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* NO animations in MVP: */
/* - Confetti */
/* - Badge morphing */
/* - Glow effects */
/* - Slide transitions */
/* - Stagger animations */
/* - Loading skeletons */
```

---

## 7. Accessibility (MVP - Basic)

```typescript
// Keyboard Navigation

// Tab order (left to right, top to bottom):
// 1. Explore panel items
// 2. Chat panel items
// 3. Create panel items

// Keyboard shortcuts (MVP - Essential only):
const SHORTCUTS = {
  newConversation: 'Ctrl+N',
  search: 'Ctrl+K',
  focusInput: '/',
};

// ARIA labels (Examples):
<nav aria-label="Explore panel">
<main aria-label="Chat panel">
<aside aria-label="Create panel">

<button aria-label="Send message">
<button aria-label="Generate summary">

// Screen reader announcements (MVP - Critical only):
const announce = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
};

// Examples:
announce('Message sent');
announce('Generating summary...');
announce('Summary generated');

// NOT in MVP:
// - Advanced keyboard shortcuts
// - Focus management for complex interactions
// - High contrast mode
// - Screen reader optimized navigation
```

---

## 8. Performance Targets (MVP)

```typescript
// Realistic targets for MVP

// Page Load
- Initial render: < 2 seconds
- Time to interactive: < 3 seconds

// Interactions
- Button click response: < 100ms
- Panel switch: < 200ms (just fade)
- Message send: < 500ms (optimistic update)

// Data Loading
- Fetch conversations: < 1 second
- Fetch messages: < 1 second
- Generate output: 5-30 seconds (with progress indicator)

// Scalability Limits (MVP)
- Max 50 topics: Show all
- Max 20 conversations: Show all
- Max 500 messages: Load all (no virtual scrolling)
- Max 5 recent insights: Show all

// NOT in MVP:
// - Virtual scrolling
// - Lazy loading
// - Code splitting
// - Service workers
// - Offline mode
```

---

## 9. Testing Strategy (MVP)

```typescript
// Unit Tests (Critical paths only)

// Component rendering
test('SubjectOverviewCard renders with subject data', () => {
  render(<SubjectOverviewCard subject={mockSubject} />);
  expect(screen.getByText(mockSubject.title)).toBeInTheDocument();
});

// Error states
test('InsightsList shows empty state when no insights', () => {
  render(<InsightsList insights={[]} />);
  expect(screen.getByText(/No insights yet/)).toBeInTheDocument();
});

// Interactions
test('ConversationCard calls onClick when clicked', () => {
  const onClick = jest.fn();
  render(<ConversationCard conversation={mockConv} onClick={onClick} />);
  fireEvent.click(screen.getByRole('button'));
  expect(onClick).toHaveBeenCalled();
});

// Integration Tests (Happy paths only)
test('Opening conversation loads messages', async () => {
  render(<ChatPanel />);
  fireEvent.click(screen.getByText('Test Conversation'));
  await waitFor(() => {
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});

// E2E Tests (Critical user journeys)
test('User can send message and receive response', async () => {
  // Navigate to subject
  // Open conversation
  // Type message
  // Send message
  // Verify message appears
  // Verify AI response appears
});

// NOT in MVP:
// - Visual regression tests
// - Performance tests
// - Load tests
// - Accessibility audits (manual only)
```

---

## 10. Development Phases

### Week 1-2: Foundation
- Set up component structure
- Define all interfaces
- Create ErrorBoundary, LoadingState, EmptyState
- Implement panelEvents bus
- Create mock data for development

### Week 3-4: Left Panel (Explore)
- SubjectOverviewCard
- InsightsList
- TopicsList
- Error handling for each
- Manual testing

### Week 5-6: Center Panel (Chat)
- ConversationList
- ConversationCard
- MessageView
- MessageBubble
- Mode switching (list ↔ active)
- Manual testing

### Week 7-8: Right Panel (Create)
- OutputGenerator
- TemplateCard
- RecentOutputsList
- Generation flow
- Manual testing

### Week 9-10: Integration
- Panel communication
- Error handling across panels
- Loading states
- Empty states
- Integration testing

### Week 11: Polish
- CSS refinements
- Accessibility fixes
- Performance optimization
- Bug fixes

### Week 12: Testing & Documentation
- E2E test suite
- User testing
- Bug bash
- Documentation
- Deployment prep

---

## 11. What Comes AFTER MVP

### Phase 2: Polish (Months 4-6)
- Expandable sections
- Better animations
- Panel collapsing
- Remember preferences
- Search functionality
- Better error messages

### Phase 3: Enhancement (Months 7-9)
- Responsive breakpoints
- Mobile support
- Real-time updates
- Advanced templates
- Custom generation
- Analytics

### Phase 4: Intelligence (Months 10+)
- AI categorization
- Context-aware features
- Adaptive defaults
- Celebration animations
- Advanced gestures

---

## Summary: MVP vs Full Spec

| Feature | Full Spec | MVP |
|---------|-----------|-----|
| **Timeline** | 6-9 months | 3 months |
| **Components** | 18 components | 12 components |
| **Animations** | Confetti, morphing, glows | Fade only |
| **Responsive** | 4 breakpoints | Desktop only |
| **Panels** | Collapsible, resizable | Fixed |
| **Real-time** | WebSocket everywhere | Manual refresh |
| **Templates** | 6+ with custom | 2 fixed templates |
| **Error handling** | Not specified | Every component |
| **Data models** | Vague | Fully defined |
| **Communication** | Undefined | Event bus specified |

---

## Key Principles

1. **Build what works first**: Core functionality with solid error handling
2. **Measure before optimizing**: See what users actually need
3. **One thing at a time**: No parallel feature development
4. **Test everything**: Unit + Integration + E2E
5. **Document as you go**: Code is the documentation
6. **No premature optimization**: Performance matters, but working matters more

---

**This is what you can actually build in 3 months.**

The full spec is the vision. This MVP is the foundation that gets you there.
