---
name: core-user-journey
status: backlog
created: 2025-10-14T21:08:54Z
progress: 0%
prd: .claude/prds/core-user-journey.md
github: null
---

# Epic: Core User Journey

## Overview

Implement the foundational user experience for Lumara - enabling users to create, view, and manage memories through a conversational interface. This epic builds directly on Wave 0.2's AI foundation (Chrome AI, embeddings, contradiction detection) and requires only UI components and state management.

**Target:** Ship in 7 days with <10 tasks total.

**Key Insight:** We already have 90% of the backend logic - this is primarily a UI/UX implementation challenge.

## Architecture Decisions

### 1. Component Architecture: Feature-Based Organization
**Decision:** Organize by feature (conversation/, memories/, contradictions/) rather than technical layer
**Rationale:** Clearer separation of concerns, easier parallel development, aligns with domain model

### 2. State Management: Zustand + TanStack Query
**Decision:** Zustand for UI state, TanStack Query for server state (AI + DB)
**Rationale:** Already in stack, lightweight, excellent TypeScript support, proven pattern from Wave 0.2

### 3. Data Flow: Dexie Live Queries
**Decision:** Use Dexie's `useLiveQuery()` for reactive memory updates
**Rationale:** Automatic re-renders on data changes, no manual subscriptions, IndexedDB-native

### 4. AI Integration: Direct Provider Usage
**Decision:** Use existing `aiProvider.chat()` directly, no additional abstraction
**Rationale:** Provider abstraction already exists from Wave 0.2, don't over-engineer

### 5. Search Strategy: Client-Side Semantic Search
**Decision:** Use existing embedding + similarity search from Wave 0.2
**Rationale:** All infrastructure ready, <50ms for 1000 memories, no backend needed

### 6. Styling: Tailwind Utility-First
**Decision:** Pure Tailwind CSS, no component library
**Rationale:** Full control, smaller bundle, consistent with project setup

### 7. Testing: Jest + RTL + Playwright
**Decision:** Unit tests with Jest, integration with RTL, E2E with Playwright
**Rationale:** Already configured, maintain >90% coverage like Wave 0.2

## Technical Approach

### Frontend Components (New)

**Conversation Feature:**
```
src/components/conversation/
├── ChatInterface.tsx          # Main container, orchestrates everything
├── MessageList.tsx            # Scrollable message history
├── MessageBubble.tsx          # Individual message (user/AI)
├── InputField.tsx             # Multiline input with send button
└── MemoryExtraction.tsx       # AI-extracted memory preview + edit
```

**Memories Feature:**
```
src/components/memories/
├── MemoryList.tsx             # Main container, filters + list
├── MemoryCard.tsx             # Individual memory display
├── MemoryFilters.tsx          # Type filters + search bar
└── MemoryActions.tsx          # Edit/delete dropdown menu
```

**Contradictions Feature:**
```
src/components/contradictions/
├── ContradictionAlert.tsx     # Inline warning banner
└── ContradictionResolution.tsx # Side-by-side + action buttons
```

**Layout:**
```
src/components/layout/
├── AppLayout.tsx              # Two-column: memories | conversation
├── EmptyState.tsx             # "Create your first memory" placeholder
└── Header.tsx                 # App title + future user menu
```

### State Management (New)

**Zustand Stores:**
```typescript
// src/stores/conversationStore.ts
interface ConversationState {
  messages: Message[];
  isTyping: boolean;
  addMessage: (msg: Message) => void;
  setTyping: (typing: boolean) => void;
  clear: () => void;
}

// src/stores/uiStore.ts
interface UIState {
  selectedMemoryId: number | null;
  filterType: MemoryType | 'all';
  searchQuery: string;
  setFilter: (type: MemoryType | 'all') => void;
  setSearch: (query: string) => void;
}
```

### Custom Hooks (New)

