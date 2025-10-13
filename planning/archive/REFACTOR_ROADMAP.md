# Refactor Roadmap - Existing App → MVP

**Timeline:** 6-8 weeks  
**Approach:** Refactor existing components, remove complexity, align with MVP spec  
**Strategy:** Simplify → Polish → Ship

---

## 🎯 Decisions Made

1. ✅ **Refactor existing app** (not build from scratch)
2. ✅ **Local-only** (no backend, IndexedDB only)
3. ✅ **Remove deprecated features** and rename as needed
4. ✅ **Update URL structure** (see below)
5. ✅ **Map existing layout to MVP** (see below)

---

## 📝 Terminology Clarification

**User-Facing Terms (UI):**
- **Ideas** - Raw content captured from conversations (code: `Artifact`)
- **Insights** - AI-generated key discoveries (code: `KeyDiscovery`, merged from Concepts + DeepInsights)
- **Topics** - Organized themes (code: `ArtifactThemeGroup`)
- **Guides** - Generated outputs (code: `Playbook`)
- **Focus** - Important items user wants to track (code: `pinned` flag)

**Code Terms (Database/Types):**
- `Artifact` → "Ideas" in UI
- `KeyDiscovery` → "Insights" in UI (merged from Concepts + DeepInsights)
- `ArtifactThemeGroup` → "Topics" in UI
- `Playbook` → "Guides" in UI

**Key Principle:** Use simple, clear user-facing terms in UI. Keep technical names in code for now (can refactor later).

---

## 📊 Current State → MVP Mapping

### **Current 3-Panel Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│  TopBarHeader (navigation)                                  │
├──────────────┬──────────────────────┬──────────────────────┤
│              │                      │                      │
│ Knowledge    │  SubjectChatView     │  RightSidebar       │
│ Sidebar      │  (chat messages)     │  (playbook/insights)│
│              │  OR                  │                      │
│ - Artifacts  │  Dashboard           │  - Playbook         │
│ - Concepts   │  (subject list)      │  - Insights view    │
│ - Insights   │                      │  - Graph view       │
│ - Themes     │                      │                      │
│              │                      │                      │
└──────────────┴──────────────────────┴──────────────────────┘
```

### **MVP Spec Wants:**

```
┌─────────────────────────────────────────────────────────────┐
│  TopBarHeader (keep as-is)                                  │
├──────────────┬──────────────────────┬──────────────────────┤
│              │                      │                      │
│ Explore      │  Chat Panel          │  Create Panel       │
│ Panel        │                      │                      │
│              │  - Conversation List │  - Output Generator │
│ - Subject    │  - Message View      │  - Templates        │
│   Overview   │                      │  - Recent Outputs   │
│ - Topics     │                      │                      │
│ - Insights   │                      │                      │
│              │                      │                      │
└──────────────┴──────────────────────┴──────────────────────┘
```

### **Mapping (What Changes):**

| Current Component | MVP Component | Action Required |
|-------------------|---------------|-----------------|
| **KnowledgeSidebar** | **Explore Panel** | ✂️ Simplify: Keep insights, remove Concepts/Themes |
| **SubjectChatView** | **Chat Panel** | ➕ Add: Conversation list mode |
| **Dashboard** | **Dashboard** | ✅ Keep: Already good for subject list |
| **RightSidebar** | **Create Panel** | 🔄 Replace: Playbooks → Simple outputs |
| **TopBarHeader** | **TopBarHeader** | ✅ Keep: Minor updates only |

---

## 🗑️ Features to REMOVE

These add complexity without MVP value:

### **High Priority Removals (Week 1):**
```
❌ Playbooks (entire system)
   - PlaybookReviewModal
   - GuidedSynthesisModal
   - PlaybookService
   - Playbook types
   
❌ Contradictions (entire system)
   - Contradiction resolution flow
   - ContradictionResolutionDecision component
   - Contradiction types and service
   
❌ Duplication Detection
   - DuplicationResolutionDecision component
   - Duplication alert messages
   
❌ Concept Extraction
   - ConceptCard
   - ConceptsSection
   - generateConceptsAndInsights flow
   
❌ DeepInsights (AI-generated)
   - DeepInsightCard
   - DeepInsight generation service
   - DeepInsight types
   
❌ Theme Grouping
   - ArtifactThemeGroup
   - Theme grouping AI logic
   - ThemesSection component
   
❌ Progress Indicators (complex ones)
   - ProgressiveLoadingIndicator
   - Multi-stage AI processing indicators
```

### **Keep These (Core Features):**
```
✅ Insights (formerly Artifacts)
   - Rename in code and UI
   - Core knowledge building blocks
   
✅ Conversations (formerly ChatSessions)
   - Multiple per subject (Model A)
   - Rename throughout codebase
   
✅ Topics (formerly Themes/ArtifactThemeGroup)
   - Simple categorization
   - Manual or basic AI tagging
   
✅ Contradictions ⭐ CORE FEATURE
   - Detects when Notes & Ideas conflict
   - Keep detection logic
   - Simplify resolution UI
   - User decides how to resolve
   
✅ Duplication Detection ⭐ CORE FEATURE
   - Detects when new Note & Idea is similar to existing
   - Prevents duplicate entries
   - Same logic pattern as Contradictions
   - Keep this logic intact!
   
✅ Playbooks → Outputs/Guides
   - Keep generation capability
   - Simplify UI and flow
   - Focus on 2 templates (Summary, Guide)
   
