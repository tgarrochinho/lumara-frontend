# Knowledge Sidebar - Missing Features

**Gap Analysis:** What's planned but not yet implemented
**Priority:** Ordered by impact and implementation effort
**Source:** Extracted from archive/PANEL_COMPONENT_SPECS.md and archive/REFACTOR_ROADMAP.md

---

## 🎯 Priority 1: High-Impact UX (1-2 days)

### 1. SubjectOverviewCard
**Status:** ❌ Not implemented
**Estimated Effort:** 4-6 hours
**Impact:** High - Motivational, guides user behavior

**Purpose:**
Shows the user's current expertise stage and suggests next actions based on their progress.

**Location:** Top of Knowledge Sidebar, before search bar

**Visual Design:**
```
┌──────────────────────────────────────┐
│ 🧠 Machine Learning                  │
│                                      │
│ ◆ Ready to Synthesize                │
│ You've built solid understanding     │
│                                      │
│ ✨ Try: Generate a Study Guide       │
│                                      │
│ 🕐 Active today                      │
│                                      │
│ [View details ↗]                     │
└──────────────────────────────────────┘
```

**Features:**
- Display subject emoji/name
- Show expertise stage badge:
  - ● Exploring (0-5 insights)
  - ◆ Building Knowledge (6-15 insights)
  - ◆ Ready to Synthesize (16-30 insights)
  - ★ Knowledge Mature (30+ insights)
- Show last activity timestamp
- Action-oriented hint based on stage
- "View details" link → Opens modal with full stats
- Stage transition animations (confetti, badge morph)

**Props Interface:**
```typescript
interface SubjectOverviewCardProps {
  subject: Subject;
  artifactCount: number;
  lastActiveAt: Date;
  onViewDetails?: () => void;
}
```

**Dependencies:**
- Subject data (from props)
- Artifact count for stage calculation
- Expertise stage logic (currently in `Dashboard/utils.ts`)

**Why Important:**
- Provides context and motivation
- Guides user on "what to do next"
- Celebrates progress with stage transitions
- Reduces cognitive load (no need to count artifacts manually)

**Reference:**
- `archive/PANEL_COMPONENT_SPECS.md` lines 189-257
- `archive/REFACTOR_ROADMAP.md` lines 574-582

---

### 2. RecentInsightsCard
**Status:** ❌ Not implemented
**Estimated Effort:** 3-4 hours
**Impact:** High - Faster knowledge review, better discoverability

**Purpose:**
Quick preview of latest AI-generated insights without drilling into topics.

**Location:** Between SubjectOverviewCard and Topics section

**Visual Design:**
```
┌─ RECENT INSIGHTS ───────────────────┐
│                                      │
│ 💡 Transfer learning reduces         │
│    training time by reusing...       │
│    ⏰ 2 hours ago • Neural Networks  │
│                                      │
│ 💡 Batch normalization stabilizes    │
│    training and allows higher...     │
│    ⏰ 5 hours ago • Training         │
│                                      │
│ ⚡ NEW                               │
│ 💡 Dropout rate of 0.2-0.5 works    │
│    best for most architectures       │
│    ⏰ Just now • Regularization      │
│                                      │
│ [View all 47 insights →]             │
└──────────────────────────────────────┘
```

**Features:**
- Show 3-5 most recent KeyDiscoveries
- Truncate text with hover tooltips for full content
- Display timestamp (relative: "2 hours ago")
- Show topic tag for context
- Glow animation for new insights (< 2 hours old)
- "View all" link → Opens full insights list or modal
- Click insight → Scrolls to that insight in topic detail view

**Props Interface:**
```typescript
interface RecentInsightsCardProps {
  insights: KeyDiscovery[];
  limit?: number; // Default: 5
  onInsightClick?: (insightId: string) => void;
  onViewAll?: () => void;
}
```

**Dependencies:**
- KeyDiscovery data (from KnowledgeBaseContext)
- formatTimeAgo utility (exists)
- Topic lookup for tags

**Why Important:**
- Faster access to key discoveries
- No need to drill into topics first
- Highlights what's new and relevant
- Encourages review of AI-generated insights

**Reference:**
- `archive/PANEL_COMPONENT_SPECS.md` lines 306-346
- Current KeyDiscoveryCard component can be reused

---

### 3. Enhanced Streaming Animations
**Status:** ⚠️ Partially implemented
**Estimated Effort:** 4-6 hours
**Impact:** Medium-High - Better visual feedback, more engaging

