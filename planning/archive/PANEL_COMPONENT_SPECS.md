# Panel Component Specifications - Detailed Visual Design

This document provides detailed specifications for all components in the 3-panel workspace.

---

## Design Philosophy: Progressive Disclosure for Daily Users

**Core Principles:**
1. **Expertise over metrics**: Qualitative stages, not arbitrary numbers
2. **Daily users first**: Show what's needed for routine tasks
3. **Power users aren't forgotten**: Advanced features accessible via progressive disclosure
4. **Context-aware**: Interface adapts to user expertise and current task

### User Types

**Day-to-Day User** (80% of usage):
- Opens app to continue learning
- Wants to see "what's new" quickly
- Generates simple outputs occasionally
- Doesn't need detailed metadata

**Power User** (20% of usage):
- Manages multiple subjects/conversations
- Needs detailed statistics and metadata
- Creates complex custom outputs
- Wants full control and visibility

**Design Approach:** Start simple, reveal complexity on demand.

### Why No Percentage Bars or Counts?

❌ **Problems with metrics:**
- "68% complete" - Complete to what? How is it calculated?
- "47 insights" - Is that good? Should I have more?
- "6 topics" - Am I behind? Is this enough?
- Progress bars imply a finish line that doesn't exist in learning

✅ **Benefits of expertise stages:**
- "Building knowledge" - Clear state, no pressure
- "Ready to synthesize" - Action-oriented, encouraging
- "Knowledge mature" - Celebratory, not a limit
- Focus on journey, not arbitrary goals

### Where Numbers Go

**Primary UI:** Expertise stages, action hints, topic names
**Details View:** Stats modal with counts (for power users who want them)

**Example:**
- Primary: "◆ Ready to Synthesize - You've built solid understanding"
- Details modal: "124 ideas, 47 insights, 6 topics, 12 days active"

Numbers are available but not prominent.

---

## Overview: 3-Panel Architecture

```
┌─────────────────────────────────────────────────────────┐
│ TopBar: NexusMind | [Subject ▼] | [Profile] | Settings  │
└─────────────────────────────────────────────────────────┘

┌─ [◁] EXPLORE ──────┬─ CHAT ────────────┬─ CREATE [▶] ──┐
│                     │                    │                │
│ Left Panel          │ Center Panel       │ Right Panel    │
│ (Knowledge View)    │ (Conversation Hub) │ (Output Gen)   │
│                     │                    │                │
└─────────────────────┴────────────────────┴────────────────┘
```

---

## LEFT PANEL: Explore (Knowledge View)

**Purpose:** Unified knowledge exploration - see what you know, track growth, discover patterns

**Design Philosophy:** Focus on **expertise stages** and **what you can do**, not metrics

### Expertise Stages (Already Implemented!)

Your app already uses a great qualitative progression model:

1. **● Exploring** (Just started)
   - "Just getting started"
   - Action: Keep chatting to build knowledge
   - No pressure to have "enough" content
   
2. **◆ Building Knowledge** (Making progress)
   - "Building substantial understanding"
   - Action: Explore related topics
   - Encourage depth, not breadth
   
3. **◆ Ready to Synthesize** (Solid base)
   - "You've built solid understanding"
   - Action: Try generating a Study Guide
   - Unlock advanced outputs
   
4. **★ Knowledge Mature** (Expert level)
   - "Rich understanding with insights"
   - Action: Browse topics, search, teach others
   - All features unlocked

**Stage Transition Animations:**
- **Level up effect**: Subtle confetti animation when reaching new stage
- **Badge transformation**: Stage icon morphs smoothly (● → ◆ → ★)
- **Celebratory message**: "You've reached [stage]!" toast notification
- **New unlocks highlight**: Newly available features glow briefly
- **Sound effect**: Optional gentle chime (user preference)

**Key Principle:** Numbers (topic counts, insight counts) available in "View details" modal, not primary UI.

### Component Hierarchy (Simplified for Daily Use)