✅ Messages & Subjects
   - Keep as-is
```

---

## 🔄 Terminology Changes

Update throughout codebase:

| Old Name (Code) | New Name (Code) | UI Display |
|-----------------|-----------------|------------|
| `ChatSession` | `Conversation` | "Conversation" |
| `Artifact` | `Insight` | "Insight" |
| `DeepInsight` | ❌ Remove | — |
| `Concept` | ❌ Remove | — |
| `Playbook` | `Output` | "Report" or "Summary" |
| `ArtifactThemeGroup` | `Topic` | "Topic" |
| `themedArtifactGroups` | `topics` | "Topics" |

**Search & Replace Strategy:**
- Week 1: Create new types alongside old ones
- Week 2-3: Migrate components to new types
- Week 4: Remove old types
- Week 5+: Final cleanup

---

## 🛣️ Updated URL Structure

### **Current Routes (from AppRouter.tsx):**
```typescript
/                              → LandingPage
/app                           → AppCore (Dashboard)
/subject/:subjectSlug          → AppCore (Subject view)
/subject/:subjectSlug/:sessionSlug → AppCore (Session view)
```

### **New Routes (MVP):**
```typescript
/                              → LandingPage (keep)
/app                           → Dashboard (subject list)
/subject/:subjectId            → Subject view with 3 panels
  ↳ Default: Conversation list in center
  ↳ Explore panel always visible (left)
  ↳ Create panel always visible (right)
  
/subject/:subjectId/chat/:conversationId → Active conversation view
  ↳ Same 3-panel layout
  ↳ Center shows messages
  ↳ Explore/Create panels stay visible

// Remove these:
❌ /subject/:subjectSlug/:sessionSlug (redundant)
```

**Routing Implementation:**
```typescript
// src/components/ui/AppRouter.tsx - UPDATED
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/app" element={<AppCore mode="dashboard" />} />
  <Route path="/subject/:subjectId" element={<AppCore mode="subject" />} />
  <Route path="/subject/:subjectId/chat/:conversationId" element={<AppCore mode="chat" />} />
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
```

**Panel Visibility by Route:**
```typescript
// Route: /subject/:subjectId
✅ Left Panel (Explore): Visible
✅ Center Panel: ConversationList
✅ Right Panel (Create): Visible

// Route: /subject/:subjectId/chat/:conversationId
✅ Left Panel (Explore): Visible (shows insights)
✅ Center Panel: MessageView (active conversation)
✅ Right Panel (Create): Visible (generate outputs)
```

---

## 📅 6-Week Implementation Plan

### **Week 0: Preparation (This Week) ✅**
- [x] Make architecture decisions
- [x] Document refactor plan
- [ ] Create foundation components
- [ ] Set up new types alongside old

**Deliverables:**
```typescript
// New types (don't replace old ones yet)
types/conversation.types.ts
types/insight.types.ts
types/output.types.ts

// Foundation components
components/ErrorBoundary.tsx
components/ui/LoadingState.tsx
components/ui/EmptyState.tsx
utils/panelEvents.ts
components/registry.ts
```

---

### **Week 1: Remove Complexity**

**Goal:** Strip out features not in MVP

**Tasks:**
```
☐ Remove Concepts (AI-generated)
  - Delete ConceptCard.tsx
  - Delete ConceptsSection from KnowledgeSidebar
  - Remove ConceptExtractionService.ts
  - Remove concept generation from KnowledgeBaseContext
  - Clean up concept types
  - Update UI to show only Insights

☐ Remove DeepInsights (AI-generated)
  - Delete DeepInsightCard.tsx
  - Remove DeepInsightGenerationService.ts
  - Remove deep insight generation from KnowledgeBaseContext
  - Clean up deep insight types
  - Regular Insights are sufficient

☐ Simplify Playbooks (KEEP but simplify)
  - Keep core Playbook generation
  - Simplify PlaybookReviewModal (fewer steps)
  - Simplify GuidedSynthesisModal (fewer questions)
  - Remove complex update flows
  - Focus on 1-2 template types

☐ Simplify Theme Grouping → Topics
  - Remove ThemesSection complex UI
  - Remove AI-based theme clustering
  - Replace with simple Topic categorization
  - Manual or basic categorization only

☐ Keep Contradictions (CORE FEATURE - simplify only)
  - Keep ContradictionResolutionDecision
  - Keep contradiction detection
  - Simplify UI/flow but keep functionality
  - This is core to the app!
