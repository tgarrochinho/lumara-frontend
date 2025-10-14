---
name: core-user-journey
description: Implement basic memory capture, conversation interface, and viewing functionality - the essential user experience foundation
status: backlog
created: 2025-10-14T21:05:35Z
---

# PRD: Core User Journey

## Executive Summary

The Core User Journey establishes Lumara's foundational user experience, enabling users to capture, view, and manage their memories through a conversational interface. This is Wave 1 of the Lumara development roadmap - the essential foundation that all future features depend on.

**Target:** Ship basic working product in 1 week where users can create their first memory in <2 minutes and immediately see value.

**Value Proposition:** Users can capture thoughts naturally through AI conversation, organize them by type (knowledge/experience/method), and browse them easily - all with local-first privacy.

## Problem Statement

### The Problem
Users need to be able to USE Lumara before we can differentiate with advanced features like Understanding Evolution tracking. Currently, there is no UI for:
- Creating memories
- Having conversations with the AI
- Viewing and browsing existing memories
- Basic contradiction detection alerts

Without these foundational capabilities, users cannot experience Lumara at all, and we cannot validate our core UX assumptions.

### Why Now?
- **Foundation First Strategy:** We correctly reordered the wave plan to build essential functionality before differentiation features
- **Fast Validation:** Need to test basic UX with real users quickly
- **Technical Readiness:** AI Foundation (Wave 0.2) is complete - Chrome AI, embeddings, contradiction detection all ready
- **Momentum:** Ship working features fast to build confidence and momentum

### Current State
- ✅ AI Provider System (Chrome AI + Mock)
- ✅ Embeddings (Transformers.js, 384-dim vectors)
- ✅ Contradiction Detection (backend logic complete)
- ✅ Dexie Database (Memory table schema ready)
- ❌ No UI components
- ❌ No user-facing features
- ❌ Cannot create or view memories

## User Stories

### Primary Persona: Sarah - Knowledge Worker
**Background:** Software engineer who learns constantly, reads documentation, tries new approaches, and wants to track what actually works.

**Pain Points:**
- Forgets what she learned last month
- Doesn't know which approaches she's already tried
- Can't recall why a certain technique works
- No way to organize knowledge vs. experience

### User Journey 1: First Memory Creation
```
As Sarah, I want to create my first memory quickly
So that I can start capturing knowledge without friction

Acceptance Criteria:
- [ ] User lands on clean, uncluttered interface
- [ ] Conversation UI is immediately visible
- [ ] User can type or speak naturally
- [ ] AI responds conversationally and extracts memory
- [ ] User can confirm memory type (knowledge/experience/method)
- [ ] Memory saves to local IndexedDB
- [ ] Confirmation shown with memory ID
- [ ] Time to first memory: <2 minutes
```

### User Journey 2: Conversational Memory Capture
```
As Sarah, I want to describe what I learned naturally
So that memory capture feels like talking to a colleague

Acceptance Criteria:
- [ ] Chat interface with message history
- [ ] AI asks clarifying questions
- [ ] Context-aware suggestions appear
- [ ] AI extracts structured memory from conversation
- [ ] User can edit AI's extraction before saving
- [ ] Multiple memories can be created in one conversation
- [ ] Conversation history persists during session
```

### User Journey 3: Browse & Search Memories
```
As Sarah, I want to see all my memories organized
So that I can find what I need quickly

Acceptance Criteria:
- [ ] List view shows all memories (reverse chronological)
- [ ] Filter by memory type (knowledge/experience/method)
- [ ] Search by keyword (content and tags)
- [ ] Memory cards show: content, type, date, confidence
- [ ] Click card to expand full details
- [ ] Edit and delete actions available
- [ ] Empty state with helpful onboarding
```

### User Journey 4: Contradiction Detection Alert
```
As Sarah, I want to know when new knowledge conflicts with existing knowledge
So that I can resolve contradictions consciously

Acceptance Criteria:
- [ ] Inline alert appears during memory creation
- [ ] Shows "Similar memory exists" warning
- [ ] Displays conflicting memory side-by-side
- [ ] Simple resolution options: Keep Both / Replace / Keep Original
- [ ] Resolution saves to memory history
- [ ] Uses existing contradiction detection (Wave 0.2)
```