**DEFAULT VIEW** (Day-to-Day User):
```
┌─ EXPLORE PANEL ────────────────────────┐
│ [◁] Minimize                            │
│                                         │
│ ┌─ WHAT'S NEW ───────────────────────┐ │ ← UNIFIED: Overview + Recent
│ │ 📚 Machine Learning                │ │
│ │ ◆ Ready to Synthesize              │ │
│ │ Last active: Today                 │ │
│ │                                    │ │
│ │ ✨ Try generating a Study Guide    │ │
│ │                                    │ │
│ │ 💡 New: "Transfer learning can..." │ │
│ │    2 hours ago • 🧠 Neural Networks │ │
│ │                                    │ │
│ │ 💡 Added topic: Optimization       │ │
│ │    Yesterday                       │ │
│ │                                    │ │
│ │ [View all activity →]              │ │
│ └────────────────────────────────────┘ │
│                                         │
│ ┌─ TOPICS ──────────────────────────┐   │ ← SIMPLIFIED: Top-level only
│ │ ▸ 🧠 Neural Networks               │   │
│ │ ▸ 🎯 Training Techniques           │   │
│ │ ▸ 🏗️  Model Architectures           │   │
│ │ ▸ ⚡ Optimization                   │   │
│ │                                    │   │
│ │ [Browse all topics →]              │   │
│ └────────────────────────────────────┘   │
│                                         │
│ [🔍 Search insights, topics...]        │ ← SINGLE search bar
│                                         │
│ [More options ▼]                        │ ← COLLAPSED: Focus, Archived
└─────────────────────────────────────────┘
```

**EXPANDED VIEW** (Power User):
```
┌─ EXPLORE PANEL ────────────────────────┐
│ [◁] Minimize                            │
│                                         │
│ ┌─ WHAT'S NEW ───────────────────────┐ │
│ │ [Same as above]                    │ │
│ │ [View all activity →]              │ │
│ └────────────────────────────────────┘ │
│                                         │
│ ┌─ TOPICS (EXPANDED) ────────────────┐  │ ← FULL tree when expanded
│ │ ▾ 🧠 Neural Networks         ◉     │  │
│ │   ├─ Feedforward Networks          │  │
│ │   ├─ Convolutional Networks        │  │
│ │   └─ Recurrent Networks            │  │
│ │ ▸ 🎯 Training Techniques     ◉     │  │
│ │ ▸ 🏗️  Model Architectures           │  │
│ │                                    │  │
│ │ [Stats & details ↗]                │  │
│ └────────────────────────────────────┘  │
│                                         │
│ [🔍 Search...]                          │
│                                         │
│ ┌─ FOCUS ───────────────────────────┐   │ ← EXPANDED section
│ │ 🎯 Adam optimizer combines...     │   │
│ │ 🎯 Dropout prevents overfitting...│   │
│ │ 🎯 Early stopping criterion...    │   │
│ └────────────────────────────────────┘   │
│                                         │
│ [View Archived Ideas →]                 │
│                                         │
│ [Show less ▲]                           │
└─────────────────────────────────────────┘
```

### Detailed Component Specs

#### 1. **Subject Overview Card** (Expertise-Focused)
```tsx
<SubjectOverviewCard>
  // Visual design
  - Background: Subtle gradient (primary → secondary)
  - Icon: Subject emoji or generated icon
  - Stage indicator: Colored badge (no progress bar!)
  - Last activity: Smart timestamp
  - What you can do now: Action-oriented hint
  
  // Interactions
  - Hover: Show edit/settings button
  - Click: Expand for detailed timeline view
  - Stats link: Opens modal with numbers (not primary UI)
  
  // Animation
  - Stage badge subtle pulse on mount
  - Smooth fade-in for content
</SubjectOverviewCard>
```

**Visual Example (Exploring Stage):**
```
┌──────────────────────────────────────┐
│ 🧠 Machine Learning                  │
│                                      │
│ ● Early Exploration                  │
│ Just getting started                 │
│                                      │
│ 💬 Keep chatting to build knowledge  │
│                                      │
│ 🕐 Last activity: 5 min ago          │
│                                      │
│ [View details ↗]                     │
└──────────────────────────────────────┘
```

**Visual Example (Synthesizing Stage):**
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

**Visual Example (Mature Stage):**
```
┌──────────────────────────────────────┐
│ 🧠 Machine Learning                  │
│                                      │
│ ★ Knowledge Mature                   │
│ Rich understanding with insights     │
│                                      │
│ 📚 Browse topics • 🎯 Search         │
│                                      │
│ 🕐 Building for 12 days              │
│                                      │
│ [View details ↗]                     │
└──────────────────────────────────────┘
```