```

**Expected Result:**
- ~3000 lines of code removed (Concepts + DeepInsights + complex themes)
- Faster app load time (less AI processing)
- Simpler mental model (just Insights + Topics)
- Contradictions still work (core feature preserved)
- Playbooks still work (but simpler to use)

---

### **Week 2: Refactor Left Panel (Explore) - WITH PROGRESSIVE DISCLOSURE**

**Goal:** Transform KnowledgeSidebar → Explore Panel with progressive disclosure

**Reference:** PANEL_COMPONENT_SPECS.md - LEFT PANEL section

**Current KnowledgeSidebar has:**
- Artifacts (grouped by themes)
- Concepts section (removed in Week 1)
- DeepInsights section (removed in Week 1)
- Complex search/filtering
- Pinned items

**DESIGN DECISION: KNOWLEDGE PANEL (Topics-First)**

After user journey analysis and comparison of 6 different approaches, we're building a **Topics-First** design that:
- Shows Topics as the primary organizational structure
- Displays topic summaries inline (no drilling down)
- Integrates Focus items into main view
- Provides streaming states during AI organization
- Simple, clean, focused on knowledge structure

**MVP Knowledge Panel (DEFAULT VIEW):**
```
┌─ KNOWLEDGE ─────────────────────────────┐
│ [◁] Minimize                            │
│                                         │
│ [🔍 Search knowledge...]                │
│                                         │
│ ┌─ TOPICS ────────────────────────────┐ │ ← PRIMARY: Topics with summaries
│ │ 🧠 Neural Networks                  │ │
│ │   └─ Computing systems inspired by  │ │ ← Topic summary inline
│ │       biological neural networks     │ │
│ │                                     │ │
│ │ 🎯 Training Techniques              │ │
│ │   └─ Methods to optimize neural      │ │
│ │       network learning and reduce    │ │
│ │       prediction errors              │ │
│ │                                     │ │
│ │ 🏗️ Model Architectures              │ │
│ │   └─ Different neural network        │ │
│ │       structures and designs         │ │
│ │                                     │ │
│ │ ⭐ Focus Items                       │ │ ← Focus integrated here!
│ │   └─ 3 important items across topics │ │
│ │                                     │ │
│ │ [View all topics →]                 │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

**DURING STREAMING/ORGANIZATION:**
```
┌─ KNOWLEDGE ─────────────────────────────┐
│ [🔍 Search knowledge...]                │
│                                         │
│ 💡 Neural networks learn through        │ ← NEW Insight appears
│    backpropagation...                   │   (fades into topic below)
│                                         │
│ 📝 "Batch size affects training         │ ← NEW Idea appears
│    speed..."                            │   (fades into topic below)
│                                         │
│ ⭐ Focus Items (3)                       │ ← Always visible
│   └─ Important items across topics      │
│                                         │
│ 🧠 Neural Networks                      │ ← Topics
│   └─ Computing systems inspired...      │
│                                         │
│ 🎯 Training Techniques                  │
│   └─ Methods to optimize...             │
│                                         │
│ [Organizing knowledge...]               │ ← State indicator
└─────────────────────────────────────────┘
```

**TOPIC DETAIL VIEW (Click a topic):**
```
┌─ 🧠 NEURAL NETWORKS ────────────────────┐
│ [← Back to Knowledge]                   │
│                                         │
│ ├── ⭐ Focus Items (2)                   │
│ │   ├── 📝 "CNN architectures..."      │
│ │   └── 💡 "Transfer learning reduces..."│
│ │                                      │
│ ├── 💡 Insights (4)                     │
│ │   ├── 💡 Neural networks learn       │
│ │   │      through backpropagation     │
│ │   ├── 💡 Activation functions...     │
│ │   ├── 💡 Dropout prevents...         │
│ │   └── 💡 Batch normalization...      │
│ │                                      │
│ ├── 📝 Ideas (5)                        │
│ │   ├── 📝 "Batch size affects..."     │
│ │   ├── 📝 "Gradient descent..."       │
│ │   ├── 📝 "Overfitting occurs..."     │
│ │   ├── 📝 "Learning rate determines..."│
│ │   └── 📝 "Weight initialization..."  │
│ │                                      │
│ └── 📁 Archive (3)                      │
│     └── Older items...                 │
└─────────────────────────────────────────┘
```

**KEY FEATURES:**
- **Main bar:** Topics + Focus section + streaming new items
- **Streaming:** New Ideas/Insights appear at top → fade into matching topic
- **Focus visible:** Always on main bar (not hidden)
- **Topic detail:** Click topic → See Focus/Insights/Ideas/Archive breakdown
- **Search:** Always accessible at top

