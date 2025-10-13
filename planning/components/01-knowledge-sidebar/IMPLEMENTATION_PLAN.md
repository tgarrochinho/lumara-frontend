# Knowledge Sidebar - Implementation Plan

**Step-by-step guide for completing all planned work**
**Last Updated:** 2025-10-07

---

## 🎯 Implementation Philosophy

**Principles:**
1. **Work incrementally** - Complete one feature fully before moving to next
2. **Test continuously** - Verify each change works before proceeding
3. **Commit frequently** - Small, atomic commits with clear messages
4. **Document as you go** - Update docs when behavior changes
5. **Refactor before adding** - Clean up existing code before new features

---

## 📋 Phase 1: Code Cleanup & Refactoring (1-2 days)

**Goal:** Reduce technical debt before adding new features

### Task 1.1: Verify and Remove Deprecated Components

**Estimated Time:** 1-2 hours  
**Priority:** P2

**Steps:**
1. Search for imports of potentially deprecated components:
   ```bash
   grep -r "from './KnowledgeSidebar/PinnedIdeasSection'" src/
   grep -r "from './KnowledgeSidebar/TopicsSection'" src/
   grep -r "from './KnowledgeSidebar/ThemesSection'" src/
   grep -r "from './KnowledgeSidebar/SearchAndModeToggle'" src/
   ```

2. If no imports found, delete files:
   - `PinnedIdeasSection.tsx`
   - `TopicsSection.tsx`
   - `ThemesSection.tsx`
   - `SearchAndModeToggle.tsx`

3. Update `index.ts` exports to remove deleted components

4. Run build to ensure nothing breaks:
   ```bash
   npm run build
   ```

5. Commit:
   ```bash
   git add .
   git commit -m "chore: remove deprecated Knowledge Sidebar subcomponents"
   ```

**Dependencies:** None

**Acceptance Criteria:**
- No unused component files remain
- Build succeeds with no errors
- No broken imports

---

### Task 1.2: Extract MainView Component

**Estimated Time:** 4-6 hours  
**Priority:** P2

**Goal:** Reduce `KnowledgeSidebar.tsx` from 745 → ~400 lines

**Steps:**

#### Step 1.2.1: Create new file
```bash
touch src/components/features/KnowledgeSidebar/MainView.tsx
```

#### Step 1.2.2: Define MainView interface
```typescript
interface MainViewProps {
  filteredThemes: Array<ArtifactThemeGroup & { artifacts: Artifact[] }>;
  filteredPinnedIdeas: Artifact[];
  filteredArchivedIdeas: Artifact[];
  searchQuery: string;
  sectionCollapsed: Record<string, boolean>;
  onToggleSection: (section: string) => void;
  onTopicClick: (topicId: string) => void;
  onArtifactPin?: (artifactId: string) => void;
  onArtifactArchive?: (artifactId: string) => void;
  newArtifactIds: Set<string>;
  removingArtifactIds: Set<string>;
  getArtifactTopic: (artifactId: string) => string | null;
}
```

#### Step 1.2.3: Extract rendering logic
Move from `KnowledgeSidebar.tsx` (lines ~600-738):
- Pinned section rendering
- Topics section rendering
- Archive section rendering
- Empty state logic
- Search results handling

#### Step 1.2.4: Update main file
In `KnowledgeSidebar.tsx`:
```typescript
import { MainView } from './KnowledgeSidebar/MainView';

// ... keep state management and data filtering ...

if (selectedTopic) {
  return <TopicDetailView topic={selectedTopic} ... />;
}

return (
  <MainView
    filteredThemes={filteredThemes}
    filteredPinnedIdeas={filteredPinnedIdeas}
    filteredArchivedIdeas={filteredArchivedIdeas}
    // ... pass all props
  />
);
```

#### Step 1.2.5: Test and verify
1. Run dev server: `npm run dev`
2. Verify all functionality works:
   - Pinned section displays
   - Topics display correctly
   - Archive section works
   - Search filtering works
   - Animations still work

3. Check line count:
   ```bash
   wc -l src/components/features/KnowledgeSidebar.tsx
   wc -l src/components/features/KnowledgeSidebar/MainView.tsx
   ```
   Target: Main file ~500 lines, MainView ~250 lines

4. Commit:
   ```bash
   git add .
   git commit -m "refactor(KnowledgeSidebar): extract MainView component

   - Reduces main file from 745 to ~500 lines
   - Separates default view rendering from state management
   - Maintains all existing functionality"
   ```