#### 2. **Topics Section** (Expandable Tree)
```tsx
<TopicsTree>
  // Visual design
  - Collapsible tree structure
  - Indent levels with connecting lines
  - Icons per topic type (emoji or colored dots)
  - Unread indicator (◉) not count
  
  // States
  - Collapsed: ▸ Icon + Topic name [◉ if unread]
  - Expanded: ▾ Icon + Topic name
    - Shows nested subtopics/insights
  
  // Interactions
  - Click topic: Expand/collapse
  - Click insight: Highlight in right panel
  - Right-click: Context menu (rename, merge, delete)
  - Hover: Show topic description
  
  // Smart features
  - Auto-highlight topics mentioned in active chat
  - Glow effect when new insight added to topic
  - "Active" indicator if discussing this topic now
</TopicsTree>
```

**Visual Example:**
```
┌─ TOPICS ─────────────────────────────┐
│                                       │
│ ▾ 🧠 Neural Networks         ◉       │
│   │                                   │
│   ├─ Feedforward Networks             │
│   ├─ Convolutional Networks           │
│   └─ Recurrent Networks               │
│                                       │
│ ▸ 🎯 Training Techniques     ◉       │
│ ▸ 🏗️  Model Architectures             │
│ ▸ ⚡ Optimization Methods             │
│                                       │
│ [Stats & details ↗]                   │
└───────────────────────────────────────┘

Legend: ◉ = Contains unread insights
        ✨ = Currently discussing (active topic)
```

#### 3. **Recent Insights Card**
```tsx
<RecentInsightsCard>
  // Visual design
  - Compact list with 3-5 visible items
  - Each insight: 💡 icon + truncated text + timestamp
  - Subtle hover highlight
  - "View all" expandable
  
  // Interactions
  - Click insight: Opens detail modal
  - Hover: Show full text tooltip
  - Right-click: Add to focus, archive, copy
  
  // Smart features
  - New insights glow briefly (2s)
  - Related insights grouped visually
  - Smart previews (first sentence + relevance)
</RecentInsightsCard>
```

**Visual Example:**
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

#### 4. **Search Bar** (Enhanced)
```tsx
<EnhancedSearchBar>
  // Visual design
  - Floating search input with icon
  - Recent searches dropdown
  - Type-ahead suggestions
  - Filter chips below (Topics, Insights, Ideas)
  
  // Interactions
  - Type: Instant filter all sections
  - Click suggestion: Apply filter
  - Clear: Reset view
  
  // Smart features
  - Semantic search (not just keyword)
  - Search within active conversation context
  - "Find similar" option
</EnhancedSearchBar>
```

#### 5. **Focus Section** (Active Workspace)
```tsx
<FocusSection>
  // Purpose
  - Show ideas user is actively working with
  - Quick reference for current focus areas
  - Not an archive - active workspace (3-5 items max)
  
  // Visual design
  - Title: "Focus" or "In Focus"
  - Icon: 🎯 (target/bullseye)
  - Compact list with hover actions
  - Empty state: "Add ideas to focus on"
  
  // Interactions
  - Click idea: View full details
  - Hover: Show [Remove from focus] button
  - Drag-drop: Reorder focus priorities
  
  // Actions
  - "Add to focus" (from insights, ideas)
  - "Remove from focus" (not "unpin")
  - Maximum 5 items (encourage curation)
  
  // Smart features
  - Suggest adding frequently referenced ideas
  - "You mentioned this 3 times today"
  - Auto-remove after 7 days inactive
</FocusSection>
```

**Visual Example:**
```
┌─ FOCUS ───────────────────────────┐
│                                    │
│ 🎯 Adam optimizer combines         │
│    momentum and RMSprop...         │
│    [×] (remove on hover)           │
│                                    │
│ 🎯 Dropout prevents overfitting    │
│    by randomly disabling...        │
│    [×]                             │
│                                    │
│ 🎯 Early stopping criterion        │
│    monitors validation loss...     │
│    [×]                             │
│                                    │
└────────────────────────────────────┘

Empty state:
┌─ FOCUS ───────────────────────────┐
│                                    │
│ 🎯 Add ideas to focus on           │
│                                    │
│ Pin important ideas to keep them   │
│ handy while you work               │
│                                    │
└────────────────────────────────────┘
```

---

## CENTER PANEL: Chat (Conversation Hub)

**Purpose:** Dual-mode panel - conversation list when idle, active chat when engaged

### Two Modes

#### MODE 1: Conversation List (No Active Conversation)

