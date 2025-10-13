# Knowledge Sidebar - Subcomponents

**Complete component inventory and specifications**
**Last Updated:** 2025-10-07

---

## 📦 Component Hierarchy

```
KnowledgeSidebar (Main Component)
├── Header Section
│   └── MagnifyingGlassIcon + Search Input
│
├── Main View (Default)
│   ├── Pinned Section
│   │   ├── SectionHeader
│   │   ├── ArtifactCard (×N pinned items)
│   │   └── ShowMoreButton (if > 3)
│   │
│   ├── Topics Section
│   │   ├── SectionHeader
│   │   └── TopicCard (×N topics)
│   │
│   └── Archive Section
│       ├── SectionHeader
│       ├── ArtifactCard (×N archived items)
│       └── ShowMoreButton (if > 5)
│
└── Topic Detail View (Drill-down)
    ├── Back Button (ChevronRightIcon)
    ├── Topic Header with Summary
    ├── Focus Section (SectionHeader + ArtifactCard)
    ├── Key Discoveries Section (SectionHeader + KeyDiscoveryCard)
    ├── Ideas Section (SectionHeader + ArtifactCard)
    └── Archive Section (SectionHeader + ArtifactCard)
```

---

## ✅ Existing Subcomponents

### 1. TopicCard

**Purpose:** Display a topic with summary, count, and preview of recent artifact

**Location:** `src/components/features/KnowledgeSidebar/TopicCard.tsx` (91 lines)

**Props Interface:**
```typescript
interface TopicCardProps {
  theme: string;               // Topic title/name
  summary?: string;            // AI-generated topic summary
  artifactIds: string[];       // IDs of artifacts in this topic
  artifacts: Artifact[];       // Full artifact objects for preview
  onClick: () => void;         // Navigate to topic detail view
  animationDelay?: number;     // Stagger animation for lists
}
```

**Visual Design:**
```
┌──────────────────────────────────────┐
│ > Neural Networks              [5]   │
│   Computing systems inspired by...   │
│   "CNNs are effective for images..."  │
│   📅 2 days ago - 3 hours ago        │
└──────────────────────────────────────┘
```

**Features:**
- Shows topic theme name with chevron icon
- Displays artifact count badge
- AI-generated summary (2 lines max)
- Preview of most recent artifact content
- Time range from oldest to newest artifact
- Hover effects (background, border, icon transform)
- Slide-in animation with configurable delay

**Interactions:**
- Click → Opens topic detail view
- Hover → Highlights with accent color, chevron animates right

**Dependencies:**
- Icons: `ChevronRightIcon`
- Utils: `formatTimeAgo` from `@/utils/dateUtils`
- Types: `Artifact` from `@/types`

**CSS Classes:**
- Background: `bg-nexus-surface/30`
- Hover: `hover:bg-nexus-surface/50`
- Border: `border-nexus-border/20` → `hover:border-nexus-accent/30`
- Theme text: `text-nexus-accent`
- Badge: `bg-nexus-violet/20 text-nexus-violet`

---

### 2. ArtifactCard

**Purpose:** Display individual artifact (idea) with actions and metadata

**Location:** `src/components/features/KnowledgeSidebar/ArtifactCard.tsx` (114 lines)

**Props Interface:**
```typescript
interface ArtifactCardProps {
  artifact: Artifact;                    // Full artifact object
  onPin?: (artifactId: string, isCurrentlyPinned: boolean) => void;
  onArchive?: (artifactId: string) => void;
  highlightedContent?: React.ReactNode;  // For search highlighting
  className?: string;                    // Additional styling
  showActions?: boolean;                 // Show pin/archive buttons
  isNew?: boolean;                       // Shows "New" badge
  isRemoving?: boolean;                  // Fade-out animation
  topicContext?: string | null;          // Shows parent topic
}
```

**Visual Design:**
```
┌────────────────────────────────────┐
│ [New] 💠                  ⭐ 🗑️    │
│ in: Neural Networks                │
│ Focus on batch normalization...    │
│                         2 hours ago │
└────────────────────────────────────┘
```

**Features:**
- "New" badge with pulse animation (auto-expires after 2 minutes)
- Topic context badge (shows parent topic)
- Content preview (3 lines max)
- Timestamp (relative: "2 hours ago")
- Hover actions: Pin/unpin, Archive/restore
- Pinned items have yellow star
- Archived items have gray styling
- Custom content rendering (for search highlighting)