**Tasks:**
```
☐ Rename panel: KnowledgeSidebar → Knowledge Panel
  - Update component name
  - Update terminology throughout
  - "Knowledge" not "Explore"

☐ Simplify to Topics-First view
  - PRIMARY section: Topics with summaries
  - Show topic emoji + name + inline summary
  - NO counts in main view (keep it clean)
  - NO separate Ideas section (content lives in topics)
  - NO separate Insights section (content lives in topics)
  - Topics ARE the primary organization

☐ Build Topics section with inline summaries
  - Each topic card shows:
    * Topic emoji + name (🧠 Neural Networks)
    * Summary text indented below (└─ Computing systems...)
    * Hover: Subtle highlight
    * Click: Opens topic detail view
  - Topic summaries from AI (already in themedArtifactGroups)
  - Expandable/collapsible (optional)
  - Clean, scannable list

☐ Integrate Focus Items into main Topics section
  - ⭐ Focus Items as a special "topic"
  - Shows count: "3 important items across topics"
  - Positioned WITHIN Topics section (not separate)
  - Click: Shows all pinned items
  - Inline with other topics (not hidden)

☐ Add streaming/organization states (CRITICAL)
  - NEW CONTENT APPEARS: At top of main bar
    * 💡 New Insight appears (from AI processing)
    * 📝 New Idea appears (from conversation)
    * Slide in from top with gentle animation
    * Stay visible for 2-3 seconds
  - FADE INTO TOPIC: Content moves to matching topic
    * Gentle fade animation (opacity 1 → 0.5 → 0)
    * Simultaneously fade in under matching topic
    * Smooth position transition
    * Takes ~500ms
  - ORGANIZING INDICATOR: While AI processes
    * "[Organizing knowledge...]" at bottom
    * Subtle pulse animation
    * Dismisses when done
  - FINAL STATE: Clean topics view
    * Content organized under topics
    * Streaming items cleared
    * Ready for next interaction

☐ Update search placeholder
  - "Search knowledge..." (simple and clear)
  - Search across all topics, ideas, insights
  - Filters everything in real-time
  - Simple text filter (no complex filters)

☐ Remove unnecessary sections from main bar
  - Remove Ideas section (shows in streaming, lives in topics)
  - Remove Insights section (shows in streaming, lives in topics)
  - Remove "More options ▼" (not needed)
  - Remove Archived section from main bar (shows in topic detail)
  - Keep main bar SIMPLE: Topics + Focus + Streaming items only

☐ Click topic → Detail view (CRITICAL)
  - Opens full topic breakdown view
  - Hierarchical structure:
    * ⭐ Focus Items (count) - Pinned items in this topic
    * 💡 Insights (count) - AI-generated key discoveries
    * 📝 Ideas (count) - Raw conversation content
    * 📁 Archive (count) - Archived items
  - Each section expandable/collapsible
  - Show full content of each item
  - Actions on each item: Pin/Unpin, Archive, Delete
  - Back button "← Back to Knowledge" at top
  - Breadcrumb: Knowledge > Neural Networks

☐ Test:
  - Empty state (no topics yet)
  - Loading state (organizing topics...)
  - Streaming state (new content appearing)
  - Topic click (opens detail view)
  - Focus items (shows pinned content)
  - Search (filters across all content)
```

**Components Simplified:**
```
components/features/
  └── KnowledgeSidebar.tsx → KnowledgePanel.tsx (RENAME + SIMPLIFY)
      - Topics section with inline summaries
      - Focus Items integrated
      - Search at top
      - Streaming states
      - Clean, minimal UI
```

**Key Principles:** 
- **Topics-First** - Topics ARE the primary organization
- **Inline summaries** - No drilling down to see what a topic is about
- **Focus integrated** - Part of main view, not hidden
- **Streaming states** - Show content organizing in real-time
- **Simple, clean** - Remove complexity, focus on knowledge structure
- **No separate sections** - Everything lives in Topics

---

### **Week 3: Refactor Center Panel (Chat) - WITH PROGRESSIVE DISCLOSURE**

**Goal:** Dual-mode chat panel with progressive disclosure

**Reference:** PANEL_COMPONENT_SPECS.md - CENTER PANEL section

**Current:** SubjectChatView only shows active chat
**MVP needs:** Conversation list (MODE 1) + Active chat (MODE 2) with progressive disclosure

**MODE 1: Conversation List (Default)**
```
┌─ CHAT ────────────────────────────────┐
│ 💬 Conversations          [🔍] [+]    │
│                                        │
│ ┌─ TODAY ────────────────────────┐    │
│ │ ┌─ Conversation Card ─────────┐│    │ ← SIMPLIFIED default
│ │ │ 💬 Training best practices  ││    │
│ │ │ "What's the optimal..."     ││    │
│ │ │ 2h ago • 🎯 Training         ││    │
│ │ │ [Continue →]                ││    │ ← Single action
│ │ └─────────────────────────────┘│    │
│ └─────────────────────────────────┘    │
│ [+ Start New Conversation]             │
└────────────────────────────────────────┘
```

**MODE 2: Active Conversation**
```
┌─ CHAT ────────────────────────────────┐
│ ← Back  💬 Training best practices    │
│                                        │
│ [Messages with inline actions]         │
│                                        │
│ [💬 Ask anything...]             [↵]  │
└────────────────────────────────────────┘
```

**Tasks:**
```
☐ Implement AI Contextual Welcome Message ⭐ KEY FEATURE
  - Generates personalized welcome when opening Chat panel
  - Shows in conversation list mode (MODE 1)
  - Replaces need for static overview card in Explore panel
  
  WHAT IT SHOWS:
  - Expertise stage context: "You've built 23 insights across 4 topics"
  - Recent focus areas: "Recent focus: neural networks"
  - Actionable suggestions (clickable): 
    * "Deep dive into CNNs?" → Auto-fills chat input
    * "Compare optimizers?" → Starts new conversation
    * "Generate study guide?" → Opens Create panel
  
  VARIATIONS BY STATE:
  - New subject (0 notes): "Welcome! What interests you about ML?"
  - Early (1-3 notes): "You've started building knowledge..."
  - Active learning (4-10 notes): "You've built solid foundation..."
  - After output generation: "I see you just generated a Study Guide..."
  - After inactivity: "Welcome back after a few days away!"
  
  IMPLEMENTATION:
  - Create WelcomeContext interface (stage, counts, recent topics)
  - Generate via AI prompt with context injection
  - Fallback to generic welcome if generation fails
  - User can dismiss/skip welcome
  - Cache welcome for session (don't regenerate every time)

☐ Create ConversationCard with progressive disclosure
  - DEFAULT VIEW (Day-to-Day User):
    * Title only
    * Preview text (1-2 lines)
    * Simplified metadata: timestamp + topic emoji
    * Single "Continue →" button
  
  - EXPANDED VIEW (Power User - on hover/long-press):
    * Unread indicator
    * Full metadata (message count, insights generated)
    * Multiple actions (Continue, Rename, Delete)
    * Stats in tooltip

☐ Create ConversationList component
  - Grouped by time (TODAY, YESTERDAY, LAST WEEK)
  - Shows last 20 conversations
  - Smart timestamps ("2h ago", not dates)
  - "New" button prominent
  - Empty state with helpful message

☐ Update SubjectChatView (dual mode)
  - Add mode prop: 'list' | 'active'
  - MODE 1: Render ConversationList
  - MODE 2: Render MessageView
  - Back button in MODE 2 → Returns to MODE 1
  - Smooth fade transition (300ms)

☐ Create MessageBubble component
  - User messages: Right-aligned, accent color
  - AI messages: Left-aligned, surface color
  - Inline actions on hover (copy, regenerate)
  - Special types: Insight created, output generated
  - Timestamps on hover

☐ Create ContextBanner (collapsible)
  - Shows "This conversation has generated X insights"
  - "View in Explore →" link
  - Can collapse to save space
  - Only shows if relevant

☐ Update routing
  - /subject/:subjectId → Show conversation list (MODE 1)
  - /subject/:subjectId/chat/:conversationId → Show active chat (MODE 2)

☐ Rename ChatSession → Conversation
  - Create Conversation type
  - Migrate data (IndexedDB schema change)
  - Update all imports
  - Remove old ChatSession type

☐ Test:
  - Empty state (no conversations)
  - Create new conversation
  - Switch between conversations
  - Progressive disclosure (hover states)
  - Delete conversation
  - MODE switching
```