```
┌─ CHAT ────────────────────────────────┐
│                                        │
│ ┌─ Chat Header ─────────────────────┐ │
│ │ 💬 Conversations                  │ │
│ │           [🔍] [+] [Filter ▾]    │ │
│ └────────────────────────────────────┘ │
│                                        │
│ [🔍 Search conversations...]          │
│                                        │
│ ┌─ TODAY ────────────────────────┐    │
│ │                                 │    │
│ │ ┌─ Conversation Card ─────────┐ │    │
│ │ │ 💬 Training best practices  │ │    │
│ │ │ "What's the optimal batch..." │ │    │
│ │ │ 3 messages • 5 min ago       │ │    │
│ │ │ 🎯 Training • 💡 2 insights   │ │    │
│ │ └─────────────────────────────┘ │    │
│ │                                 │    │
│ │ ┌─ Conversation Card ─────────┐ │    │
│ │ │ 💬 Model evaluation         │ │    │
│ │ │ "How do I measure model..." │ │    │
│ │ │ 12 messages • 2 hours ago   │ │    │
│ │ │ 📊 Evaluation • 💡 5 insights │ │    │
│ │ └─────────────────────────────┘ │    │
│ └─────────────────────────────────┘    │
│                                        │
│ ┌─ YESTERDAY ────────────────────┐    │
│ │                                 │    │
│ │ ┌─ Conversation Card ─────────┐ │    │
│ │ │ 💬 Neural network basics    │ │    │
│ │ │ "Explain backpropagation..." │ │    │
│ │ │ 24 messages • Yesterday      │ │    │
│ │ │ 🧠 Fundamentals • 💡 8 insights│ │   │
│ │ └─────────────────────────────┘ │    │
│ └─────────────────────────────────┘    │
│                                        │
│ ┌─ LAST WEEK ────────────────────┐    │
│ │ [Show 5 more conversations...]  │    │
│ └─────────────────────────────────┘    │
│                                        │
│ [+ Start New Conversation]             │
└────────────────────────────────────────┘
```

#### Conversation Card Specs

**DEFAULT VIEW** (Day-to-Day User):
```tsx
<ConversationCard>
  // Visual design
  - Card with subtle hover elevation
  - Title: First message or AI-generated title
  - Preview: Last message (1-2 lines max)
  - Simplified metadata: Timestamp + topic emoji only
  
  // States
  - Default: White/light background
  - Hover: Slight elevation, border glow
  - Active: Highlighted border (accent color)
  - Unread: Bold title, dot indicator (●)
  
  // Interactions
  - Click: Opens conversation
  - Long-press/Right-click: Shows detailed menu
  
  // Smart features
  - Auto-categorize by topic
  - Smart timestamp ("2h ago", "Yesterday")
</ConversationCard>
```

**Visual Example (Simplified)**:
```
┌─ Conversation Card ──────────────────┐
│ 💬 Training best practices           │ ← Title only
│                                      │
│ "What's the optimal batch size..."   │ ← Preview text
│                                      │
│ ⏰ 2 hours ago • 🎯 Training          │ ← Simplified metadata
│                                      │
│ [Continue →]                          │ ← Single action
└──────────────────────────────────────┘
```

**EXPANDED VIEW** (Power User - on hover/long-press):
```
┌─ Conversation Card ──────────────────┐
│ 💬 Training best practices           │
│ ● Unread                             │ ← Unread indicator
│                                      │
│ "What's the optimal batch size..."   │
│                                      │
│ 🗨️  8 messages • ⏰ 2 hours ago       │ ← Full metadata
│ 🎯 Training • 💡 3 insights           │
│                                      │
│ [Continue] [Rename] [Delete]         │ ← Multiple actions
└──────────────────────────────────────┘
```

**Progressive Disclosure**:
- **Default**: Simple, scannable
- **Hover**: Show edit actions
- **Right-click**: Full context menu with stats
- **Details modal**: Read progress, message list, related conversations

#### MODE 2: Active Conversation