**Interactions:**
- Hover → Shows action buttons (pin, archive)
- Click pin → Toggles artifact.isPinned
- Click archive → Toggles artifact.status ('active' ↔ 'superseded')
- Card click → (Handled by parent, typically opens detail view)

**Animations:**
- New artifact: `artifact-new` class (slide in from right)
- Removing: `artifact-removing` class (fade out)
- New badge: `animate-badgePulse`

**Dependencies:**
- Icons: `StarIcon`, `TrashIcon`
- Utils: `formatTimeAgo` from `@/utils/dateUtils`
- Types: `Artifact` from `@/types`

**CSS Classes:**
- Background: `bg-nexus-surface/30`
- Hover: `hover:bg-nexus-surface/50`
- New badge: `bg-indigo-500/20 text-indigo-600`
- Topic badge: `bg-nexus-violet/10 text-nexus-violet`
- Pin (active): `text-yellow-500`
- Archive (active): `text-nexus-text-secondary`

---

### 3. SectionHeader

**Purpose:** Standardized collapsible section header with count and icon

**Location:** `src/components/features/KnowledgeSidebar/SectionHeader.tsx` (66 lines)

**Props Interface:**
```typescript
interface SectionHeaderProps {
  title: string;                         // Section title
  count?: number;                        // Item count
  icon?: React.ReactNode;                // Optional icon
  isCollapsed?: boolean;                 // Collapsed state
  onToggleCollapse?: () => void;         // Toggle handler
  showCollapseButton?: boolean;          // Show chevron button
  badgeColor?: 'yellow' | 'violet' | 'default';
  showBadge?: boolean;                   // Badge vs parentheses
}
```

**Visual Variations:**

**With Badge:**
```
⭐ Pinned [5]                           ▼
```

**With Parentheses:**
```
💡 Key Discoveries (3)                  ▼
```

**Features:**
- Optional icon (emoji or component)
- Count display (badge or parentheses)
- Collapsible chevron button
- Three badge color variants (yellow, violet, default)
- Smooth rotation animation on collapse

**Interactions:**
- Click chevron → Toggles section collapse
- Chevron rotates -90° when collapsed

**Badge Colors:**
- Yellow: `bg-yellow-400/20 text-yellow-400` (for pinned items)
- Violet: `bg-nexus-violet/20 text-nexus-violet` (for topics)
- Default: `bg-nexus-surface-alt text-nexus-text-secondary`

**Dependencies:**
- Icons: `ChevronDownIcon`

**CSS Classes:**
- Title: `text-sm font-semibold text-nexus-text-primary`
- Button: `hover:bg-nexus-surface/30 rounded`
- Chevron collapsed: `-rotate-90`

---

### 4. ShowMoreButton

**Purpose:** Expand collapsed lists to show more items

**Location:** `src/components/features/KnowledgeSidebar/ShowMoreButton.tsx` (25 lines)

**Props Interface:**
```typescript
interface ShowMoreButtonProps {
  onClick: () => void;    // Expand handler
  count: number;          // Number of hidden items
  itemType: string;       // "items", "ideas", etc.
}
```

**Visual Design:**
```
┌──────────────────────────────────────┐
│     Show 5 more items                │
└──────────────────────────────────────┘
```

**Features:**
- Dynamic count and item type
- Full-width button
- Border that highlights on hover

**Interactions:**
- Click → Expands section to show all items

**Dependencies:**
- None

**CSS Classes:**
- Text: `text-nexus-accent hover:text-nexus-accent-light`
- Border: `border-nexus-border hover:border-nexus-accent`

---

### 5. utils.ts (Utility Functions)

**Purpose:** Helper functions for data filtering, sorting, and state management

**Location:** `src/components/features/KnowledgeSidebar/utils.ts` (192 lines)

**Exports:**

#### Constants
```typescript
export const LOAD_MORE_COUNT = 10;
```

#### Functions

**`filterActiveThemes(themedArtifactGroups, activeArtifacts)`**
- Filters out low-quality themes
- Removes "Archived" theme
- Requires min 2 artifacts (or 1 for small collections)
- Removes overly specific themes
- Deduplicates similar themes (case-insensitive)