## Requirements

### Functional Requirements

#### FR1: Memory Capture Flow
**Priority:** P0 (Critical)
- Conversational text input
- AI-powered memory extraction
- Memory type selection (knowledge/experience/method)
- Edit before save capability
- Save to Dexie IndexedDB
- Confirmation feedback

**Technical Details:**
- Use Chrome AI provider from Wave 0.2
- Memory interface already defined in `src/lib/db/schema.ts`
- Generate embeddings on save for future search
- Store conversation context in session

#### FR2: Conversation Interface
**Priority:** P0 (Critical)
- Chat UI component (message bubbles)
- User input field with multiline support
- AI response streaming (if supported by Chrome AI)
- Message history display
- Context preservation
- Loading states

**Technical Details:**
- React component using Zustand for state
- TanStack Query for AI API calls
- Framer Motion for smooth animations
- Tailwind CSS for styling

#### FR3: Memory Viewing & Browsing
**Priority:** P0 (Critical)
- List view with memory cards
- Filter controls (by type)
- Search bar (keyword search)
- Sort options (date, confidence)
- Card expand/collapse
- Edit/delete actions

**Technical Details:**
- Dexie live queries for reactive updates
- Virtual scrolling for performance (if >100 memories)
- IndexedDB full-text search
- Optimistic updates for edits/deletes

#### FR4: Basic Contradiction Detection UI
**Priority:** P1 (High)
- Inline contradiction alert
- Side-by-side comparison
- Resolution action buttons
- Save resolution decision
- Update memory metadata

**Technical Details:**
- Use existing `detectContradictions()` from Wave 0.2
- Threshold: similarity > 0.85
- Store resolution in memory.metadata.contradictionResolutions

### Non-Functional Requirements

#### NFR1: Performance
- Time to first memory: <2 minutes
- AI response time: <3 seconds (Chrome AI)
- Memory list render: <500ms for 100 items
- Search results: <200ms
- Embedding generation: <100ms (cached)

#### NFR2: Usability
- Zero learning curve - intuitive on first use
- Mobile-responsive (basic support)
- Keyboard shortcuts (Enter to send, Cmd+K for search)
- Accessible (WCAG 2.1 AA)
- Error messages are helpful and actionable

#### NFR3: Reliability
- Works offline (local-first)
- No data loss on crashes
- Graceful degradation if AI unavailable
- Form validation prevents invalid states
- Auto-save drafts during conversation

#### NFR4: Privacy
- All data stays local (IndexedDB)
- No server calls (except Chrome AI model download)
- No telemetry or tracking
- User owns their data completely

## Success Criteria

### Quantitative Metrics
1. **Time to First Memory:** <2 minutes for 90% of users
2. **Memory Creation Success Rate:** >95% of attempts succeed
3. **Search Effectiveness:** Users find target memory in <3 queries
4. **Contradiction Detection Accuracy:** >80% of contradictions caught
5. **System Performance:** All interactions <3 seconds

### Qualitative Metrics
1. **User Feedback:** "I can capture and organize my thoughts easily"
2. **Flow Naturalness:** Conversation feels intuitive, not forced
3. **Visual Clarity:** UI is clean and uncluttered
4. **Confidence:** Users trust the system with important knowledge

### Key Validation Questions
- Can users create their first memory without help?
- Does the conversation flow feel natural?
- Is the memory browsing experience intuitive?
- Do users understand memory types?
- Are contradiction alerts helpful or annoying?

## Technical Architecture

### Components to Build

