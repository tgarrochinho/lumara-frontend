# Knowledge Sidebar - Component Overview

**Location:** `src/components/features/KnowledgeSidebar.tsx`
**Lines:** 745 (target: < 400 after refactor)
**Status:** ✅ Functional, needs enhancements and refactoring

---

## 🎯 Purpose

The Knowledge Sidebar is the **left panel** of the application that provides users with:
- A bird's-eye view of their organized knowledge
- Quick access to Topics (AI-generated themes)
- Pinned items for focused work
- Search and filtering capabilities
- Archive of superseded content

It's the **primary navigation** for exploring accumulated insights and ideas.

---

## 📱 User-Facing Terminology

**What users see in the UI:**

| UI Term | Description | User's Mental Model |
|---------|-------------|---------------------|
| **Knowledge** | Panel header | "My collected learnings" |
| **Topics** | AI-organized themes | "Categories of what I'm learning" |
| **Ideas** | Raw conversational content | "Things I said or noted" |
| **Insights** | AI-generated discoveries | "Key takeaways and patterns" |
| **Focus** / **Pinned** | Important items | "Things I want to remember" |
| **Archive** | Superseded content | "Old or replaced information" |

---

## 💻 Code Terminology

**What developers see in the code:**

| Code Term | Type | Maps to UI |
|-----------|------|------------|
| `Artifact` | Type | "Ideas" |
| `ArtifactThemeGroup` | Type | "Topics" |
| `KeyDiscovery` | Type | "Insights" (merged from Concepts + DeepInsights) |
| `isPinned` | Boolean flag | "Focus" / "Pinned" |
| `status: 'superseded'` | Enum value | "Archive" |

**Key Principle:** Use simple, user-friendly terms in UI. Keep technical names in code (can refactor later if needed).

---

## 🏗️ Architecture

### Current Structure (Topics-First Design)

```
KnowledgeSidebar (Main Component)
├── Header
│   ├── Title: "Knowledge"
│   ├── Subject Name
│   └── Search Bar
│
├── Main View (Default)
│   ├── Pinned Section (⭐)
│   │   ├── Shows pinned artifacts
│   │   ├── Displays parent topic context
│   │   └── Expandable if > 3 items
│   │
│   ├── Topics Section
│   │   ├── TopicCard (for each topic)
│   │   │   ├── Theme title
│   │   │   ├── AI-generated summary
│   │   │   ├── Artifact count
│   │   │   └── Preview of recent artifact
│   │   └── Click → Opens Topic Detail View
│   │
│   └── Archive Section (Collapsed by default)
│       └── All superseded artifacts
│
└── Topic Detail View (Drill-down)
    ├── Back button
    ├── Topic header with summary
    ├── Focus Items (pinned in this topic)
    ├── Key Discoveries (insights)
    ├── Ideas (all artifacts in topic)
    └── Archive (superseded in this topic)
```

### State Management

```typescript
// Section collapse state
const [sectionCollapsed, setSectionCollapsed] = useState({
  focus: false,
  discoveries: false,
  ideas: false,
  archived: true,
});

// Topic drill-down
const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

// Search
const [searchQuery, setSearchQuery] = useState<string>('');

// Animation tracking
const [newArtifactIds, setNewArtifactIds] = useState<Set<string>>(new Set());
const [removingArtifactIds, setRemovingArtifactIds] = useState<Set<string>>(new Set());
```

---

## 🎨 Visual Design

### Default View Layout
```
┌─ KNOWLEDGE ─────────────────────┐
│ Subject Name                    │
│ [🔍 Search knowledge...]         │
│                                 │
│ ┌─ ⭐ PINNED ───────────────┐   │
│ │ 📝 Important idea 1        │   │
│ │    in: Neural Networks     │   │
│ │ 📝 Important idea 2        │   │
│ │    in: Training            │   │
│ │ [+2 more]                  │   │
│ └───────────────────────────┘   │
│                                 │
│ ┌─ TOPICS ──────────────────┐   │
│ │ 🧠 Neural Networks      5  │   │
│ │    Computing systems...    │   │
│ │    "CNNs are effective..." │   │
│ │                           │   │
│ │ 🎯 Training Techniques 3   │   │
│ │    Methods to optimize...  │   │
│ │    "Batch size affects..." │   │
│ └───────────────────────────┘   │
│                                 │
│ ┌─ ARCHIVE ─────────────────┐   │
│ │ [Collapsed]                │   │
│ └───────────────────────────┘   │
└─────────────────────────────────┘
```