**`generateMockArtifacts(selectedSubject)`**
- Creates 6 demo artifacts for empty state
- Mix of pinned/unpinned, various timestamps
- Helpful for testing and onboarding

**`filterArtifactsBySearch(artifacts, searchQuery)`**
- Simple case-insensitive keyword search
- Searches artifact.content field

**`sortArtifacts(artifacts, viewMode)`**
- Pinned items first (knowledge view only)
- Then by date (newest first)

**`separateArtifacts(artifacts)`**
- Returns `{ activeArtifacts, archivedIdeas }`
- Based on artifact.status

**`mapThemeArtifacts(activeThemes, artifacts)`**
- Maps artifactIds to full Artifact objects
- Returns themes with embedded artifacts array

**`highlightMatch(text, searchQuery)`**
- Wraps matches in `<mark>` tags
- Regex-safe escaping

**`createSectionToggler(setSectionCollapsed)`**
- Factory for section toggle handlers
- Returns function that toggles boolean in state object

**Dependencies:**
- Types: `Artifact`, `ArtifactThemeGroup`, `Subject` from `@/types`

---

## ⚠️ Potentially Deprecated Components

These components may no longer be used (needs verification):

### 6. PinnedIdeasSection

**Location:** `src/components/features/KnowledgeSidebar/PinnedIdeasSection.tsx` (97 lines)

**Why Deprecated:**
- Pinned section logic now inline in main KnowledgeSidebar.tsx
- Uses ArtifactCard component directly

**Action Required:**
- Search codebase for imports
- If unused, delete file

---

### 7. TopicsSection

**Location:** `src/components/features/KnowledgeSidebar/TopicsSection.tsx` (233 lines)

**Why Deprecated:**
- Topics section logic now inline in main KnowledgeSidebar.tsx
- Uses TopicCard component directly

**Action Required:**
- Search codebase for imports
- If unused, delete file

---

### 8. ThemesSection

**Location:** `src/components/features/KnowledgeSidebar/ThemesSection.tsx` (232 lines)

**Why Deprecated:**
- Themes section logic now inline in main KnowledgeSidebar.tsx
- Likely replaced by topics-first refactor

**Action Required:**
- Search codebase for imports
- If unused, delete file

---

### 9. SearchAndModeToggle

**Location:** `src/components/features/KnowledgeSidebar/SearchAndModeToggle.tsx` (67 lines)

**Why Deprecated:**
- Search input now inline in main KnowledgeSidebar.tsx
- Mode toggle functionality may have been removed

**Action Required:**
- Search codebase for imports
- If unused, delete file

---

## 🚧 Missing Subcomponents (Planned)

### 10. SubjectOverviewCard

**Status:** ❌ Not implemented  
**Priority:** P1 (High Impact)  
**Estimated Effort:** 4-6 hours

**Purpose:** Show expertise stage and suggest next actions

**Location:** Top of sidebar, before search bar

**Props Interface:**
```typescript
interface SubjectOverviewCardProps {
  subject: Subject;
  artifactCount: number;
  lastActiveAt: Date;
  onViewDetails?: () => void;
}
```

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
- Expertise stage badge (based on artifact count)
- Stage-based guidance ("Try: Generate...")
- Last activity timestamp
- View details link (opens modal)
- Stage transition animations (confetti, badge morph)

**Stage Logic:**
- ● Exploring (0-5 insights)
- ◆ Building Knowledge (6-15 insights)
- ◆ Ready to Synthesize (16-30 insights)
- ★ Knowledge Mature (30+ insights)

**Reference:**
- `archive/PANEL_COMPONENT_SPECS.md` lines 189-257

---

### 11. RecentInsightsCard

**Status:** ❌ Not implemented  
**Priority:** P1 (High Impact)  
**Estimated Effort:** 3-4 hours

**Purpose:** Quick preview of latest AI-generated insights

**Location:** Between SubjectOverviewCard and Topics section

**Props Interface:**
```typescript
interface RecentInsightsCardProps {
  insights: KeyDiscovery[];
  limit?: number;              // Default: 5
  onInsightClick?: (insightId: string) => void;
  onViewAll?: () => void;
}
```

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
- Truncate text with hover tooltips
- Relative timestamps
- Topic tags for context
- Glow animation for new insights (< 2 hours)
- "View all" link
- Click insight → Scrolls to insight in topic detail