```
src/
├── components/
│   ├── conversation/
│   │   ├── ChatInterface.tsx          # Main conversation UI
│   │   ├── MessageBubble.tsx          # Individual message
│   │   ├── InputField.tsx             # User input with multiline
│   │   └── TypingIndicator.tsx        # AI is thinking...
│   ├── memories/
│   │   ├── MemoryList.tsx             # List view container
│   │   ├── MemoryCard.tsx             # Individual memory card
│   │   ├── MemoryFilter.tsx           # Type filter controls
│   │   ├── MemorySearch.tsx           # Search bar
│   │   └── MemoryDetail.tsx           # Expanded memory view
│   ├── contradictions/
│   │   ├── ContradictionAlert.tsx     # Inline alert component
│   │   └── ContradictionResolution.tsx # Resolution UI
│   └── layout/
│       ├── AppLayout.tsx              # Main app shell
│       ├── Sidebar.tsx                # Navigation (future)
│       └── EmptyState.tsx             # No memories yet
├── hooks/
│   ├── useConversation.ts             # Conversation state management
│   ├── useMemories.ts                 # Memory CRUD operations
│   ├── useContradictions.ts           # Contradiction detection
│   └── useMemorySearch.ts             # Search functionality
└── lib/
    ├── db/
    │   └── memories.ts                # Dexie memory operations
    └── ai/
        └── memory-extraction.ts       # Extract memories from conversation
```

### Database Schema (Already Defined)
```typescript
interface Memory {
  id?: number;
  content: string;
  type: 'knowledge' | 'experience' | 'method';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  embedding?: number[];
  metadata: {
    confidence?: number;
    source?: string;
    contradictionResolutions?: Array<{
      contradictingMemoryId: number;
      resolution: 'keep-both' | 'replace' | 'keep-original' | 'merge';
      timestamp: Date;
    }>;
  };
}
```

### Integration Points
- **Chrome AI Provider:** `aiProvider.chat()` for conversation
- **Embeddings:** `generateEmbedding()` for search and contradictions
- **Contradiction Detection:** `detectContradictions()` on memory save
- **Dexie:** `db.memories` table for persistence
- **Zustand:** Global state for conversation and UI state

## UI/UX Specifications

### Layout
```
┌─────────────────────────────────────────────┐
│ Header: "Lumara" + User Menu                │
├─────────────────┬───────────────────────────┤
│                 │                           │
│  Memory List    │   Conversation            │
│  (Left Panel)   │   (Right Panel)           │
│                 │                           │
│  [Search]       │   ┌─────────────────┐     │
│  [Filters]      │   │ AI: Hello...    │     │
│                 │   └─────────────────┘     │
│  ┌───────────┐  │                           │
│  │ Memory 1  │  │   ┌─────────────────┐     │
│  └───────────┘  │   │ User: I learned │     │
│                 │   └─────────────────┘     │
│  ┌───────────┐  │                           │
│  │ Memory 2  │  │   [Type your message...]  │
│  └───────────┘  │                           │
│                 │                           │
└─────────────────┴───────────────────────────┘
```

### Visual Design Principles
- **Minimalist:** Clean, uncluttered interface
- **Conversational:** Chat-like experience
- **Responsive:** Works on desktop and mobile
- **Fast:** Optimistic updates, no loading spinners
- **Trustworthy:** Clear feedback, no surprises

### Color Palette (Tailwind)
- Primary: Blue-500 (trust, calm)
- Success: Green-500 (confirmation)
- Warning: Amber-500 (contradictions)
- Danger: Red-500 (delete)
- Neutral: Gray-50 to Gray-900 (backgrounds, text)

### Typography
- Headings: font-bold, text-lg/xl/2xl
- Body: font-normal, text-base
- Code: font-mono, text-sm
- Small: text-sm, text-gray-600

## Implementation Plan

### Day 1-2: Memory Capture Flow
**Tasks:**
- [ ] Create ChatInterface component
- [ ] Implement user input field
- [ ] Connect Chrome AI provider
- [ ] Build message history display
- [ ] Add memory type selection
- [ ] Implement save to Dexie
- [ ] Add confirmation feedback

**Deliverable:** User can create first memory through conversation

### Day 3-4: Conversation Interface Polish
**Tasks:**
- [ ] Add message bubbles with styling
- [ ] Implement typing indicator
- [ ] Add context-aware suggestions
- [ ] Build memory extraction UI
- [ ] Add edit-before-save capability
- [ ] Implement conversation persistence
- [ ] Add loading states

**Deliverable:** Conversation feels natural and intuitive