**Components Created:**
```
components/chat/
  ├── ConversationList.tsx (with grouping)
  ├── ConversationCard.tsx (with progressive disclosure)
  ├── MessageView.tsx (refactor from SubjectChatView)
  ├── MessageBubble.tsx (with inline actions)
  ├── ContextBanner.tsx (collapsible banner)
  └── ChatPanel.tsx (container with mode switching)
```

**Key Principle:**
DEFAULT: Simple, scannable conversation cards
HOVER/LONG-PRESS: Full metadata and actions appear

---

### **Week 4: Refactor Right Panel (Create) - WITH PROGRESSIVE DISCLOSURE**

**Goal:** One-click output generation with progressive disclosure

**Reference:** PANEL_COMPONENT_SPECS.md - RIGHT PANEL section

**Current:** RightSidebar → KnowledgeOutputSidebar (complex playbook UI)
**MVP needs:** QuickGenerate button + progressive disclosure for advanced features

**DEFAULT VIEW (Day-to-Day User):**
```
┌─ CREATE ────────────────────────[▶]┐
│                                     │
│ ┌─ QUICK GENERATE ────────────────┐ │ ← PRIMARY: One action
│ │ 🎯 Generate Summary             │ │
│ │ Create overview of key insights │ │
│ │ ⚡ Takes about 30 seconds       │ │
│ │ [Generate Now →]                │ │ ← Prominent CTA
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─ RECENT ────────────────────────┐ │
│ │ 📄 Summary (2 hours ago)        │ │
│ │ 📚 Study Guide (Yesterday)      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [More options ▼]                    │ ← Progressive disclosure
└─────────────────────────────────────┘
```

**EXPANDED VIEW (Power User):**
```
┌─ CREATE ────────────────────────[▶]┐
│ [Quick Generate - same as above]    │
│                                     │
│ ┌─ TEMPLATE LIBRARY ──────────────┐ │ ← EXPANDED
│ │ ✨ RECOMMENDED                  │ │
│ │ 📚 Study Guide                  │ │
│ │ 📖 Detailed Guide               │ │
│ │ ❓ FAQ Generator                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─ CUSTOM GENERATION ────────────┐ │ ← EXPANDED
│ │ [Describe what you want...]    │ │
│ │ [Generate Custom →]            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Show less ▲]                       │
└─────────────────────────────────────┘
```

