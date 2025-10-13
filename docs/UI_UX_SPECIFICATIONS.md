# NexusMind UI/UX Specifications

**Last Updated:** January 11, 2025

*Complete UI/UX specifications for the metacognitive AI partner, including layouts, components, interactions, and visual language.*

---

## 🎨 Design System

### Brand Identity
- **Primary Color:** Indigo-Violet gradient (#6366F1 → #8B5CF6)
- **Background:** Deep dark blue (#0A0E1A)
- **Cards:** Slightly lighter (#1A1F2E)
- **Text:** Off-white (#E8E9ED)
- **Success:** Green (#10B981)
- **Warning:** Yellow (#F59E0B)
- **Error:** Red (#EF4444)
- **Font:** Inter for UI, SF Mono for code/metrics

### Visual Principles
1. **Structured Elegance** - Clean, professional, modern
2. **Progressive Disclosure** - Complexity revealed gradually
3. **Confidence Visualization** - Progress bars everywhere
4. **Dark Mode First** - Reduces cognitive load
5. **Mobile-First Responsive** - Single column base

---

## 📱 Layout Architecture

### Adaptive Focus Design (Not 3-Column!)

#### Desktop (1440px+)
```
┌──────────────────────────────────────────┐
│ Header Bar                               │
│ NexusMind          Working Memory (3/7)  │
├──────────────────────────────────────────┤
│                                          │
│     Main Conversation Canvas (80%)       │
│                                          │
│     [Inline confidence indicators]       │
│     [Contradiction alerts]               │
│     [Memory formation animations]        │
│                                          │
├──────────────────────────────────────────┤
│ 📅 Experiences | 🧠 Knowledge | 📋 Methods│
└──────────────────────────────────────────┘
```

#### Tablet (768px-1439px)
```
┌────────────────────┐
│ Header (minimal)   │
├────────────────────┤
│                    │
│ Conversation       │
│ (full width)       │
│                    │
├────────────────────┤
│ Bottom Navigation  │
└────────────────────┘
```

#### Mobile (<768px)
```
┌──────────────┐
│ ≡ NexusMind  │
├──────────────┤
│              │
│ Conversation │
│              │
├──────────────┤
│ ◉ ◉ ◉ ◉     │
└──────────────┘
```

---

## 🧩 Core Components

### 1. Confidence Bar Component
```tsx
interface ConfidenceBarProps {
  value: number; // 0-100
  label: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

Visual:
████████░░ 78% confident
```

**States:**
- High (>70%): Green tint
- Medium (40-70%): Yellow tint
- Low (<40%): Red tint
- Animates on change

### 2. Contradiction Alert
```tsx
interface ContradictionAlertProps {
  current: string;
  previous: string;
  previousDate: Date;
  onResolve: (resolution: Resolution) => void;
}

Visual:
┌─────────────────────────────────────┐
│ ⚡ Contradiction Detected            │
│ Now: "X is true"                    │
│ Before: "X is false" (3 days ago)   │
│ [Keep both] [Replace] [Merge]       │
└─────────────────────────────────────┘
```

### 3. Memory Card
```tsx
interface MemoryCardProps {
  type: 'experience' | 'knowledge' | 'method';
  content: string;
  confidence: number;
  tested: number;
  lastAccessed: Date;
  isContradicted?: boolean;
}

Visual:
┌─────────────────────────────────┐
│ Daily Standups                  │
│ ████████░░ 78% confident        │
│ Tested: 15 times | 2 days ago   │
│ ⚠️ Has contradiction           │
└─────────────────────────────────┘
```

### 4. Evolution Timeline
```tsx
interface EvolutionTimelineProps {
  belief: string;
  changes: TimelinePoint[];
  currentConfidence: number;
}

Visual:
────●────●────●────●──→
    Jan  Feb  Mar  Apr
    30%  45%  70%  85%
```

### 5. Playbook Section
```tsx
interface PlaybookSectionProps {
  title: string;
  items: PlaybookItem[];
  confidenceThreshold: number;
}

Visual:
High Confidence (>80%)
• Item 1 ████████░░
• Item 2 █████████░
• Item 3 ████████░░
```

### 6. Working Memory Bar
```tsx
interface WorkingMemoryProps {
  items: MemoryItem[];
  capacity: number;
  onClear: () => void;
}

Visual:
Working Memory (5/7) [Clear]
• Current focus item
• Recent thought
• Active question
```

### 7. Discovery Card
```tsx
interface DiscoveryCardProps {
  type: 'pattern' | 'insight' | 'connection';
  content: string;
  confidence: number;
  sourceCount: number;
  isNew?: boolean;
}

Visual:
┌─────────────────────────────────┐
│ 💡 New Pattern Discovered       │
│ "Your X correlates with Y"      │
│ Based on: 15 experiences        │
│ Confidence: ████████░░ 82%      │
│ [Explore] [Dismiss]             │
└─────────────────────────────────┘
```

---

## 🎭 Interaction Patterns

### 1. Memory Formation Animation
```css
@keyframes memory-form {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  50% {
    opacity: 1;
    transform: translateY(-5px);
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
  }
  100% {
    opacity: 0.9;
    transform: translateY(0);
  }
}

.forming-memory {
  animation: memory-form 2s ease-out;
  border: 2px solid var(--indigo);
}
```

### 2. Confidence Change Animation
```css
.confidence-bar {
  transition: width 0.5s ease-out;
}

.confidence-change {
  animation: pulse 1s ease-out;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

### 3. Contradiction Resolution Flow
```
1. Alert slides in from top
2. Background dims slightly
3. User selects resolution
4. Alert morphs into confirmation
5. Confidence bars update
6. Success toast appears
```

### 4. Navigation Transitions
```css
.panel-transition {
  transform: translateX(100%);
  transition: transform 0.3s ease-out;
}

.panel-active {
  transform: translateX(0);
}
```

---

## 📊 Information Architecture

### Primary Navigation
```
Bottom Tab Bar (Mobile) / Top Bar (Desktop):
├── 💬 Chat (default)
├── 📅 Experiences
├── 🧠 Knowledge
├── 📋 Methods
└── 💡 Discoveries
```

### Secondary Actions
```
Floating Action Button:
├── ✨ Generate Playbook
├── 🔍 Search Knowledge
├── 📊 View Analytics
└── ⚙️ Settings
```

### Information Hierarchy
1. **Current conversation** (primary focus)
2. **Working memory** (persistent context)
3. **Confidence indicators** (always visible)
4. **Knowledge panels** (on-demand)

---

## 🎨 Visual States

### Confidence Visual Language
```
█████████░ 95% - Proven (dark green)
████████░░ 80% - Tested (green)
██████░░░░ 60% - Likely (yellow)
████░░░░░░ 40% - Uncertain (orange)
██░░░░░░░░ 20% - Speculative (red)
```

### Memory States
```
✨ New (sparkle animation)
💪 Strong (bold, larger)
⚡ Active (pulse glow)
👻 Fading (50% opacity)
📦 Archived (greyed out)
```

### Interaction States
```
Default:    Normal appearance
Hover:      Slight elevation + glow
Active:     Pressed appearance
Loading:    Skeleton animation
Disabled:   50% opacity
```

---

## 📱 Responsive Breakpoints

### Mobile First Approach
```scss
// Base: Mobile (320px - 767px)
.container {
  padding: 16px;
  max-width: 100%;
}

// Tablet (768px - 1023px)
@media (min-width: 768px) {
  .container {
    padding: 24px;
    max-width: 768px;
  }
}

// Desktop (1024px - 1439px)
@media (min-width: 1024px) {
  .container {
    padding: 32px;
    max-width: 1024px;
  }
}

// Large Desktop (1440px+)
@media (min-width: 1440px) {
  .container {
    padding: 40px;
    max-width: 1200px;
  }
}
```

---

## ⚡ Micro-interactions

### 1. Confidence Score Updates
- Number counts up/down
- Bar animates to new width
- Brief glow effect
- Subtle sound (optional)

### 2. Memory Formation
- Text briefly highlights
- Particle effect flows upward
- "Captured" toast appears
- Working memory count updates

### 3. Contradiction Detection
- Screen briefly flashes yellow
- Alert slides in with spring physics
- Background subtly dims
- Attention sound plays

### 4. Playbook Generation
- Progress bar fills
- Sections fade in sequentially
- Completion celebration
- Download/share options appear

---

## 🌐 Accessibility

### WCAG 2.1 AA Compliance
- **Color contrast:** Minimum 4.5:1 for text
- **Focus indicators:** Visible keyboard navigation
- **Screen readers:** Semantic HTML + ARIA labels
- **Keyboard navigation:** All features keyboard accessible
- **Motion preferences:** Respect prefers-reduced-motion

### Semantic Structure
```html
<main role="main">
  <section aria-label="Conversation">
    <article role="article">
      <header>Working Memory</header>
      <div role="log" aria-live="polite">
        <!-- Chat messages -->
      </div>
    </article>
  </section>

  <nav role="navigation" aria-label="Main">
    <!-- Bottom navigation -->
  </nav>
</main>
```

---

## 🎯 Performance Guidelines

### Target Metrics
- **First Paint:** < 1.5s
- **Interactive:** < 3s
- **Animation:** 60fps
- **Bundle size:** < 200KB initial

### Optimization Strategies
1. **Lazy load panels** - Load knowledge views on demand
2. **Virtual scrolling** - For long memory lists
3. **Debounced search** - 300ms delay
4. **Optimistic updates** - Update UI before server confirms
5. **Progressive disclosure** - Load details when expanded

---

## 🎨 Empty States

### No Memories Yet
```
┌────────────────────────────────┐
│                                │
│        🧠                      │
│                                │
│   Start Building Knowledge     │
│                                │
│ Share your first thought about │
│ something you want to improve  │
│                                │
│ [Begin Conversation]           │
│                                │
└────────────────────────────────┘
```

### No Contradictions
```
Your knowledge is consistent!
No contradictions found yet.
As you add more, we'll detect conflicts.
```

### No Discoveries Yet
```
Patterns emerge with more data.
Keep adding experiences and we'll
find insights you might miss.
```

---

## ✨ Delight Moments

### Achievement Celebrations
- First contradiction resolved ✨
- 10 memories created 🎉
- First playbook generated 📚
- 100 experiences logged 🏆
- First pattern discovered 💡

### Subtle Delights
- Smooth spring animations
- Thoughtful micro-copy
- Smart defaults
- Helpful empty states
- Encouraging progress indicators

---

## 📐 Component Library Structure

```
/components
  /core
    - ConfidenceBar.tsx
    - ContradictionAlert.tsx
    - MemoryCard.tsx
    - Button.tsx
    - Input.tsx

  /memory
    - WorkingMemoryBar.tsx
    - MemoryFormation.tsx
    - EvolutionTimeline.tsx

  /knowledge
    - KnowledgeCard.tsx
    - DiscoveryCard.tsx
    - PlaybookSection.tsx

  /layout
    - AdaptiveLayout.tsx
    - NavigationBar.tsx
    - Panel.tsx

  /animations
    - MemoryAnimation.tsx
    - ConfidenceAnimation.tsx
    - TransitionWrapper.tsx
```

---

## 🚀 Implementation Priority

### Phase 1: Core UI (Week 1)
1. Adaptive layout structure
2. Conversation interface
3. Confidence bars
4. Basic navigation

### Phase 2: Memory Features (Week 2)
1. Working memory bar
2. Memory cards
3. Contradiction alerts
4. Formation animations

### Phase 3: Knowledge Views (Week 3)
1. Knowledge panels
2. Evolution timeline
3. Discovery cards
4. Playbook generation

### Phase 4: Polish (Week 4)
1. Micro-interactions
2. Empty states
3. Celebrations
4. Accessibility audit

---

This specification provides a complete blueprint for implementing NexusMind's UI/UX with a focus on confidence visualization, contradiction management, and elegant information architecture.