### Day 5-6: Memory Viewing & Browsing
**Tasks:**
- [ ] Create MemoryList component
- [ ] Build MemoryCard component
- [ ] Implement filter controls
- [ ] Add search functionality
- [ ] Build sort options
- [ ] Add edit/delete actions
- [ ] Create empty state

**Deliverable:** Users can browse and search memories easily

### Day 7: Basic Contradiction Detection UI
**Tasks:**
- [ ] Create ContradictionAlert component
- [ ] Build side-by-side comparison view
- [ ] Add resolution action buttons
- [ ] Implement resolution saving
- [ ] Update memory metadata
- [ ] Test with various contradictions

**Deliverable:** Users see contradiction alerts and can resolve them

## Constraints & Assumptions

### Constraints
- **Timeline:** 7 days to ship (1 week)
- **Technology:** Must use Chrome AI (Gemini Nano) - no API keys
- **Browser:** Chrome/Edge only (Chrome AI requirement)
- **Team:** Solo developer (you + Claude Code)
- **Scope:** MVP only - no advanced features yet

### Assumptions
- Chrome AI is reliable enough for basic conversation
- Users have Chrome 127+ with AI features enabled
- 100 memories is reasonable starting limit for performance
- Users understand "knowledge" vs "experience" vs "method" distinction
- Local-first is acceptable (no sync initially)

### Technical Assumptions
- React 19 is stable for production
- Dexie 4 handles concurrent operations well
- Transformers.js works reliably in browser
- Chrome AI model (Gemini Nano) is downloaded and available

## Out of Scope (Future Waves)

### Not in Wave 1
- ❌ Understanding Evolution tracking (Wave 2)
- ❌ Memory strength algorithms (Wave 3-4)
- ❌ Working memory panel (Wave 3)
- ❌ Consolidation engine (Wave 3)
- ❌ Living playbooks (Wave 5)
- ❌ Thinking coach (Wave 5)
- ❌ Pattern discovery (Wave 5)
- ❌ Advanced contradiction resolution UI (Wave 6)
- ❌ Duplication detection UI (Wave 7)
- ❌ Multi-provider support (Wave 8)
- ❌ Mobile apps
- ❌ Team collaboration
- ❌ Cloud sync

### Explicitly Excluded
- No animation complexity (save for Wave 3)
- No advanced filtering (date ranges, complex queries)
- No export/import (future)
- No memory versioning (future)
- No memory linking/relationships (future)
- No tags management UI (basic only)
- No keyboard shortcut customization
- No themes/customization

## Dependencies

### External Dependencies (Already Satisfied)
- ✅ React 19.0.0
- ✅ TypeScript 5.9
- ✅ Vite 7.0
- ✅ Dexie 4.0.10
- ✅ Zustand 5.0.2
- ✅ TanStack Query 5.62.7
- ✅ Tailwind CSS 4.0
- ✅ Framer Motion 12.0

### Internal Dependencies (Wave 0.2 - Complete)
- ✅ Chrome AI provider (`src/lib/ai/providers/chromeai.ts`)
- ✅ Mock AI provider (`src/lib/ai/providers/mock.ts`)
- ✅ Provider abstraction (`src/lib/ai/providers/types.ts`)
- ✅ Embeddings (`src/lib/ai/embeddings/`)
- ✅ Similarity search (`src/lib/ai/utils/similarity.ts`)
- ✅ Contradiction detection (`src/lib/ai/utils/contradiction.ts`)
- ✅ Error handling (`src/lib/ai/utils/error-handler.ts`)
- ✅ Retry logic (`src/lib/ai/utils/retry.ts`)

### Team Dependencies
- None (solo development)

### Blocking Issues
- None identified

## Risk Assessment

### High Risks
1. **Chrome AI Availability**
   - Risk: User doesn't have Chrome AI enabled
   - Mitigation: Graceful fallback message, instructions to enable
   - Impact: High (blocks core functionality)

2. **AI Quality**
   - Risk: Chrome AI responses are poor quality
   - Mitigation: Use Mock AI for testing, provide manual memory creation fallback
   - Impact: Medium (degrades UX but not blocking)