**Tasks:**
```
☐ Create OutputGenerationService
  - generateSummary(subjectId: string): Promise<Output>
  - generateGuide(subjectId: string): Promise<Output>
  - Uses existing AI services
  - Stores in new 'outputs' table

☐ Add Output entity
  - Create types/output.types.ts
  - Add to database schema
  - Migration script

☐ Create QuickGenerateCard (PRIMARY component)
  - Visual Design:
    * Large prominent card at top of panel
    * Icon: 🎯 or ✨ depending on suggestion
    * Smart title based on expertise stage:
      - Early: "Generate Summary" (quick overview)
      - Building: "Generate Study Guide" (structured learning)
      - Mature: "Generate Deep Analysis" (comprehensive)
    * Description: "Create overview of key insights"
    * Time estimate badge: "⚡ Takes about 30 seconds"
    * Progress bar during generation
  
  - States:
    * Locked (< 4 notes): Grayed out, "Add more notes to unlock"
    * Ready (4+ notes): Blue accent, clickable
    * Generating: Progress animation, cancel option
    * Success: Green checkmark, "View output →" button
    * Error: Red indicator, "Retry" button
  
  - Interactions:
    * Click "Generate Now →": Starts generation
    * During generation: Show progress % and AI thinking messages
    * On complete: Toast notification + "View output" button
    * Smart unlock: Celebrate when feature unlocks

☐ Create TemplateLibrary (under "More options ▼")
  - Structure:
    * ✨ RECOMMENDED section (2-3 smart suggestions)
    * 📚 OTHER TEMPLATES section (all available)
    * Each uses TemplateCard component
  
  - Template Cards:
    * Icon + Title + Description
    * Estimated time badge
    * Unlock indicator if requirements not met
    * "Best for: X notes, Y topics" hint
    * Hover: Show full description + requirements
  
  - Smart Recommendations:
    * Based on expertise stage
    * Based on recent topics
    * Based on past generations
    * Example: "Since you have 12 notes about Training, try FAQ Generator"

☐ Create CustomGenerationPrompt (under "More options ▼")
  - Visual Design:
    * Textarea with placeholder: "Describe what you want..."
    * Character counter (500 char limit)
    * Example prompts below as clickable chips
    * AI avatar icon to indicate intelligence
  
  - Example Prompts:
    * "Compare Adam vs SGD optimizers"
    * "Create a cheat sheet for quick reference"
    * "Explain neural networks to a beginner"
    * "Generate practice quiz questions"
  
  - Smart Features:
    * Template matching: "This sounds like a Study Guide - use that template?"
    * Validation: "Need 2+ topics for comparison" (helpful errors)
    * Auto-suggest: Type "compare" → Suggests comparison template
    * Preview: Shows rough outline before generating

☐ Create RecentOutputsList
  - Visual Design:
    * Compact cards (last 3 outputs)
    * Type icon (📄 Summary, 📚 Guide, etc.)
    * Title (truncated to 1 line)
    * Smart timestamp ("2h ago", "Yesterday")
  
  - Hover Actions (progressive disclosure):
    * [View] → Opens OutputModal
    * [Regenerate] → Updates with latest notes
    * [Export] → Download as PDF/Markdown
    * Show "Updated 2h ago" if regenerated
  
  - Smart Features:
    * "New insights available" badge if outdated
    * Version history link
    * Related outputs grouping

☐ Use ExpandableSection component (from Week 2)
  - "More options ▼" / "Show less ▲"
  - Consistent with Explore and Chat panels
  - Lazy load: TemplateLibrary + CustomPrompt only load when expanded
  - Remember preference per session
  - Smooth 300ms slide animation

☐ Generation logic:
  - Check expertise stage (unlock at 'building')
  - Show locked state if too early
  - Progress indicator during generation
  - Success/error states
  - "New insights available" notification

☐ Replace RightSidebar content:
  - Remove playbook views
  - Remove graph view
  - Add QuickGenerateCard
  - Keep simple, clean layout

☐ Test:
  - Locked state (not enough insights)
  - Generate summary (fast: ~30s)
  - Generate guide (slow: ~2min)
  - Progressive disclosure toggle
  - View output in modal
  - Regenerate output
```

**Components Created:**
```
components/create/
  ├── QuickGenerateCard.tsx (NEW - primary action)
  ├── TemplateLibrary.tsx (NEW - under "More options")
  ├── TemplateCard.tsx (individual template)
  ├── CustomGenerationPrompt.tsx (NEW - under "More options")
  ├── RecentOutputsList.tsx (compact list with hover actions)
  ├── OutputModal.tsx (view generated output)
  └── CreatePanel.tsx (container with ExpandableSection)
```

**Key Principle:**
DEFAULT: One prominent "Generate" button
EXPANDED: Full template library + custom generation

**Service Created:**
```typescript
// services/outputGenerationService.ts
export class OutputGenerationService {
  async generateSummary(subjectId: string): Promise<Output> {
    const insights = await dataService.getArtifacts(subjectId);
    const prompt = `Generate a concise summary of these insights:\n${insights.map(i => i.content).join('\n')}`;
    const response = await aiService.chat(prompt);
    
    return {
      id: uuidv4(),
      subjectId,
      type: 'summary',
      title: 'Quick Summary',
      content: response.message,
      generatedAt: new Date(),
    };
  }

  async generateGuide(subjectId: string): Promise<Output> {
    // Similar but different prompt
  }
}
```

---

### **Week 5: Integration & Panel Communication**

**Goal:** Wire up all 3 panels to work together

**Tasks:**
```
☐ Implement PanelEventBus
  - Create utils/panelEvents.ts
  - Define event types
  - Add TypeScript types

☐ Cross-panel interactions:
  - Click insight in Explore → Scroll to message in Chat
  - Click topic in Explore → Filter insights by topic
  - Generate output in Create → Uses insights from Explore
  - Open conversation in Chat → Update Explore context

☐ Update AppCore.tsx
  - Replace old sidebars with new panels
  - Set up event bus
  - Handle route changes
  - Panel visibility logic

☐ Error handling across panels
  - Wrap each panel in ErrorBoundary
  - Consistent error messages
  - Retry mechanisms

☐ Loading states across panels
  - LoadingState component in each panel
  - Skeleton screens (optional)
  - Progress indicators

☐ Empty states across panels
  - EmptyState component in each panel
  - Helpful messages
  - Call-to-action buttons

☐ Test integration:
  - Open app fresh (all empty states)
  - Create subject
  - Create conversation
  - Send messages
  - View insights populate
  - Generate output
  - Full user journey works
```

**Event Bus Implementation:**
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
    this.handlers.set(type, handlers.filter(h => h !== handler));
  }
}