```
┌─ CHAT ────────────────────────────────┐
│                                        │
│ ┌─ Conversation Header ─────────────┐ │
│ │ ← Back  💬 Training best practices│ │
│ │                         [⋮] Menu   │ │
│ └────────────────────────────────────┘ │
│                                        │
│ ┌─ Context Banner (Collapsible) ───┐  │
│ │ 📊 This conversation has generated │  │
│ │ 3 insights about Training          │  │
│ │ [View in Explore →]                │  │
│ └────────────────────────────────────┘  │
│                                        │
│ ┌─ Messages ────────────────────────┐  │
│ │                                    │  │
│ │ 👤 You: What's the optimal batch   │  │
│ │         size for training?         │  │
│ │                                    │  │
│ │ 🤖 Assistant: The optimal batch    │  │
│ │    size depends on several factors:│  │
│ │                                    │  │
│ │    💡 Insight Created:             │  │
│ │    "Batch size affects both..."    │  │
│ │    [View] [Add to Focus] [Archive] │  │
│ │                                    │  │
│ │ 👤 You: What about learning rate?  │  │
│ │                                    │  │
│ │ 🤖 Assistant: Learning rates...    │  │
│ │                                    │  │
│ └────────────────────────────────────┘  │
│                                        │
│ ┌─ Input ───────────────────────────┐  │
│ │ [💬 Ask anything...]               │  │
│ │                                    │  │
│ │ [📎] [🎤] [✨ Quick Actions]  [↵] │  │
│ └────────────────────────────────────┘  │
└────────────────────────────────────────┘
```

#### Message Components
```tsx
<MessageBubble>
  // Visual design (User)
  - Right-aligned
  - Background: Accent color (soft blue)
  - Avatar: User icon/photo
  - Timestamp on hover
  
  // Visual design (AI)
  - Left-aligned
  - Background: Surface color (light gray)
  - Avatar: AI icon/logo
  - Timestamp on hover
  
  // Special message types
  - Insight created: Yellow highlight box
  - Contradiction detected: Orange warning box
  - Report generated: Green success box
  
  // Interactions
  - Hover: Show actions (copy, edit, regenerate)
  - Click insight: Highlight in Explore panel
  - Click output: Open in Create panel
</MessageBubble>
```

**Visual Example:**
```
┌─ Message ──────────────────────────┐
│                                    │
│           You          2:45 PM     │
│ ┌──────────────────────────────┐  │
│ │ What's the difference between│  │
│ │ Adam and SGD optimizers?     │  │
│ └──────────────────────────────┘  │
│                                    │
│ Assistant              2:45 PM     │
│ ┌──────────────────────────────┐  │
│ │ Great question! Let me break │  │
│ │ down the key differences:    │  │
│ │                              │  │
│ │ 1. Adam (Adaptive Moment...) │  │
│ │ 2. SGD (Stochastic Grad...)  │  │
│ │                              │  │
│ │ ✨ 2 insights extracted      │  │
│ │ 📊 1 comparison created      │  │
│ └──────────────────────────────┘  │
│ [👍 Helpful] [🔄 Regenerate]      │
└────────────────────────────────────┘
```

---

## RIGHT PANEL: Create (Output Generation)

**Purpose:** One-click output generation, always visible, smart suggestions

**DEFAULT VIEW** (Day-to-Day User):
```
┌─ CREATE ────────────────────────[▶]┐
│                                     │
│ ┌─ QUICK GENERATE ────────────────┐ │ ← PRIMARY: Single action
│ │                                 │ │
│ │ 🎯 Generate Summary             │ │
│ │ Create overview of key insights │ │
│ │                                 │ │
│ │ ⚡ Takes about 30 seconds       │ │
│ │                                 │ │
│ │ [Generate Now →]                │ │ ← Prominent CTA
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─ RECENT ────────────────────────┐ │ ← SECONDARY: Quick access
│ │                                 │ │
│ │ 📄 Summary (2 hours ago)        │ │ ← Simplified
│ │ 📚 Study Guide (Yesterday)      │ │
│ │                                 │ │
│ │ [View all outputs →]            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [More options ▼]                    │ ← COLLAPSED: Advanced
└─────────────────────────────────────┘
```