**Dependencies:** None

**Acceptance Criteria:**
- `KnowledgeSidebar.tsx` < 600 lines
- All features work identically
- No regressions in UI or behavior
- Build succeeds

---

### Task 1.3: Extract TopicDetailView Component

**Estimated Time:** 4-6 hours  
**Priority:** P2

**Goal:** Further reduce `KnowledgeSidebar.tsx` to ~300 lines

**Steps:**

#### Step 1.3.1: Create new file
```bash
touch src/components/features/KnowledgeSidebar/TopicDetailView.tsx
```

#### Step 1.3.2: Define TopicDetailView interface
```typescript
interface TopicDetailViewProps {
  topic: ArtifactThemeGroup;
  artifacts: {
    focus: Artifact[];
    ideas: Artifact[];
    archived: Artifact[];
  };
  discoveries: KeyDiscovery[];
  sectionCollapsed: Record<string, boolean>;
  onToggleSection: (section: string) => void;
  onBack: () => void;
  onArtifactPin?: (artifactId: string) => void;
  onArtifactArchive?: (artifactId: string) => void;
  newArtifactIds: Set<string>;
  removingArtifactIds: Set<string>;
}
```

#### Step 1.3.3: Extract drill-down logic
Move from `KnowledgeSidebar.tsx` (lines ~374-577):
- Back button
- Topic header with summary
- Focus section rendering
- Key Discoveries section
- Ideas section rendering
- Archive in topic rendering

#### Step 1.3.4: Update main file
In `KnowledgeSidebar.tsx`:
```typescript
import { TopicDetailView } from './KnowledgeSidebar/TopicDetailView';

if (selectedTopic) {
  return (
    <TopicDetailView
      topic={selectedTopic}
      artifacts={{
        focus: topicFocusItems,
        ideas: topicIdeas,
        archived: topicArchivedIdeas,
      }}
      discoveries={topicDiscoveries}
      // ... pass all props
    />
  );
}
```

#### Step 1.3.5: Test and verify
1. Test topic drill-down flow
2. Verify back button works
3. Check all sections display correctly
4. Test pin/archive actions in topic view

5. Check line count:
   ```bash
   wc -l src/components/features/KnowledgeSidebar.tsx
   ```
   Target: ~300 lines

6. Commit:
   ```bash
   git add .
   git commit -m "refactor(KnowledgeSidebar): extract TopicDetailView component

   - Reduces main file from ~500 to ~300 lines
   - Separates topic drill-down logic from main component
   - Maintains all existing functionality"
   ```

**Dependencies:** Task 1.2

**Acceptance Criteria:**
- `KnowledgeSidebar.tsx` < 400 lines
- Topic drill-down works perfectly
- All sections display correctly
- Build succeeds

---

### Task 1.4: Extract Mock Data to Separate File

**Estimated Time:** 30 minutes  
**Priority:** P2

**Steps:**

1. Create new file:
   ```bash
   touch src/components/features/KnowledgeSidebar/mockData.ts
   ```

2. Move mock artifacts from `KnowledgeSidebar.tsx` (lines ~113-168) to `mockData.ts`

3. Export as named export:
   ```typescript
   export { generateMockArtifacts } from './mockData';
   ```

4. Import in main file:
   ```typescript
   import { generateMockArtifacts } from './KnowledgeSidebar/mockData';
   ```

5. Verify empty state still shows mock data

6. Commit:
   ```bash
   git add .
   git commit -m "refactor(KnowledgeSidebar): extract mock data to separate file"
   ```

**Dependencies:** None

**Acceptance Criteria:**
- Mock data in separate file
- Empty state still works
- Build succeeds

---

## 📋 Phase 2: New Features - Priority 1 (1-2 days)

**Goal:** Add high-impact UX improvements

### Task 2.1: Build SubjectOverviewCard

**Estimated Time:** 4-6 hours  
**Priority:** P1

**Steps:**

#### Step 2.1.1: Create component file
```bash
touch src/components/features/KnowledgeSidebar/SubjectOverviewCard.tsx
```

#### Step 2.1.2: Define props interface
```typescript
interface SubjectOverviewCardProps {
  subject: Subject;
  artifactCount: number;
  lastActiveAt: Date;
  onViewDetails?: () => void;
}
```

