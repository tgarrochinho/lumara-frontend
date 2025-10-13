# Visual Mockups - Memory UI Design

## 🎨 Brand Alignment: "Structured Elegance"
- Dark mode theme
- Indigo-violet gradient CTAs
- Professional, clean, modern
- Minimal but powerful

---

## Design A: Focus Mode with Smart Context (RECOMMENDED)

### Desktop View (1440px)
```
┌────────────────────────────────────────────────────────────┐
│ NexusMind                              Working Memory (3/7) │ ← Subtle top bar
│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                                            │
│  Current Focus: Sleep Optimization Research               │ ← Context pill
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │                                                  │    │
│  │  You: How does exercise timing affect sleep?    │    │
│  │                                                  │    │
│  │  ┌─────────────────────────────────────┐       │    │
│  │  │ 🧠 Forming memory...                │       │    │ ← Inline formation
│  │  └─────────────────────────────────────┘       │    │
│  │                                                  │    │
│  │  AI: Based on your consolidated memories about  │    │
│  │  sleep and exercise...                          │    │
│  │                                                  │    │
│  │  ┌─ Retrieved Context ──────────┐              │    │
│  │  │ • Morning exercise (+3 uses) │              │    │ ← Shows what AI used
│  │  │ • REM cycles (strong)        │              │    │
│  │  └──────────────────────────────┘              │    │
│  │                                                  │    │
│  │  Evening exercise can disrupt sleep if done     │    │
│  │  within 3 hours of bedtime. This connects to    │    │
│  │  your earlier learning about...                 │    │
│  │                                                  │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  [Type your message...]                 [Send] [📎] [🎤]  │
│                                                            │
├────────────────────────────────────────────────────────────┤
│ 💭 Active (3)  📚 Library (247)  ✨ Synthesize  🎯 Plan  │ ← Bottom nav
└────────────────────────────────────────────────────────────┘

Color Scheme:
- Background: #0A0E1A (deep dark blue)
- Cards: #1A1F2E (slightly lighter)
- Text: #E8E9ED (off-white)
- Memory forming: Indigo glow animation
- CTAs: Indigo-violet gradient
```

### Mobile View (375px)
```
┌─────────────────┐
│ Working (3/7) 🧠│
├─────────────────┤
│ Focus: Sleep    │
├─────────────────┤
│                 │
│ You: Exercise   │
│ timing?         │
│                 │
│ [Forming...]    │
│                 │
│ AI: Evening     │
│ exercise...     │
│                 │
├─────────────────┤
│ [Message...]    │
├─────────────────┤
│ 💭 📚 ✨ 🎯    │ ← Thumb-reachable
└─────────────────┘
```

---

## Design B: Memory Overlay System

### Conversation View (Default)
```
┌────────────────────────────────────────────────────────┐
│ NexusMind                                     [👤] [⚙️] │
├────────────────────────────────────────────────────────┤
│                                                        │
│                  CLEAN CONVERSATION SPACE             │
│                                                        │
│     You: How do I improve my sleep quality?          │
│                                                        │
│     AI: Let me help you with that...                 │
│                                                        │
│     [Small memory indicator: "3 memories retrieved"]  │
│                                                        │
└────────────────────────────────────────────────────────┘

        ┌──────────────────┐
        │ 💭 Working (3)   │ ← Floating button (bottom right)
        └──────────────────┘
```

### Memory Library Overlay (Slides up from bottom)
```
┌────────────────────────────────────────────────────────┐
│                                                        │
│                  [Dimmed conversation]                │
│                                                        │
├════════════════════════════════════════════════════════┤
│ Your Memory Library                               [✕] │ ← 70% height overlay
├────────────────────────────────────────────────────────┤
│ [Timeline] [Knowledge] [Guides] [Search]              │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Today ─────────────────────────────────               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │
│  │ Sleep tips  │ │ Exercise   │ │ REM cycles │     │ ← Card grid
│  │ 💪 Strong   │ │ 🔄 Forming  │ │ 💪 Strong   │     │
│  └─────────────┘ └─────────────┘ └─────────────┘     │
│                                                        │
│  Yesterday ─────────────────────────────────           │
│  ┌─────────────┐ ┌─────────────┐                      │
│  │ Nutrition   │ │ Meditation  │                      │
│  │ 👻 Fading   │ │ ⚡ Active    │                      │
│  └─────────────┘ └─────────────┘                      │
└────────────────────────────────────────────────────────┘
```