```typescript
// src/hooks/useConversation.ts
// Manages chat with AI, uses aiProvider.chat()

// src/hooks/useMemories.ts
// CRUD operations with Dexie, uses useLiveQuery()

// src/hooks/useMemorySearch.ts
// Semantic search using existing embeddings

// src/hooks/useContradictions.ts
// Detects contradictions using existing detectContradictions()
```

### Database Operations (Leverage Existing)

**Already Complete from Wave 0.2:**
- ✅ Memory schema in `src/lib/db/schema.ts`
- ✅ Dexie database setup
- ✅ Embedding generation
- ✅ Similarity search
- ✅ Contradiction detection

**New Operations Needed:**
```typescript
// src/lib/db/memories.ts (new file)
export async function createMemory(data: Omit<Memory, 'id'>): Promise<number>
export async function updateMemory(id: number, data: Partial<Memory>): Promise<void>
export async function deleteMemory(id: number): Promise<void>
export async function searchMemories(query: string): Promise<Memory[]>
export async function filterMemories(type: MemoryType): Promise<Memory[]>
```

### AI Integration (Leverage Existing)

**Memory Extraction Pattern:**
```typescript
// src/lib/ai/memory-extraction.ts (new file)
export async function extractMemoryFromConversation(
  messages: Message[]
): Promise<{
  content: string;
  type: MemoryType;
  tags: string[];
  confidence: number;
}>

// Uses aiProvider.chat() with structured prompt
// Existing provider abstraction handles all AI complexity
```

## Implementation Strategy

### Phase 1: Core Data Flow (Days 1-2)
**Goal:** Get memory creation working end-to-end, no UI polish

1. Create Dexie operations wrapper (`memories.ts`)
2. Build `useMemories` hook with CRUD
3. Create minimal `ChatInterface` + `InputField`
4. Connect AI provider for basic chat
5. Implement memory extraction logic
6. Test: User can create memory via conversation

**Deliverable:** Working memory creation flow (ugly but functional)

### Phase 2: Memory Viewing (Days 3-4)
**Goal:** Users can see and interact with memories

1. Build `MemoryList` + `MemoryCard` components
2. Implement `useMemorySearch` with semantic search
3. Add filters (type) and search UI
4. Build `MemoryActions` (edit/delete)
5. Test: Users can browse, search, edit, delete

**Deliverable:** Full memory management UI

### Phase 3: Conversation Polish (Day 5)
**Goal:** Conversation feels natural and responsive

1. Add message history display (`MessageList`)
2. Improve `MessageBubble` styling
3. Add typing indicator
4. Build `MemoryExtraction` preview component
5. Polish input field (multiline, keyboard shortcuts)
6. Test: Conversation feels smooth and intuitive

**Deliverable:** Polished conversational experience

### Phase 4: Contradictions + Layout (Days 6-7)
**Goal:** Complete feature set with contradiction detection

1. Implement `ContradictionAlert` component
2. Build `ContradictionResolution` UI
3. Hook up `useContradictions` to memory save
4. Create `AppLayout` with two-column design
5. Add `EmptyState` for first-time users
6. Polish + responsive design
7. E2E testing with Playwright

**Deliverable:** Complete Wave 1 feature set

### Risk Mitigation

**Risk 1: Chrome AI Unavailable**
- Mitigation: Graceful fallback message + manual memory creation mode
- Detection: Try `window.ai` on mount, show warning if missing

**Risk 2: Performance with Many Memories**
- Mitigation: Virtual scrolling (react-window) if >100 memories
- Defer: Not expected in Week 1, can add later if needed

**Risk 3: Contradiction Detection False Positives**
- Mitigation: Set threshold high (>0.90 instead of >0.85)
- Fallback: User can always "Keep Both" to dismiss

**Risk 4: Memory Extraction Quality**
- Mitigation: Always allow manual edit before save
- Fallback: Simple form input if extraction fails

## Task Breakdown (8 Tasks Total)