**Current State:**
- ✅ New artifacts slide in
- ✅ Removing artifacts fade out
- ✅ New badges pulse
- ❌ Content doesn't visually "flow" into topics
- ❌ No streaming state indicator
- ❌ No intermediate "staging area" for new content

**Planned Enhancements:**

#### 3.1 Streaming Staging Area
Show new content at top of sidebar before it's organized:
```
┌─ KNOWLEDGE ─────────────────────────┐
│ [🔍 Search...]                      │
│                                     │
│ 💡 NEW: Neural networks learn...    │ ← Appears here first
│    [Organizing...] ⏳               │
│                                     │
│ 📝 NEW: "Batch size affects..."     │ ← Appears here first
│    [Organizing...] ⏳               │
│                                     │
│ ⭐ Pinned (3)                        │
│ 🧠 Neural Networks (5)              │ ← Then flows here
│ 🎯 Training Techniques (3)          │
└─────────────────────────────────────┘
```

#### 3.2 Flow Animation
Content transitions from staging → topic:
1. New content appears at top (slide in from top)
2. Stays visible for 2-3 seconds
3. Fades out from staging area (opacity 1 → 0.5 → 0)
4. Simultaneously fades in under matching topic
5. Position transition (~500ms)
6. Badge count updates on topic (pulse animation)

#### 3.3 Organization Indicator
```
[Organizing knowledge...] ⏳
```
- Shows while AI processes
- Subtle pulse animation
- Dismisses when complete
- Position: Bottom of sidebar or below staging area

**Files to Modify:**
- `KnowledgeSidebar.tsx` (animation logic)
- Add new CSS keyframes
- Update `isGroupingThemes` loading state

**Why Important:**
- Makes AI processing visible and understandable
- Engaging user experience
- Reduces perception of wait time
- Clear visual feedback loop

**Reference:**
- `archive/REFACTOR_ROADMAP.md` lines 461-479

---

## 🎯 Priority 2: Code Quality (1 day)

### 4. Refactor Main Component (745 → 300 lines)
**Status:** ❌ Not done
**Estimated Effort:** 4-6 hours
**Impact:** High - Maintainability, token efficiency

**Current Problem:**
- `KnowledgeSidebar.tsx` is 745 lines
- Exceeds 400-line guideline
- High token usage in conversations
- Harder to understand and maintain

**Proposed Refactoring:**

#### 4.1 Extract MainView Component
**New file:** `KnowledgeSidebar/MainView.tsx` (~250 lines)

**Responsibilities:**
- Render default topics list view
- Pinned section
- Topics section
- Archive section
- Search filtering logic

**Props:**
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

#### 4.2 Extract TopicDetailView Component
**New file:** `KnowledgeSidebar/TopicDetailView.tsx` (~250 lines)

**Responsibilities:**
- Render topic drill-down view
- Focus/Pinned items in topic
- Key Discoveries in topic
- Ideas in topic
- Archive in topic
- Back button

**Props:**
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

#### 4.3 Main File (Orchestrator) (~300 lines)
**Keeps:**
- Props interface
- State management
- Data filtering/computation
- Animation tracking
- Conditional rendering (MainView vs TopicDetailView)

**After Refactoring:**
```typescript
// KnowledgeSidebar.tsx (~300 lines)
const KnowledgeSidebar = ({ selectedSubject, artifacts, ... }) => {
  // State (50 lines)
  // Data filtering (100 lines)
  // Animation tracking (50 lines)
  
  if (selectedTopic) {
    return <TopicDetailView topic={selectedTopic} ... />;
  }
  
  return <MainView filteredThemes={...} ... />;
};
```

**Benefits:**
- Each file < 400 lines
- Clearer separation of concerns
- Easier to test and maintain
- Better token efficiency

---

### 5. Remove Deprecated Components
**Status:** ❌ Not verified
**Estimated Effort:** 1-2 hours
**Impact:** Medium - Code cleanup, reduced maintenance

**Potentially Deprecated Files:**
- `PinnedIdeasSection.tsx` (97 lines)
- `TopicsSection.tsx` (233 lines)
- `ThemesSection.tsx` (232 lines)
- `SearchAndModeToggle.tsx` (67 lines)

**Action Required:**
1. Search codebase for imports of these components
2. If unused, delete files
3. Update index.ts exports
4. Run tests to ensure nothing breaks

**Why Important:**
- Dead code is confusing
- Maintenance burden
- Potential bugs if accidentally used

---

## 🎯 Priority 3: Advanced Features (2-3 days, future)