**Dependencies:**
- `KeyDiscoveryCard` component (already exists)
- `formatTimeAgo` utility

**Reference:**
- `archive/PANEL_COMPONENT_SPECS.md` lines 306-346

---

### 12. MainView Component

**Status:** ❌ Not extracted (refactoring needed)  
**Priority:** P2 (Maintainability)  
**Estimated Effort:** 4-6 hours

**Purpose:** Extract default topics list view from main file

**New Location:** `src/components/features/KnowledgeSidebar/MainView.tsx` (~250 lines)

**Props Interface:**
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

**Responsibilities:**
- Render pinned section
- Render topics section
- Render archive section
- Handle search filtering display
- Animation state management

---

### 13. TopicDetailView Component

**Status:** ❌ Not extracted (refactoring needed)  
**Priority:** P2 (Maintainability)  
**Estimated Effort:** 4-6 hours

**Purpose:** Extract topic drill-down view from main file

**New Location:** `src/components/features/KnowledgeSidebar/TopicDetailView.tsx` (~250 lines)

**Props Interface:**
```typescript
interface TopicDetailViewProps {
  topic: ArtifactThemeGroup;
  artifacts: {
    focus: Artifact[];        // Pinned in topic
    ideas: Artifact[];        // All in topic
    archived: Artifact[];     // Archived in topic
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

**Responsibilities:**
- Render back button
- Render topic header with summary
- Render focus/pinned items in topic
- Render key discoveries in topic
- Render all ideas in topic
- Render archive in topic
- Handle section collapse

---

## 📊 Component Size Summary

| Component | Lines | Status | Target |
|-----------|-------|--------|--------|
| KnowledgeSidebar.tsx | 745 | ⚠️ Too large | < 400 |
| TopicCard.tsx | 91 | ✅ Good | < 300 |
| ArtifactCard.tsx | 114 | ✅ Good | < 300 |
| SectionHeader.tsx | 66 | ✅ Perfect | < 300 |
| ShowMoreButton.tsx | 25 | ✅ Perfect | < 300 |
| utils.ts | 192 | ✅ Good | < 300 |
| PinnedIdeasSection.tsx | 97 | ⚠️ Verify | < 300 |
| TopicsSection.tsx | 233 | ⚠️ Verify | < 300 |
| ThemesSection.tsx | 232 | ⚠️ Verify | < 300 |
| SearchAndModeToggle.tsx | 67 | ⚠️ Verify | < 300 |

**Total:** 1,129 lines across 10 files (excluding main)

---

## 🧪 External Dependencies

### From `@/components/icons`
- `SparklesIcon` - AI processing indicator
- `MagnifyingGlassIcon` - Search input
- `ChevronRightIcon` - Topic cards, back button
- `ChevronDownIcon` - Section headers (collapse)
- `StarIcon` - Pin/unpin action
- `TrashIcon` - Archive/restore action

### From `@/components/knowledge`
- `KeyDiscoveryCard` - Displays insights in topic detail view

### From `@/components/ui`
- `LoadingPlaceholder` - Loading spinner

### From `@/utils`
- `formatTimeAgo` - Relative timestamps
- `dateUtils` - Date formatting utilities

### From `@/types`
- `Subject` - Current subject context
- `Artifact` - Raw conversational content (ideas)
- `ArtifactThemeGroup` - AI-generated topics
- `KeyDiscovery` - AI-generated insights

---

## 🎨 Animation Classes

Defined in main `KnowledgeSidebar.tsx`:

```css
.artifact-new {
  animation: slideInFromRight 0.4s ease-out;
}

.artifact-removing {
  animation: fadeOut 0.3s ease-out forwards;
  pointer-events: none;
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

.animate-badgePulse {
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

---

## 📚 Related Documentation

- **Overview:** `OVERVIEW.md` - Purpose and architecture
- **Current Status:** `CURRENT_STATUS.md` - What exists now
- **Missing Features:** `MISSING_FEATURES.md` - What to build
- **Implementation:** `IMPLEMENTATION_PLAN.md` - Step-by-step tasks
- **Acceptance:** `ACCEPTANCE_CRITERIA.md` - Definition of done

---

**Last Updated:** 2025-10-07
**Next Step:** Extract IMPLEMENTATION_PLAN.md