### Topic Detail View Layout
```
┌─ 🧠 NEURAL NETWORKS ──────────┐
│ [← Back to Knowledge]         │
│ Computing systems inspired... │
│                               │
│ ┌─ ⭐ PINNED (2) ───────────┐ │
│ │ 📝 CNN architectures...   │ │
│ │ 📝 Transfer learning...   │ │
│ └──────────────────────────┘ │
│                               │
│ ┌─ KEY DISCOVERIES (3) ─────┐ │
│ │ 💡 Neural nets learn via  │ │
│ │    backpropagation        │ │
│ └──────────────────────────┘ │
│                               │
│ ┌─ IDEAS (8) ───────────────┐ │
│ │ 📝 Batch size affects...  │ │
│ │ 📝 Gradient descent...    │ │
│ └──────────────────────────┘ │
│                               │
│ ┌─ ARCHIVE (2) ─────────────┐ │
│ │ [Collapsed]               │ │
│ └──────────────────────────┘ │
└───────────────────────────────┘
```

---

## 🎯 Key Features

### ✅ Already Implemented
- Topics-first organization
- Pinned section with topic context
- Topic detail drill-down view
- Search filtering across all content
- Archive section with restore functionality
- Loading states ("Organizing your insights...")
- Empty states ("Start Building Knowledge")
- Smooth animations (slide-in, fade-in, pulse)
- New badge for recently added artifacts
- Collapsible sections

### ❌ Missing from Planning Docs
- SubjectOverviewCard (expertise stage indicator)
- RecentInsightsCard (quick preview section)
- Enhanced streaming animations (content flowing into topics)
- Progressive disclosure pattern (collapsed/expanded modes)
- Enhanced search (semantic, filters, suggestions)

---

## 🔗 Dependencies

### Internal Components
- `TopicCard` - Displays topic with summary and preview
- `ArtifactCard` - Displays individual ideas with actions
- `SectionHeader` - Standardized section headers
- `KeyDiscoveryCard` - Displays insights (from `@/components/knowledge/`)
- `LoadingPlaceholder` - Loading spinner

### Data Sources
- `artifacts: Artifact[]` - All ideas (from KnowledgeBaseContext)
- `themedArtifactGroups: ArtifactThemeGroup[]` - Topics (AI-generated)
- `keyDiscoveries: KeyDiscovery[]` - Insights (merged Concepts + DeepInsights)
- `selectedSubject: Subject` - Current subject context

### Actions
- `onArtifactPin` - Pin/unpin artifact
- `onArtifactArchive` - Archive/restore artifact

---

## 📊 Performance Considerations

### Current Metrics
- **File size:** 745 lines (target: < 400)
- **Render complexity:** Moderate (filtering, animations)
- **Re-render triggers:** artifacts change, theme updates, search input

### Optimization Opportunities
1. **Memoization:** Memoize filtered lists and computed values
2. **Virtualization:** Consider for large lists (> 100 topics or artifacts)
3. **Component splitting:** Extract MainView and TopicDetailView
4. **Search debouncing:** Already implemented for search input

---

## 🧪 Testing Strategy

### Unit Tests
- Filter logic (by search query)
- Topic/artifact grouping
- Pin/archive state management
- Animation state tracking

### Integration Tests
- Click topic → Opens detail view
- Pin artifact → Appears in pinned section
- Archive artifact → Moves to archive
- Search → Filters all content

### Visual Tests
- Empty state renders correctly
- Loading state shows spinner
- Animations smooth and performant
- New badges appear and expire

---

## 📖 Related Documentation

- **Current Status:** `CURRENT_STATUS.md` - What exists, file inventory, recent changes
- **Missing Features:** `MISSING_FEATURES.md` - Gap analysis, what's planned
- **Subcomponents:** `SUBCOMPONENTS.md` - Detailed component breakdown
- **Implementation:** `IMPLEMENTATION_PLAN.md` - Step-by-step tasks
- **Acceptance Criteria:** `ACCEPTANCE_CRITERIA.md` - Definition of done

- **Archive (Reference):**
  - `archive/PANEL_COMPONENT_SPECS.md` (lines 75-600)
  - `archive/REFACTOR_ROADMAP.md` (lines 318-514)
  - `archive/PANEL_COMPONENTS_MVP.md` (lines 297-438)

---

**Last Updated:** 2025-10-07
**Next Focus:** Extract CURRENT_STATUS.md with detailed file inventory