### Task 1: Database Operations & Hooks
**Effort:** 1 day
**Scope:**
- Create `src/lib/db/memories.ts` with CRUD operations
- Build `src/hooks/useMemories.ts` hook
- Build `src/hooks/useConversation.ts` hook
- Write unit tests for all operations
- Verify Dexie live queries work reactively

**Dependencies:** None (Wave 0.2 complete)

---

### Task 2: Basic Chat Interface
**Effort:** 1 day
**Scope:**
- Create `ChatInterface.tsx` component
- Create `InputField.tsx` with multiline support
- Connect to `useConversation` hook
- Basic message display (simple list)
- Send message to AI provider
- Handle loading states

**Dependencies:** Task 1

---

### Task 3: Memory Extraction & Creation
**Effort:** 1 day
**Scope:**
- Create `src/lib/ai/memory-extraction.ts`
- Build extraction prompt engineering
- Create `MemoryExtraction.tsx` preview component
- Allow edit before save
- Save to Dexie with embedding generation
- Show confirmation feedback

**Dependencies:** Tasks 1, 2

---

### Task 4: Memory List & Cards
**Effort:** 1 day
**Scope:**
- Create `MemoryList.tsx` container
- Create `MemoryCard.tsx` component
- Display all memories (reverse chronological)
- Card styling with type badges
- Expand/collapse for details
- Empty state component

**Dependencies:** Task 1

---

### Task 5: Search & Filters
**Effort:** 1 day
**Scope:**
- Create `src/hooks/useMemorySearch.ts`
- Semantic search using existing embeddings
- Build `MemoryFilters.tsx` UI
- Type filters (knowledge/experience/method)
- Keyword search bar
- Real-time filter updates

**Dependencies:** Tasks 1, 4

---

### Task 6: Memory Actions (Edit/Delete)
**Effort:** 0.5 days
**Scope:**
- Create `MemoryActions.tsx` dropdown
- Edit modal/inline form
- Delete confirmation dialog
- Optimistic updates
- Error handling

**Dependencies:** Task 4

---

### Task 7: Contradiction Detection UI
**Effort:** 1 day
**Scope:**
- Create `src/hooks/useContradictions.ts`
- Create `ContradictionAlert.tsx` banner
- Create `ContradictionResolution.tsx` modal
- Side-by-side comparison view
- Resolution actions (Keep Both/Replace/Keep Original)
- Save resolution to memory metadata

**Dependencies:** Task 3

---

### Task 8: Layout & Polish
**Effort:** 1.5 days
**Scope:**
- Create `AppLayout.tsx` (two-column design)
- Create `Header.tsx` component
- Polish conversation UI (`MessageList`, `MessageBubble`)
- Add typing indicator
- Keyboard shortcuts (Enter to send)
- Responsive design (mobile-friendly)
- E2E tests with Playwright
- Accessibility audit

**Dependencies:** All previous tasks

---

## Dependencies

### External Dependencies (All Satisfied ✅)
- React 19.0.0
- TypeScript 5.9
- Vite 7.0
- Dexie 4.0.10
- Zustand 5.0.2
- TanStack Query 5.62.7
- Tailwind CSS 4.0
- Framer Motion 12.0
- Vitest + React Testing Library
- Playwright

### Internal Dependencies (Wave 0.2 Complete ✅)
- AI Provider System (`src/lib/ai/providers/`)
- Chrome AI integration
- Embeddings (`src/lib/ai/embeddings/`)
- Similarity search (`src/lib/ai/utils/similarity.ts`)
- Contradiction detection (`src/lib/ai/utils/contradiction.ts`)
- Error handling & retry logic
- Dexie database with Memory schema

### Blocking Issues
- None identified

## Success Criteria (Technical)