**EXPANDED VIEW** (Power User):
```
┌─ CREATE ────────────────────────[▶]┐
│                                     │
│ ┌─ QUICK GENERATE ────────────────┐ │
│ │ 🎯 Generate Summary             │ │
│ │ [Generate Now →]                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─ TEMPLATE LIBRARY ──────────────┐ │ ← EXPANDED SECTION
│ │ ✨ RECOMMENDED                  │ │
│ │ 📚 Study Guide                  │ │
│ │ 📖 Detailed Guide               │ │
│ │                                 │ │
│ │ OTHER TEMPLATES                 │ │
│ │ ❓ FAQ Generator                │ │
│ │ 📊 Comparison Table             │ │
│ │ 🧠 Analysis Report              │ │
│ │ 🎨 Presentation Outline         │ │
│ │                                 │ │
│ │ [View all templates →]          │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─ CUSTOM GENERATION ────────────┐ │ ← EXPANDED SECTION
│ │ [Describe what you want...]    │ │
│ │                                 │ │
│ │ Examples:                      │ │
│ │ • "Compare Adam vs SGD"        │ │
│ │ • "Create a cheat sheet"       │ │
│ │ • "Explain to a beginner"      │ │
│ │                                 │ │
│ │ [Generate Custom →]            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─ RECENT OUTPUTS ───────────────┐ │
│ │ 📄 Summary (2h ago)             │ │
│ │    [View] [Regenerate] [Export]  │ │ ← Actions on hover
│ │ 📚 Study Guide (Yesterday)      │ │
│ │    [View] [Regenerate] [Export]  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Show less ▲]                       │ ← Toggle back
└─────────────────────────────────────┘
```

**Progressive Disclosure**:
- **Default**: One prominent "Generate Summary" button
- **Smart suggestion**: Changes based on knowledge stage ("Generate FAQ", "Create Guide")
- **More options**: Full template library + custom generation
- **Hover details**: Actions appear on recent outputs

### Detailed Component Specs

#### 1. **Template Cards** (Generation Options)
```tsx
<OutputTemplateCard>
  // Visual design
  - Card with icon, title, description
  - Estimated time badge
  - "Recommended" flag if smart match
  - Hover: Slight elevation + preview
  
  // States
  - Ready: Blue generate button
  - Generating: Progress bar + cancel option
  - Complete: Green checkmark + view button
  - Error: Red indicator + retry button
  
  // Interactions
  - Click "Generate": Start generation
  - Hover: Show detailed preview
  - Click card title: Explain what it generates
  
  // Smart features
  - Auto-recommend based on content
  - Disable if insufficient data
  - Show similar past outputs
</OutputTemplateCard>
```

**Visual Example:**
```
┌─ Template Card ────────────────────┐
│ 📚 Study Guide      ✨ RECOMMENDED │
│                                    │
│ Create a structured learning       │
│ guide with key concepts, examples, │
│ and practice questions             │
│                                    │
│ 💡 Your knowledge is ready         │
│ ⚡ Takes about 2 minutes           │
│                                    │
│ ┌──────────────────────────────┐  │
│ │      [Generate Guide →]       │  │
│ └──────────────────────────────┘  │
│                                    │
│ [⚙️ Customize...]                  │
└────────────────────────────────────┘
```

#### 2. **Generation Status Indicator**
```tsx
<GenerationStatus>
  // Visual design
  - Top banner showing readiness
  - Expertise stage reference (not counts!)
  - Quality indicator (traffic light colors)
  
  // States
  - Ready (Green): "✅ Ready to generate outputs"
  - Building (Blue): "💬 Keep chatting to unlock more"
  - Generating (Blue): "⚡ Generating..."
  - Error (Red): "❌ Generation failed"
  
  // Smart features
  - Suggest which templates work at current stage
  - "Once you reach [stage], you can create [output]"
  - No specific number requirements
</GenerationStatus>
```

#### 3. **Recent Outputs List**
```tsx
<RecentOutputsList>
  // Visual design
  - Compact list of past generations
  - Type icon + title + timestamp
  - Action buttons (view, regenerate, export)
  
  // Interactions
  - Click: Open in modal/new tab
  - Regenerate: Update with latest data
  - Export: Download as PDF/Markdown
  
  // Smart features
  - Show update notifications ("New insights available")
  - Version history
  - Compare versions
</RecentOutputsList>
```

#### 4. **Custom Generation Input**
```tsx
<CustomGenerationPrompt>
  // Visual design
  - Textarea with smart suggestions
  - Example prompts below
  - AI assistant icon
  
  // Interactions
  - Type: Show real-time suggestions
  - Click example: Fill prompt
  - Submit: Generate custom output
  
  // Smart features
  - Natural language understanding
  - Template matching ("This sounds like a Study Guide")
  - Validation ("Need more insights for this")
</CustomGenerationPrompt>
```

---

## Responsive Adaptations

### Large Desktop (≥1200px): Full 3-Panel