### 6. Progressive Disclosure Pattern
**Status:** ❌ Not implemented
**Estimated Effort:** 6-8 hours
**Impact:** Medium - Cleaner default view, power features on demand

**Concept:**
Show simplified view by default, expand to show advanced features.

**Default View (Collapsed):**
```
┌─ KNOWLEDGE ─────────────────────────┐
│ [Subject Overview]                  │
│ [Recent Insights]                   │
│ [Search]                            │
│ [Topics (3)]                        │
│                                     │
│ [More options ▼]                    │
└─────────────────────────────────────┘
```

**Expanded View:**
```
┌─ KNOWLEDGE ─────────────────────────┐
│ [Subject Overview]                  │
│ [Recent Insights]                   │
│ [Search]                            │
│ [Topics (3)]                        │
│ [Pinned Items (5)]                  │
│ [Archive (12)]                      │
│ [Advanced Filters]                  │
│                                     │
│ [Show less ▲]                       │
└─────────────────────────────────────┘
```

**Features:**
- Toggle button: "More options ▼" / "Show less ▲"
- Remember preference in localStorage
- Smooth height transition
- Default: Collapsed for new users

**Why Not Priority 1:**
- Current UI is already clean
- More important to add missing core features first
- Can be added later without breaking changes

**Reference:**
- `archive/PANEL_COMPONENT_SPECS.md` lines 114-185

---

### 7. Enhanced Search
**Status:** ❌ Not implemented
**Estimated Effort:** 8-10 hours
**Impact:** Medium - Better discovery, faster navigation

**Current Search:**
- ✅ Simple keyword filtering
- ✅ Real-time filtering
- ❌ No semantic search
- ❌ No filter chips
- ❌ No recent searches
- ❌ No suggestions

**Planned Enhancements:**

#### 7.1 Semantic Search
Leverage existing embedding service:
```typescript
// Instead of keyword match
const matches = artifacts.filter(a => 
  a.content.toLowerCase().includes(query.toLowerCase())
);

// Use semantic similarity
const queryEmbedding = await embeddingService.generateEmbedding(query);
const matches = artifacts
  .map(a => ({
    artifact: a,
    similarity: cosineSimilarity(queryEmbedding, a.embedding)
  }))
  .filter(({ similarity }) => similarity > 0.7)
  .sort((a, b) => b.similarity - a.similarity);
```

#### 7.2 Search Suggestions
Type-ahead from existing content:
- Show matching topic names
- Show matching artifact content (truncated)
- Show matching KeyDiscovery titles

#### 7.3 Filter Chips
```
[🔍 neural networks] [x]

Filter by:  [Topics] [Insights] [Ideas]
```

#### 7.4 Recent Searches
Store last 5 searches in localStorage:
```
Recent: "neural networks" "training" "optimization"
```

**Why Not Priority 1:**
- Current search works well
- Semantic search requires more infrastructure
- Nice-to-have, not blocking

**Reference:**
- `archive/PANEL_COMPONENT_SPECS.md` lines 349-366

---

## 📊 Summary

| Feature | Priority | Effort | Impact | Status |
|---------|----------|--------|--------|--------|
| SubjectOverviewCard | P1 | 4-6h | High | ❌ Not started |
| RecentInsightsCard | P1 | 3-4h | High | ❌ Not started |
| Enhanced Streaming | P1 | 4-6h | Med-High | ⚠️ Partial |
| Refactor Main Component | P2 | 4-6h | High | ❌ Not started |
| Remove Dead Code | P2 | 1-2h | Medium | ❌ Not verified |
| Progressive Disclosure | P3 | 6-8h | Medium | ❌ Future |
| Enhanced Search | P3 | 8-10h | Medium | ❌ Future |

**Total Estimated Effort (P1+P2):** 20-24 hours (~3 days)

**Recommended Approach:**
1. Build SubjectOverviewCard + RecentInsightsCard (1 day)
2. Refactor main component + remove dead code (1 day)
3. Enhanced streaming animations (0.5 day)
4. Test everything thoroughly (0.5 day)

**Then reassess P3 features based on user feedback.**

---

## 📚 Related Documentation

- **Overview:** `OVERVIEW.md` - Purpose and architecture
- **Current Status:** `CURRENT_STATUS.md` - What exists now
- **Subcomponents:** `SUBCOMPONENTS.md` - Detailed component specs
- **Implementation:** `IMPLEMENTATION_PLAN.md` - Step-by-step tasks
- **Acceptance:** `ACCEPTANCE_CRITERIA.md` - Definition of done

---

**Last Updated:** 2025-10-07