### Performance Benchmarks
- [ ] Time to first memory: <2 minutes (measured with Playwright)
- [ ] Memory list render: <500ms for 100 items
- [ ] Search results: <200ms (semantic search)
- [ ] AI response time: <3 seconds (Chrome AI)
- [ ] Embedding generation: <100ms (cached)
- [ ] No layout shift during interactions (CLS <0.1)

### Quality Gates
- [ ] Unit test coverage: >90% (maintain Wave 0.2 standard)
- [ ] All E2E critical paths covered (Playwright)
- [ ] Zero TypeScript errors
- [ ] Zero ESLint warnings
- [ ] Accessible (WCAG 2.1 AA)
- [ ] Works offline (local-first verified)

### Acceptance Criteria
- [ ] User can create first memory in <2 minutes
- [ ] User can browse all memories
- [ ] Search finds relevant memories (semantic)
- [ ] Filters work correctly
- [ ] Edit/delete operations work
- [ ] Contradiction alerts appear when appropriate
- [ ] Resolution options save correctly
- [ ] UI is responsive (desktop + mobile)
- [ ] No critical bugs

### User Experience Validation
- [ ] Conversation feels natural (not forced)
- [ ] UI is clean and uncluttered
- [ ] Memory cards are scannable
- [ ] Search is intuitive
- [ ] Error messages are helpful
- [ ] Loading states are clear

## Estimated Effort

### Overall Timeline
**Total:** 7 working days (1 calendar week)

**Critical Path:**
1. Task 1 (Database + Hooks) → 1 day
2. Task 2 (Chat Interface) → 1 day
3. Task 3 (Memory Extraction) → 1 day
4. Task 7 (Contradictions) → 1 day
5. Task 8 (Layout + Polish) → 1.5 days

**Parallel Work Opportunities:**
- Tasks 4-6 (Memory UI) can run parallel to Tasks 2-3 (Conversation)
- Task 7 (Contradictions) can run parallel to Task 6 (Actions)

### Resource Requirements
- 1 full-stack developer (you + Claude Code)
- Chrome browser with AI features enabled
- No backend/infrastructure resources needed

### Risk Buffer
- Built-in: 0.5 days for unexpected issues
- If needed: Can defer Task 7 (Contradictions) to Week 2 without blocking Wave 1 success

## Simplification Opportunities

### What We're NOT Building (Leveraging Existing)
- ❌ AI provider system (already exists)
- ❌ Embedding generation (already exists)
- ❌ Similarity search algorithm (already exists)
- ❌ Contradiction detection logic (already exists)
- ❌ Error handling (already exists)
- ❌ Retry logic (already exists)
- ❌ Database schema (already exists)

### What We're Building (Only UI/UX)
- ✅ 9 React components (~1200 lines total)
- ✅ 4 custom hooks (~400 lines)
- ✅ 2 Zustand stores (~150 lines)
- ✅ 1 Dexie operations wrapper (~200 lines)
- ✅ 1 memory extraction module (~150 lines)
- ✅ Tests (~800 lines)

**Total New Code: ~2,900 lines (estimated)**

**Comparison:** Wave 0.2 added ~5,000 lines. This is 40% less code because we're leveraging that foundation.

## Testing Strategy

### Unit Tests (Jest + RTL)
```typescript
// Database operations
describe('memories.ts', () => {
  it('creates memory with embedding')
  it('updates memory preserves embedding')
  it('deletes memory and associated data')
  it('searches by keyword')
  it('filters by type')
})

// Hooks
describe('useMemories', () => {
  it('creates memory reactively updates list')
  it('handles optimistic updates')
  it('shows error on failure')
})

// Components
describe('ChatInterface', () => {
  it('sends message to AI')
  it('displays conversation history')
  it('extracts memory from conversation')
})
```

### Integration Tests (RTL)
```typescript
describe('Memory Creation Flow', () => {
  it('user creates memory end-to-end', async () => {
    // Type in chat
    // AI responds
    // Memory extracted
    // User edits
    // Saves successfully
    // Appears in list
  })
})
```