- All components fully visible
- Optimal reading widths
- No scrolling needed for primary content

### Mid Desktop (1000-1199px): Create Shrinks

- Create panel: Narrower (250px)
- Template cards: Stacked vertically
- Icons replace some text labels
- Tooltips for truncated content

### Tablet (768-999px): Top Tabs

All panels become full-width tabs:
- Tab bar: Chat | Explore | Create
- Smooth fade transitions (300ms)
- Preserve scroll position per tab
- Badge indicators (unread counts)

### Mobile (<768px): Bottom Tabs

- Bottom tab bar for thumb access
- Swipe gestures to switch tabs
- Full-screen immersive per tab
- Smart keyboard handling

**Mobile-Specific Benefits of Simplified Views:**

The progressive disclosure approach **shines on mobile**:

**Before (Complex Views):**
- ❌ Cramming 5+ sections into small screens
- ❌ Tiny touch targets for metadata
- ❌ Overwhelming information density
- ❌ Constant scrolling to find actions

**After (Simplified Views):**
- ✅ 2-3 sections maximum (fits one screen)
- ✅ Large touch targets (44x44px minimum)
- ✅ Essential information only
- ✅ Primary action immediately visible

**Example: Conversation Card on Mobile**

*Complex version (before):*
```
┌─────────────────────────┐
│ Training hyperparameters │ ← 12px font
│ "What learning rate..." │
│ 🗨️ 8 msg • 2h • 🎯 • 💡 3│ ← Cramped metadata
│ [─────────] 100%        │ ← Unnecessary
└─────────────────────────┘
```

*Simplified version (after):*
```
┌─────────────────────────┐
│ Training best practices │ ← 16px font
│                         │
│ "What's the optimal..." │ ← Readable preview
│                         │
│ 2h ago • 🎯 Training    │ ← Clear spacing
│                         │
│ [Continue →]            │ ← Large tap target
└─────────────────────────┘
```

**Mobile Performance Wins:**
- **Lazy loading**: Collapsed sections don't render
- **Smaller bundles**: Less JavaScript for default views
- **Faster scrolling**: Fewer DOM elements
- **Better battery**: Less rendering overhead

**Progressive Enhancement on Mobile:**
- **Tap once**: Open conversation (simple)
- **Long-press**: Show full metadata (advanced)
- **Swipe**: Quick actions (delete, archive)
- **Pull-down**: Refresh activity feed

**Result:** Mobile users get a **native app feel** with focused, touch-optimized interfaces.

---

## New Components to Build

### Phase 2.5 Additions:

**Core Components:**
1. **WhatsNewCard** - Unified overview + recent activity (NEW - replaces ActivityFeed/SubjectOverview)
2. **TopicsTree** - Collapsible hierarchical topic navigation (simplified default view)
3. **FocusSection** - Active focus areas (renamed from "Pinned Ideas")
4. **EnhancedSearchBar** - Context-aware semantic search
5. **ConversationCard** - Simplified with progressive disclosure
6. **ConversationListView** - Grouped conversation timeline

**Message Components:**
7. **MessageBubble** - Enhanced message with inline actions
8. **ContextBanner** - Contextual info about current conversation

**Output Generation:**
9. **QuickGenerateCard** - Single prominent generation action (NEW)
10. **OutputTemplateCard** - Generation option with smart recommendations
11. **RecentOutputsList** - Past generations with hover actions
12. **CustomGenerationPrompt** - Natural language output creator

**Infrastructure:**
13. **ExpandableSection** - Progressive disclosure wrapper (NEW - critical for UX)
14. **CollapsiblePanel** - Base component with expand/collapse
15. **PanelToggle** - [◁] [▶] toggle buttons
16. **ResponsiveLayout** - Breakpoint wrapper with smooth transitions
17. **TabNavigation** - Top tab bar (tablet)
18. **BottomNavigation** - Bottom tab bar (mobile)

**Total: 18 components** (3 new, 15 enhanced/renamed)

---

## ExpandableSection Component (Critical for Progressive Disclosure)

### Purpose
Wrapper component that hides advanced features by default, revealing them on demand. This is the **key pattern** for balancing daily users vs power users.

### Consistency Standards

**Standardized Text Across All Panels:**
- **Collapsed state**: "More options ▼" (consistent everywhere)
- **Expanded state**: "Show less ▲" (consistent everywhere)
- **Icon direction**: ▼ when collapsed, ▲ when expanded
- **Styling**: Same color (text-secondary), same size, same spacing