export const panelEvents = new PanelEventBus();
```

---

### **Week 6: Polish, Testing & Documentation**

**Goal:** Ship-ready product

**Tasks:**
```
☐ Visual polish:
  - Consistent spacing across panels
  - Typography adjustments
  - Color refinements
  - Animations (fade only, simple)
  - Focus states for accessibility

☐ Accessibility:
  - Keyboard navigation
  - ARIA labels
  - Screen reader testing
  - Focus management

☐ Performance:
  - Check bundle size
  - Lazy load modals (already done)
  - Optimize re-renders
  - Database query optimization

☐ Testing:
  - Unit tests for new components
  - Integration tests for user flows
  - E2E tests with Playwright
  - Test with real data (lots of insights)

☐ Documentation:
  - Update README
  - Create .env.example
  - Document new architecture
  - Add code comments for complex logic
  - Create migration guide (if users exist)

☐ Bug bash:
  - Test all user flows
  - Fix bugs
  - Test error scenarios
  - Test edge cases

☐ Cleanup:
  - Remove commented code
  - Remove old unused components
  - Remove old types
  - Remove old services
  - ESLint pass
```

**Testing Checklist:**
```
User Flow Tests:
☐ New user opens app → Dashboard
☐ Create first subject → Success
☐ Open subject → Explore panel shows empty state
☐ Create conversation → Chat opens
☐ Send message → AI responds
☐ Insights appear in Explore panel → Success
☐ Click insight → Scrolls to message in Chat
☐ Generate output → Create panel shows templates
☐ Click "Generate Summary" → Loading → Success
☐ View output → Modal opens with content
☐ Generate guide → Takes longer → Success

Edge Cases:
☐ No API key configured → Helpful error
☐ Network error → Retry button works
☐ Empty states everywhere → Helpful messages
☐ Very long insight text → Truncates properly
☐ 100+ insights → Performance OK
☐ Delete subject → Confirmation → Success
☐ Rename conversation → Updates everywhere
```

---

## 🗂️ Data Migration Strategy

Since you're **refactoring existing app**, you may have data in IndexedDB.

### **Schema Changes Needed:**

```typescript
// OLD schema (current)
{
  users: User[];
  subjects: Subject[];
  chatSessions: ChatSession[];  // ← Rename to conversations
  messages: Message[];
  artifacts: Artifact[];        // ← Keep but rename display
  concepts: Concept[];          // ← REMOVE
  deepInsights: DeepInsight[];  // ← REMOVE
  playbooks: Playbook[];        // ← REMOVE
  contradictions: Contradiction[]; // ← REMOVE
  artifactThemeGroups: ArtifactThemeGroup[]; // ← Simplify to topics
}

// NEW schema (MVP)
{
  users: User[];
  subjects: Subject[];
  conversations: Conversation[];  // ← Renamed from chatSessions
  messages: Message[];
  insights: Insight[];            // ← Renamed from artifacts
  topics: Topic[];                // ← Simplified from artifactThemeGroups
  outputs: Output[];              // ← NEW for generated summaries/guides
}
```

### **Migration Script:**

```typescript
// scripts/migrate-to-mvp.ts
import { db } from '@/services/database.schema';

async function migrateToMVP() {
  console.log('🔄 Starting migration to MVP schema...');

  // Step 1: Rename chatSessions → conversations
  const sessions = await db.chatSessions.toArray();
  for (const session of sessions) {
    await db.conversations.put({
      id: session.id,
      subjectId: session.subjectId,
      title: session.title,
      preview: '', // Generate from first message
      lastMessageAt: new Date(session.lastActivityAt),
      createdAt: new Date(session.createdAt),
    });
  }
  await db.chatSessions.clear();

  // Step 2: Rename artifacts → insights
  const artifacts = await db.artifacts.toArray();
  for (const artifact of artifacts) {
    await db.insights.put({
      id: artifact.id,
      subjectId: artifact.subjectId,
      content: artifact.content,
      category: 'General', // Default category
      createdAt: new Date(artifact.createdAt),
    });
  }
  await db.artifacts.clear();

  // Step 3: Delete deprecated tables
  await db.concepts.clear();
  await db.deepInsights.clear();
  await db.playbooks.clear();
  await db.contradictions.clear();

  // Step 4: Simplify themes → topics
  const themeGroups = await db.artifactThemeGroups.toArray();
  for (const group of themeGroups) {
    await db.topics.put({
      id: group.id || uuidv4(),
      subjectId: group.subjectId || '',
      name: group.theme,
      emoji: '📌', // Default emoji
      insightCount: group.artifactIds.length,
      createdAt: new Date(),
    });
  }
  await db.artifactThemeGroups.clear();

  console.log('✅ Migration complete!');
}