### E2E Tests (Playwright)
```typescript
test('first memory creation', async ({ page }) => {
  await page.goto('http://localhost:5173')
  await page.fill('[data-testid=chat-input]', 'React hooks run on render')
  await page.click('[data-testid=send-button]')
  await expect(page.locator('[data-testid=memory-card]')).toBeVisible()
})

test('search memories', async ({ page }) => {
  // Create 3 memories
  // Search for specific term
  // Verify correct results
})

test('contradiction detection', async ({ page }) => {
  // Create memory
  // Create conflicting memory
  // Verify alert appears
  // Resolve conflict
})
```

### Manual Testing Checklist
- [ ] Conversation feels natural
- [ ] Memory cards are readable
- [ ] Search finds relevant memories
- [ ] Filters work intuitively
- [ ] Mobile layout works
- [ ] Keyboard shortcuts work
- [ ] Error messages are clear
- [ ] Loading states are smooth

## Post-Implementation

### Wave 1 Completion Checklist
- [ ] All 8 tasks completed and merged
- [ ] 607+ tests passing (maintain coverage)
- [ ] E2E tests cover critical paths
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed
- [ ] Documentation updated
- [ ] PRD marked as implemented
- [ ] Context docs updated (`project-state.md`, `progress.md`)

### Wave 2 Preparation
Once Wave 1 is complete and merged:
- Review user feedback
- Identify improvements for Wave 2
- Begin Understanding Evolution MVP planning
- Consider: What data structures for tracking interpretation changes?

### Technical Debt to Track
- Virtual scrolling (only if >100 memories)
- Advanced filters (date ranges, complex queries)
- Memory versioning (for evolution tracking)
- Export/import functionality
- Keyboard shortcut customization

---

**Ready for decomposition:** Run `/pm:epic-decompose core-user-journey` to create individual task files.

---

## Tasks Created

- [ ] 001.md - Database Operations & Hooks (parallel: true, effort: 8h)
- [ ] 002.md - Basic Chat Interface (parallel: false, depends on: [001], effort: 8h)
- [ ] 003.md - Memory Extraction & Creation (parallel: false, depends on: [001, 002], effort: 8h)
- [ ] 004.md - Memory List & Cards (parallel: true, depends on: [001], conflicts: [008], effort: 8h)
- [ ] 005.md - Search & Filters (parallel: false, depends on: [001, 004], effort: 8h)
- [ ] 006.md - Memory Actions (Edit/Delete) (parallel: true, depends on: [004], conflicts: [008], effort: 4h)
- [ ] 007.md - Contradiction Detection UI (parallel: true, depends on: [003], effort: 8h)
- [ ] 008.md - Layout & Polish (parallel: false, depends on: [002, 003, 004, 005, 006, 007], conflicts: [004, 006], effort: 12h)

**Total tasks:** 8
**Parallel tasks:** 4 (001, 004, 006, 007)
**Sequential tasks:** 4 (002, 003, 005, 008)
**Estimated total effort:** 64 hours (8 working days, ~7 days with parallel execution)

### Execution Strategy

**Critical Path (Sequential):**
```
001 → 002 → 003 → 007 → 008
 8h    8h    8h    8h    12h = 44 hours (5.5 days)
```

**Parallel Opportunities:**
- Tasks 001 + 004 can run in parallel (Day 1)
- Tasks 006 + 007 can run in parallel (after dependencies met)
- Task 004-006 (Memory UI) can largely run parallel to 002-003 (Conversation)

**Optimal Schedule:**
- **Day 1:** Tasks 001 + 004 (parallel)
- **Day 2:** Task 002 (after 001) + Task 005 (after 001, 004)
- **Day 3:** Task 003 (after 001, 002) + Task 006 (after 004)
- **Day 4:** Task 007 (after 003)
- **Days 5-6.5:** Task 008 (final integration after all)

**Estimated completion:** 6.5 working days with optimal parallelization