**Where Used:**
- **Explore panel**: Reveals Focus section, full topic tree, archived ideas
- **Create panel**: Reveals template library, custom generation
- **Settings panel**: Reveals advanced preferences (future)

**Why Consistency Matters:**
- Users learn the pattern once, apply everywhere
- Predictable interaction model
- Reduces cognitive load
- Professional, polished feel

### Implementation
```tsx
<ExpandableSection 
  title="More options"
  expandedTitle="Show less"
  defaultExpanded={false}
  onExpand={handleExpand}
  onCollapse={handleCollapse}
>
  {/* Advanced content here */}
  <TemplateLibrary />
  <CustomGeneration />
</ExpandableSection>
```

### Visual States

**Collapsed (Default)**:
```
│ [More options ▼]                    │ ← Simple link
```

**Expanded**:
```
│ ┌─ TEMPLATE LIBRARY ──────────────┐ │
│ │ [Content here...]                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Show less ▲]                       │ ← Toggle back
```

### Behavior
- **Smooth animation**: 300ms height transition
- **Content fade**: Opacity 0→1 with 100ms delay
- **Lazy loading**: Only load expanded content when first opened
- **Remember preference**: Store user's expansion preference
- **Auto-collapse**: Optional timeout after inactivity (30s)
- **Keyboard accessible**: Space/Enter to toggle, Escape to collapse

### Smart Defaults
- **New users**: Collapsed by default
- **Experienced users**: Expanded if used frequently (>3 times/session)
- **Context-aware**: Expand automatically if user searches for hidden feature
- **Mobile**: Always collapsed to save screen space

### Analytics Tracking
- Track expansion rate (% of users who expand)
- Track time-to-expand (how long before first expansion)
- Track usage of expanded features
- Adapt defaults based on user behavior

---

## Interactions & Animations

### Panel Transitions (300ms)
- Expand/collapse: Smooth width animation
- Tab switch: Fade out/in with slight slide
- Panel minimize: Shrink to icon-only width

### Content Animations
- New insight: Glow pulse (2s)
- Generation progress: Smooth progress bar
- Scroll: Momentum scrolling with inertia
- Hover: Subtle elevation (0→2 shadow)

### Smart Highlights
- Active topic: Border glow in Explore
- Related content: Subtle background tint
- Unread items: Bold + dot indicator
- Recommendations: Shimmer effect

---

## Accessibility

- **Keyboard navigation**: Full support for tab/arrow keys
- **Screen readers**: ARIA labels for all interactive elements
- **Focus indicators**: Visible focus rings (2px accent color)
- **Color contrast**: WCAG 2.1 AA minimum (4.5:1)
- **Reduced motion**: Respect prefers-reduced-motion
- **Touch targets**: Minimum 44x44px tap areas

---

## Performance Targets

- **Panel switch**: <100ms perceived latency
- **Search filtering**: <50ms for 1000 items
- **Scroll performance**: 60fps with virtual scrolling
- **Initial render**: <200ms for any panel
- **Animation**: 60fps (16ms frame budget)

---

This is the "juice" - the detailed component specs that make the 3-panel workspace feel polished and intelligent.

---

## Design Refinements Summary

**Recent User-Centered Improvements:**

1. **"What's New" vs "Activity Feed"**
   - Renamed ACTIVITY FEED → WHAT'S NEW
   - More user-friendly, less technical
   - Clearer intent ("see what's happening")

2. **Standardized "More Options" Pattern**
   - Consistent text across all panels
   - ▼ when collapsed, ▲ when expanded
   - Same styling, same behavior
   - Learn once, use everywhere

3. **Mobile-First Simplification**
   - Added 55-line section on mobile benefits
   - Before/after comparison with visuals
   - Performance wins documented
   - Progressive enhancement patterns

4. **Expertise Stage Celebrations**
   - Confetti animation on stage transition
   - Badge morphing (● → ◆ → ★)
   - Toast notifications
   - Feature unlock highlights
   - Optional sound effects

**Impact of Refinements:**
- ✅ More accessible language (What's New > Activity Feed)
- ✅ Consistent interaction patterns (More options)
- ✅ Mobile experience emphasized (critical for adoption)
- ✅ Gamification elements (stage transitions)

These refinements complete the evolution from **technical spec** to **user-experience-driven design system**.