#### Step 2.1.3: Implement expertise stage logic
```typescript
function getExpertiseStage(artifactCount: number) {
  if (artifactCount <= 5) return { icon: '●', label: 'Exploring', color: 'blue' };
  if (artifactCount <= 15) return { icon: '◆', label: 'Building Knowledge', color: 'purple' };
  if (artifactCount <= 30) return { icon: '◆', label: 'Ready to Synthesize', color: 'violet' };
  return { icon: '★', label: 'Knowledge Mature', color: 'gold' };
}
```

#### Step 2.1.4: Implement stage-based guidance
```typescript
function getStageGuidance(artifactCount: number) {
  if (artifactCount <= 5) return '✨ Try: Ask questions to explore this topic';
  if (artifactCount <= 15) return '✨ Try: Organize your ideas into themes';
  if (artifactCount <= 30) return '✨ Try: Generate a Study Guide';
  return '✨ Try: Create a comprehensive Report';
}
```

#### Step 2.1.5: Build UI with animations
Implement visual design from `MISSING_FEATURES.md` lines 21-35

#### Step 2.1.6: Add to KnowledgeSidebar
In `KnowledgeSidebar.tsx` or `MainView.tsx`:
```typescript
<SubjectOverviewCard
  subject={selectedSubject}
  artifactCount={artifacts.length}
  lastActiveAt={new Date(selectedSubject.lastActiveAt)}
  onViewDetails={() => {/* TODO: Open modal */}}
/>
```

#### Step 2.1.7: Test
1. Verify card displays at top of sidebar
2. Check stage badge updates with artifact count
3. Test guidance message changes
4. Verify "View details" button (placeholder OK for now)

8. Commit:
   ```bash
   git add .
   git commit -m "feat(KnowledgeSidebar): add SubjectOverviewCard component

   - Shows expertise stage based on artifact count
   - Provides stage-based guidance
   - Displays last activity timestamp
   - 4 stages: Exploring → Building → Synthesizing → Mature"
   ```

**Dependencies:** None

**Acceptance Criteria:**
- Card displays at top of sidebar
- Expertise stage updates correctly
- Guidance message changes by stage
- Visual design matches spec
- Build succeeds

---

### Task 2.2: Build RecentInsightsCard

**Estimated Time:** 3-4 hours  
**Priority:** P1

**Steps:**

#### Step 2.2.1: Create component file
```bash
touch src/components/features/KnowledgeSidebar/RecentInsightsCard.tsx
```

#### Step 2.2.2: Define props interface
```typescript
interface RecentInsightsCardProps {
  insights: KeyDiscovery[];
  limit?: number;
  onInsightClick?: (insightId: string) => void;
  onViewAll?: () => void;
}
```

#### Step 2.2.3: Implement recent insights logic
```typescript
const recentInsights = insights
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, limit || 5);

const isNew = (createdAt: string) => {
  const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
  return new Date(createdAt).getTime() > twoHoursAgo;
};
```

#### Step 2.2.4: Build UI
Implement visual design from `MISSING_FEATURES.md` lines 86-105

#### Step 2.2.5: Add animations
- Glow animation for new insights
- Hover effects
- Truncation with tooltips

#### Step 2.2.6: Add to KnowledgeSidebar
```typescript
{keyDiscoveries && keyDiscoveries.length > 0 && (
  <RecentInsightsCard
    insights={keyDiscoveries}
    limit={5}
    onInsightClick={(id) => {/* TODO: Scroll to insight */}}
    onViewAll={() => {/* TODO: Show all insights */}}
  />
)}
```

#### Step 2.2.7: Test
1. Verify card shows below SubjectOverviewCard
2. Check 5 most recent insights display
3. Verify new badge for insights < 2 hours old
4. Test topic tags display
5. Check "View all" link

8. Commit:
   ```bash
   git add .
   git commit -m "feat(KnowledgeSidebar): add RecentInsightsCard component

   - Shows 5 most recent KeyDiscoveries
   - Displays topic tags for context
   - Glow animation for new insights (< 2 hours)
   - Quick access to insights without drilling into topics"
   ```

**Dependencies:** None (can be done in parallel with Task 2.1)

**Acceptance Criteria:**
- Card displays below SubjectOverviewCard
- Shows up to 5 recent insights
- New badge appears for recent insights
- Topic tags display correctly
- Build succeeds

---

### Task 2.3: Enhanced Streaming Animations

**Estimated Time:** 4-6 hours  
**Priority:** P1

**Steps:**