### Medium Risks
1. **Performance with Many Memories**
   - Risk: UI slows down with >100 memories
   - Mitigation: Virtual scrolling, pagination, indexed search
   - Impact: Medium (affects power users)

2. **Browser Compatibility**
   - Risk: Only works in Chrome/Edge
   - Mitigation: Clear browser requirements, detection, and messaging
   - Impact: Low (expected limitation)

### Low Risks
1. **IndexedDB Quota**
   - Risk: User runs out of storage
   - Mitigation: Monitor quota, warn user, provide cleanup tools
   - Impact: Low (unlikely with text-only memories)

## Testing Strategy

### Unit Tests
- Memory CRUD operations (Dexie)
- Contradiction detection logic
- Search and filter logic
- Memory extraction from conversation
- State management (Zustand stores)

### Integration Tests
- Memory creation flow end-to-end
- Conversation with AI provider
- Search with embeddings
- Contradiction detection during save
- Edit and delete operations

### E2E Tests (Playwright)
- User creates first memory (happy path)
- Browse and search memories
- Edit existing memory
- Delete memory
- Handle contradiction alert
- Empty state to first memory

### Manual Testing
- Conversation feels natural
- UI is intuitive
- Performance is acceptable
- Error states are clear
- Mobile responsiveness works

### Acceptance Testing
- Time to first memory <2 minutes
- All user stories have acceptance criteria met
- No critical bugs
- Performance targets hit

## Launch Checklist

### Pre-Launch
- [ ] All P0 features implemented
- [ ] 607+ tests passing (maintain test coverage)
- [ ] E2E tests cover critical paths
- [ ] Performance benchmarks met
- [ ] Browser compatibility verified
- [ ] Error states tested
- [ ] Empty states designed
- [ ] Loading states smooth
- [ ] Accessibility audit passed

### Launch Criteria
- [ ] Create first memory in <2 minutes ✅
- [ ] Browse and search works ✅
- [ ] Contradiction detection shows alerts ✅
- [ ] No critical bugs 🐛
- [ ] Code reviewed and merged
- [ ] Documentation updated

### Post-Launch
- [ ] Monitor for errors
- [ ] Gather user feedback
- [ ] Track success metrics
- [ ] Identify Wave 2 priorities
- [ ] Update context docs

## Success Definition

**Wave 1 is successful when:**

1. ✅ User can create first memory in <2 minutes
2. ✅ User can browse and search memories intuitively
3. ✅ User sees contradiction alerts when they occur
4. ✅ Flow feels natural and unforced
5. ✅ No critical bugs or blockers
6. ✅ Ready to build Wave 2 (Understanding Evolution) on this foundation

**User validation goal:**
"I can capture and organize my thoughts easily - this is useful!"

**Not yet expected:**
"This tracks my intellectual journey!" ← That's Wave 2

## Appendix

### Related Documents
- `docs/WAVE_ROADMAP.md` - Full wave plan
- `docs/WAVE_QUICK_REFERENCE.md` - Quick command reference
- `docs/ONBOARDING_COLD_START_STRATEGY.md` - First-time user experience
- `docs/UI_UX_SPECIFICATIONS.md` - Detailed UI/UX specs
- `docs/CORE_FEATURES.md` - Core feature definitions
- `.claude/prds/ai-foundation-setup.md` - AI system architecture (Wave 0.2)
- `.claude/prds/project-bootstrap.md` - Technical foundation (Wave 0.1)

### Glossary
- **Memory:** A captured piece of knowledge, experience, or method
- **Knowledge:** Facts, concepts, theories (e.g., "React hooks run on render")
- **Experience:** Personal observations from practice (e.g., "useState works well for simple counters")
- **Method:** Procedures and approaches (e.g., "Use useReducer for complex state")
- **Contradiction:** When two memories semantically conflict (similarity >0.85 with opposite meaning)
- **Embedding:** 384-dimensional vector representation of text for semantic search
- **Local-First:** Data stored in browser (IndexedDB), no server required
- **Chrome AI:** Built-in Gemini Nano model in Chrome browser

### Version History
- 2025-10-14: Initial PRD created for Wave 1