// Run migration on app startup if needed
export { migrateToMVP };
```

### **When to Run Migration:**

```typescript
// src/App.tsx or AppCore.tsx
useEffect(() => {
  const checkMigration = async () => {
    const needsMigration = await db.chatSessions.count() > 0;
    if (needsMigration) {
      console.log('📦 Old schema detected, migrating...');
      await migrateToMVP();
      window.location.reload(); // Reload after migration
    }
  };
  checkMigration();
}, []);
```

**OR (simpler for MVP):**

Just clear the database on first load:
```typescript
// For MVP: Wipe and start fresh
localStorage.setItem('mvp-migration-done', 'true');
if (!localStorage.getItem('mvp-migration-done')) {
  await db.delete();
  await db.open();
  localStorage.setItem('mvp-migration-done', 'true');
}
```

---

## 📝 Components Registry

Single source of truth for component names:

```typescript
// src/components/registry.ts
export const COMPONENTS = {
  // Explore Panel (Left)
  SubjectOverviewCard: 'SubjectOverviewCard',
  RecentInsightsList: 'RecentInsightsList',
  TopicsList: 'TopicsList',
  FocusSection: 'FocusSection',
  ExplorePanel: 'ExplorePanel',
  
  // Chat Panel (Center)
  ConversationList: 'ConversationList',
  ConversationCard: 'ConversationCard',
  MessageView: 'MessageView',
  MessageBubble: 'MessageBubble',
  ChatPanel: 'ChatPanel',
  
  // Create Panel (Right)
  OutputGenerator: 'OutputGenerator',
  TemplateCard: 'TemplateCard',
  RecentOutputsList: 'RecentOutputsList',
  OutputModal: 'OutputModal',
  CreatePanel: 'CreatePanel',
  
  // Shared/Foundation
  ErrorBoundary: 'ErrorBoundary',
  LoadingState: 'LoadingState',
  EmptyState: 'EmptyState',
  
  // Keep from current
  Dashboard: 'Dashboard',
  TopBarHeader: 'TopBarHeader',
  AppCore: 'AppCore',
} as const;

export type ComponentName = keyof typeof COMPONENTS;
```

---

## 🎯 Success Metrics

**Technical Success:**
- ✅ All deprecated features removed
- ✅ Bundle size reduced by 30%+
- ✅ No P0 bugs
- ✅ <2s page load
- ✅ All E2E tests passing

**User Success:**
- ✅ Can create subjects
- ✅ Can chat and get AI responses
- ✅ Insights appear in Explore panel
- ✅ Can generate outputs
- ✅ No confusing features

**Code Quality:**
- ✅ Component registry established
- ✅ Error handling consistent
- ✅ All panels have empty/loading/error states
- ✅ TypeScript strict mode passing
- ✅ ESLint warnings = 0

---

## 🚀 Week 0 Action Items (This Week)

Before Week 1 starts, complete these:

### **Day 1-2: Foundation Components**

```bash
# Create these files:
touch src/components/ErrorBoundary.tsx
touch src/components/ui/LoadingState.tsx
touch src/components/ui/EmptyState.tsx
touch src/utils/panelEvents.ts
touch src/components/registry.ts

# Create new type files:
touch src/types/conversation.types.ts
touch src/types/insight.types.ts
touch src/types/output.types.ts
touch src/types/topic.types.ts
```

### **Day 3: Create .env.example**

```bash
# .env.example
VITE_AI_SERVICE=local
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_LOCAL_LLM_BASE_URL=http://localhost:1234
VITE_LOCAL_LLM_MODEL=llama-3.2-3b-instruct
VITE_ENABLE_DEVELOPER_MODE=true
VITE_LOG_LEVEL=info
```

### **Day 4: Document Expertise Stages**

```markdown
# Expertise Stage Logic

Stages are based on insight count (not playbooks):

- **Exploring** (●): 0-5 insights
  - Just getting started
  - Unlock: None needed
  
- **Building** (◆): 6-15 insights
  - Building substantial understanding
  - Unlock: Output generation

- **Synthesizing** (◆): 16-30 insights
  - Ready to synthesize knowledge
  - Unlock: Advanced templates (post-MVP)

- **Mature** (★): 30+ insights
  - Rich understanding established
  - Unlock: All features
```

### **Day 5: Set Up Project Board**

Create GitHub issues or Trello cards for:
- [ ] Week 1: Remove complexity (8 tasks)
- [ ] Week 2: Refactor Explore panel (6 tasks)
- [ ] Week 3: Refactor Chat panel (7 tasks)
- [ ] Week 4: Refactor Create panel (6 tasks)
- [ ] Week 5: Integration (8 tasks)
- [ ] Week 6: Polish & testing (7 tasks)

---

## 🔥 Red Flags - Stop If:

```
❌ Week 1 takes longer than 5 days
   → Scope is bigger than expected, reassess

❌ Migration breaks existing data
   → Need rollback plan

❌ New components don't match design
   → Align with MVP spec before continuing

❌ Performance degrades
   → Profile and optimize before adding more

❌ Team disagrees on approach
   → Stop and align, don't code in different directions
```

---

## 💡 Key Principles

1. **Simplify first, enhance later**
   - Remove before adding
   - Less code = less bugs

2. **One panel at a time**
   - Don't touch all 3 panels simultaneously
   - Finish one before starting next

3. **Keep app working**
   - Don't break existing features
   - Feature flags for big changes

4. **Test continuously**
   - Don't wait until Week 6
   - Test each panel as you build

5. **Document as you go**
   - Update types immediately
   - Comment complex logic
   - Update README

---

## 📚 Additional Resources

**MVP Spec Reference:**
- `PANEL_COMPONENTS_MVP.md` - Component specifications
- `PANEL_COMPONENT_SPECS.md` - Design details (reference only)
- `NEXUSMIND_IMPLEMENTATION_PLAN.md` - Long-term vision

**Codebase Reference:**
- `src/AppCore.tsx` - Main application container
- `src/types/` - Type definitions
- `src/services/` - Business logic
- `src/contexts/` - State management

---

**Ready to start Week 0?** Let's create those foundation components!