---

## Design C: Tab-Based Mental Modes

### Mode Switcher (Top Navigation)
```
┌──────────────────────────────────────────────────────┐
│ ┌──────────┬─────────┬────────────┬──────┐         │
│ │ Converse │ Explore │ Synthesize │ Plan │         │ ← Tab style
│ └──────────┴─────────┴────────────┴──────┘         │
├──────────────────────────────────────────────────────┤

CONVERSE MODE:
│                                                      │
│  Working on: Sleep optimization                     │
│                                                      │
│  [Clean conversation interface]                     │
│                                                      │

EXPLORE MODE:
│  ┌────────────────────────────────┐                │
│  │    Memory Network Graph         │                │ ← Interactive graph
│  │         ∘                       │                │
│  │     ∘───∘───∘                  │                │
│  │         │                       │                │
│  │     ∘───∘───∘                  │                │
│  └────────────────────────────────┘                │
│                                                      │

SYNTHESIZE MODE:
│  ┌─ Generate Guide ────────────────┐               │
│  │ Topic: [Sleep Optimization    ] │               │
│  │ Based on: 23 strong memories    │               │
│  │ Confidence: ████████░░ 82%      │               │
│  │                                 │               │
│  │ [Generate Guide] ← Gradient CTA │               │
│  └─────────────────────────────────┘               │
└──────────────────────────────────────────────────────┘
```

---

## 🎨 Visual Language & Animations

### Memory States (Visual Indicators)
```
Forming:    ◌◌◌ → ●◌◌ → ●●◌ → ●●● (filling dots)
Fresh:      ✨ Sparkle effect
Strong:     💪 Bold + larger text
Active:     ⚡ Pulse glow
Fading:     👻 50% opacity
Archived:   📦 Greyed out
```

### Memory Formation Animation
```css
/* Inline memory formation */
.memory-forming {
  background: linear-gradient(
    90deg,
    rgba(99, 102, 241, 0) 0%,
    rgba(99, 102, 241, 0.3) 50%,
    rgba(139, 92, 246, 0) 100%
  );
  animation: slide-right 2s ease-out;
}

/* Consolidation flow */
.consolidating {
  animation: flow-up 1.5s ease-out;
  opacity: 0;
  transform: translateY(-20px);
}
```

### Gradient CTAs (Your Brand)
```css
.cta-primary {
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  /* Indigo → Violet gradient */
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  transition: all 0.3s ease;
}

.cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */

/* Base: Mobile (320px - 767px) */
.container {
  padding: 16px;
  single-column layout;
}

/* Tablet (768px - 1023px) */
@media (min-width: 768px) {
  .container {
    padding: 24px;
    /* Overlay system works well here */
  }
}

/* Desktop (1024px - 1439px) */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
    max-width: 900px; /* Keep conversation readable */
  }
}

/* Large Desktop (1440px+) */
@media (min-width: 1440px) {
  .container {
    padding: 40px;
    max-width: 1200px;
    /* Can show persistent memory panel if needed */
  }
}
```

---

## 🏆 Final Recommendation

**Primary Design: Focus Mode with Smart Context (Design A)**

Why this works best:
1. **Solves your sidebar problem** - No cramped panels
2. **Conversation-first** - 80% of screen for actual thinking
3. **Memory when needed** - Bottom nav for quick access
4. **Mobile-friendly** - Scales perfectly
5. **Clean aesthetic** - Matches "Structured Elegance"
6. **Progressive disclosure** - Start simple, reveal complexity

**Implementation Strategy:**
1. Week 1: Core conversation + working memory bar
2. Week 2: Memory overlay system
3. Week 3: Advanced features (synthesis, planning)

This design makes NexusMind feel like a **premium thinking tool**, not a cluttered database interface.