#### Step 2.3.1: Add streaming staging area UI
At top of sidebar (after search, before sections):
```typescript
{isGroupingThemes && newContent.length > 0 && (
  <div className="mb-4 space-y-2">
    {newContent.map(item => (
      <div key={item.id} className="staging-item">
        {item.type === 'insight' ? '💡' : '📝'} NEW: {item.preview}
        <div className="text-xs text-secondary">
          [Organizing...] ⏳
        </div>
      </div>
    ))}
  </div>
)}
```

#### Step 2.3.2: Implement flow animation
Add CSS:
```css
.staging-item {
  animation: stagingAppear 0.3s ease-out;
}

@keyframes stagingAppear {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.staging-to-topic {
  animation: flowToTopic 0.5s ease-out forwards;
}

@keyframes flowToTopic {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 0;
    transform: translateY(100px);
  }
}
```

#### Step 2.3.3: Add organization indicator
```typescript
{isGroupingThemes && (
  <div className="py-2 text-center text-sm text-nexus-text-secondary">
    <span className="inline-flex items-center gap-2">
      <span className="animate-pulse">⏳</span>
      Organizing knowledge...
    </span>
  </div>
)}
```

#### Step 2.3.4: Track new content temporarily
Add state:
```typescript
const [stagingContent, setStagingContent] = useState<Array<{
  id: string;
  type: 'insight' | 'artifact';
  preview: string;
}>>([]);
```

#### Step 2.3.5: Test
1. Add new artifacts during conversation
2. Verify they appear in staging area first
3. Check flow animation to topics
4. Verify organization indicator shows

6. Commit:
   ```bash
   git add .
   git commit -m "feat(KnowledgeSidebar): enhanced streaming animations

   - New staging area for incoming content
   - Flow animation from staging to topics
   - Organization indicator during AI processing
   - Improved visual feedback for real-time updates"
   ```

**Dependencies:** None

**Acceptance Criteria:**
- New content appears in staging area
- Content flows to appropriate topic
- Organization indicator displays during processing
- Animations are smooth (60fps)
- Build succeeds

---

## 📋 Phase 3: Testing & Documentation (0.5-1 day)

**Goal:** Ensure quality and maintainability

### Task 3.1: Add Unit Tests

**Estimated Time:** 4-6 hours  
**Priority:** P1

**Steps:**

#### Step 3.1.1: Create test files
```bash
mkdir -p tests/unit/components/KnowledgeSidebar
touch tests/unit/components/KnowledgeSidebar/utils.test.ts
touch tests/unit/components/KnowledgeSidebar/SubjectOverviewCard.test.tsx
touch tests/unit/components/KnowledgeSidebar/RecentInsightsCard.test.tsx
```

#### Step 3.1.2: Test utility functions
In `utils.test.ts`:
```typescript
describe('filterActiveThemes', () => {
  it('removes themes with < 2 artifacts for large collections', () => {
    // ...
  });
  
  it('allows single-artifact themes for small collections', () => {
    // ...
  });
  
  it('deduplicates case-insensitive theme names', () => {
    // ...
  });
});

describe('sortArtifacts', () => {
  it('sorts pinned first, then by date', () => {
    // ...
  });
});

// ... more tests
```

#### Step 3.1.3: Test SubjectOverviewCard
```typescript
describe('SubjectOverviewCard', () => {
  it('shows correct stage for artifact count 0-5', () => {
    // ...
  });
  
  it('updates guidance message by stage', () => {
    // ...
  });
  
  it('displays last activity timestamp', () => {
    // ...
  });
});
```

#### Step 3.1.4: Test RecentInsightsCard
```typescript
describe('RecentInsightsCard', () => {
  it('shows up to 5 most recent insights', () => {
    // ...
  });
  
  it('marks insights < 2 hours as new', () => {
    // ...
  });
  
  it('displays topic tags correctly', () => {
    // ...
  });
});
```

#### Step 3.1.5: Run tests
```bash
npm test
```

6. Commit:
   ```bash
   git add .
   git commit -m "test(KnowledgeSidebar): add comprehensive unit tests

   - Test utility functions (filtering, sorting, mapping)
   - Test SubjectOverviewCard expertise stages
   - Test RecentInsightsCard recent logic
   - 90%+ coverage for new components"
   ```

**Dependencies:** Phase 2 complete

**Acceptance Criteria:**
- All tests pass
- Coverage > 80% for new components
- Build succeeds

---

### Task 3.2: Update Documentation

**Estimated Time:** 1-2 hours  
**Priority:** P2

**Steps:**

1. Update `CURRENT_STATUS.md`:
   - Update file inventory with new components
   - Add recent commits
   - Update "What's Working Well" section

2. Update `MISSING_FEATURES.md`:
   - Mark completed features as ✅
   - Update status column in summary table

3. Update `SUBCOMPONENTS.md`:
   - Move SubjectOverviewCard, RecentInsightsCard from "Missing" to "Existing"
   - Add actual implementations details

4. Commit:
   ```bash
   git add .
   git commit -m "docs(KnowledgeSidebar): update documentation after Phase 2 completion"
   ```

**Dependencies:** Phase 2 complete

**Acceptance Criteria:**
- All docs reflect current state
- No outdated information
- Status accurate

---

## 📋 Phase 4: Future Enhancements (Optional, 2-3 days)

**Goal:** Advanced features for power users

### Task 4.1: Progressive Disclosure Pattern

**Estimated Time:** 6-8 hours  
**Priority:** P3

See `MISSING_FEATURES.md` lines 342-390 for full specification.

**High-level steps:**
1. Add toggle button "More options ▼" / "Show less ▲"
2. Implement collapsed/expanded states
3. Hide/show: Pinned, Archive, Advanced Filters
4. Save preference in localStorage
5. Smooth height transitions

---

### Task 4.2: Enhanced Search

**Estimated Time:** 8-10 hours  
**Priority:** P3

See `MISSING_FEATURES.md` lines 393-454 for full specification.

**High-level steps:**
1. Semantic search with embeddings
2. Type-ahead suggestions
3. Filter chips (Topics, Insights, Ideas)
4. Recent searches (localStorage)
5. Keyboard navigation

---

## 🔄 Git Workflow

### Branch Strategy
```bash
# Phase 1: Refactoring
git checkout -b refactor/knowledge-sidebar-cleanup

# Phase 2: New features
git checkout -b feature/knowledge-sidebar-p1-enhancements

# Phase 3: Testing
git checkout main
git merge feature/knowledge-sidebar-p1-enhancements
```

### Commit Message Convention
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code restructuring
- `test`: Add tests
- `docs`: Documentation
- `chore`: Maintenance

**Examples:**
```
feat(KnowledgeSidebar): add SubjectOverviewCard component

- Shows expertise stage based on artifact count
- Provides stage-based guidance
- Displays last activity timestamp

Closes #123
```

---

## 📊 Progress Tracking

Use this checklist to track implementation:

### Phase 1: Cleanup & Refactoring
- [ ] Task 1.1: Verify and remove deprecated components
- [ ] Task 1.2: Extract MainView component
- [ ] Task 1.3: Extract TopicDetailView component
- [ ] Task 1.4: Extract mock data

### Phase 2: Priority 1 Features
- [ ] Task 2.1: Build SubjectOverviewCard
- [ ] Task 2.2: Build RecentInsightsCard
- [ ] Task 2.3: Enhanced streaming animations

### Phase 3: Testing & Documentation
- [ ] Task 3.1: Add unit tests
- [ ] Task 3.2: Update documentation

### Phase 4: Future Enhancements (Optional)
- [ ] Task 4.1: Progressive disclosure
- [ ] Task 4.2: Enhanced search

---

## 🎯 Success Metrics

After Phase 1-3 completion:

### Code Quality
- ✅ `KnowledgeSidebar.tsx` < 400 lines
- ✅ No deprecated components remain
- ✅ 80%+ test coverage
- ✅ Build succeeds with no warnings

### User Experience
- ✅ SubjectOverviewCard provides guidance
- ✅ RecentInsightsCard enables quick access
- ✅ Streaming animations are smooth
- ✅ All existing features still work

### Performance
- ✅ Initial render < 100ms (20 topics)
- ✅ Search filter < 50ms
- ✅ Animations at 60fps

---

## 📚 Related Documentation

- **Overview:** `OVERVIEW.md` - Purpose and architecture
- **Current Status:** `CURRENT_STATUS.md` - What exists now
- **Missing Features:** `MISSING_FEATURES.md` - What to build
- **Subcomponents:** `SUBCOMPONENTS.md` - Component breakdown
- **Acceptance Criteria:** `ACCEPTANCE_CRITERIA.md` - Definition of done

---

**Last Updated:** 2025-10-07
**Next Step:** Extract ACCEPTANCE_CRITERIA.md
