# Lumara Chat UI - Visual Examples & Flows

**Created:** 2025-10-18
**Status:** Visual Design Reference
**Purpose:** Detailed screen examples and user flows for the chat-first interface

*This document provides visual examples of every screen state, user flow, and interaction pattern in Lumara's chat interface.*

---

## 📱 Complete Screen Examples

### 1. Empty State - First Visit

```
┌─────────────────────────────────────────────────────────────────┐
│                       Deep Purple Gradient                       │
│                    (#1a0f2e → #2d1b69)                          │
│                                                                   │
│                                                                   │
│                           🌱                                      │
│                    [breathing animation]                         │
│                    scale(0.95) ↔ scale(1.05)                    │
│                                                                   │
│                    Your garden awaits                            │
│                   [text-2xl, font-medium]                        │
│                   [opacity: 0.9, white]                          │
│                                                                   │
│              Plant your first thought and                        │
│                watch understanding grow                          │
│                   [text-base, opacity: 0.6]                      │
│                                                                   │
│                                                                   │
│        ┌─────────────────────────────────────────────┐          │
│        │  Share a thought, ask a question...         │          │
│        │  [glassmorphic input, subtle glow pulse]    │          │
│        └─────────────────────────────────────────────┘          │
│                                                                   │
│                                                                   │
│                    [Subtle particle effects]                     │
│                   [Floating gently upward]                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

DESIGN NOTES:
- Background: Radial gradient from center
- Seed emoji: CSS animation, 4s ease-in-out infinite
- Input: Glass morphism with rgba(255,255,255,0.03)
- Particles: 20-30 small dots, slow upward drift
- Zero cognitive load - just invitation
```

### 2. First Message Sent - Thinking Animation

```
┌─────────────────────────────────────────────────────────────────┐
│ [4px heatmap bar - just appeared] ════                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                                                                   │
│  You                                            10:32 AM         │
│  ┌─────────────────────────────────────────┐                    │
│  │ I prefer morning meetings for deep work │                    │
│  │                                          │                    │
│  │ [Indigo gradient background]            │                    │
│  │ [rgba(99,102,241,0.1) → rgba(139,92,246,0.1)]               │
│  └─────────────────────────────────────────┘                    │
│                                                                   │
│  Lumara                                         10:32 AM         │
│  ┌─────────────────────────────────────────────────────┐        │
│  │ 💭 Thinking...                                      │        │
│  │ │                                                    │        │
│  │ ├─ 🔍 Creating your first memory...                │        │
│  │ │   [Fade in, slide from left]                     │        │
│  │ │   [opacity animating 0.5 → 1]                    │        │
│  │ │                                                    │        │
│  │ ├─ ✨ Setting initial confidence...                │        │
│  │ │   [Just fading in]                               │        │
│  │ │   [opacity: 0.5]                                 │        │
│  │ │                                                    │        │
│  │ └─ 🌱 Memory planted!                              │        │
│  │     [Pending, opacity: 0.3]                        │        │
│  │                                                      │        │
│  │ [Blue glow on left border]                         │        │
│  │ [Glassmorphic background]                          │        │
│  └─────────────────────────────────────────────────────┘        │
│                                                                   │
│                                                                   │
│  ┌───────────────────────────────────────────────────┐          │
│  │  [Input disabled, shimmer effect]                 │          │
│  └───────────────────────────────────────────────────┘          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

ANIMATION SEQUENCE:
0ms: User message appears (fade in from bottom)
300ms: Thinking header appears
500ms: First step fades in + slides left
700ms: Second step starts appearing
900ms: Third step starts appearing
1200ms: Completion (all steps solid)
```

### 3. First Memory Created - Success State

```
┌─────────────────────────────────────────────────────────────────┐
│ [═══] Memory Activity · 1 memory                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  You                                            10:32 AM         │
│  ┌─────────────────────────────────────────┐                    │
│  │ I prefer morning meetings for deep work │                    │
│  └─────────────────────────────────────────┘                    │
│                                                                   │
│  Lumara                                         10:32 AM         │
│  ┌───────────────────────────────────────────────────────┐      │
│  │ I've captured that preference! You prefer morning     │      │
│  │ meetings for deep work. This is your first memory,   │      │
│  │ so I've set an initial confidence of 60% - it will   │      │
│  │ grow stronger as you validate it through experience. │      │
│  │                                                        │      │
│  │ ┌─────────────────────────────────────────────────┐  │      │
│  │ │ 🌱 Semantic Memory                              │  │      │
│  │ │                                                  │  │      │
│  │ │ Morning meetings are better for deep work       │  │      │
│  │ │                                                  │  │      │
│  │ │ Confidence: ██████░░░░ 60%                      │  │      │
│  │ │ [Yellow glow effect]                            │  │      │
│  │ │                                                  │  │      │
│  │ │ Created: Just now                               │  │      │
│  │ │                                                  │  │      │
│  │ │ [Gentle pulse on card border]                   │  │      │
│  │ │ [Green gradient background rgba(16,185,129,0.05)]│  │      │
│  │ │ [First memory celebration particles!]           │  │      │
│  │ └─────────────────────────────────────────────────┘  │      │
│  │                                                        │      │
│  └───────────────────────────────────────────────────────┘      │
│                                                                   │
│  💡 Tip: Type "+" to strengthen this belief, or "?" to         │
│      test it later                                              │
│  [Fade in after 2s, auto-dismiss after 5s]                     │
│                                                                   │
│  ┌───────────────────────────────────────────────────┐          │
│  │  Share another thought...                         │          │
│  │  [Re-enabled, gentle glow]                        │          │
│  └───────────────────────────────────────────────────┘          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

CELEBRATION DETAILS:
- Card scales in: 0 → 1.1 → 1 (500ms)
- Particles burst from center (10-15 particles)
- Particles float up and fade (2s duration)
- Confidence bar fills smoothly (1s delay, 800ms duration)
- Tip appears with slide-up animation
```

### 4. Contradiction Detected - Aurora Effect

```
┌─────────────────────────────────────────────────────────────────┐
│ [════════] Memory Activity · 12 memories · 1 conflict          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  March 15, 2025 · ✓ 3 memories                                  │
│  ────────────────────────────────────────────                   │
│                                                                   │
│  You                                            2:45 PM          │
│  ┌─────────────────────────────────────────┐                    │
│  │ Actually, afternoon meetings work        │                    │
│  │ better for team collaboration            │                    │
│  └─────────────────────────────────────────┘                    │
│                                                                   │
│  Lumara                                         2:45 PM          │
│  ┌───────────────────────────────────────────────────────┐      │
│  │ ⚡ Interesting! I found a contradiction:              │      │
│  │                                                        │      │
│  │ ┌──────────────────────────────────────────────────┐ │      │
│  │ │ [AURORA GRADIENT BORDER - FLOWING ANIMATION]     │ │      │
│  │ │ ╔════════════════════════════════════════════╗   │ │      │
│  │ │ ║  Your Earlier Belief (Jan 15)              ║   │ │      │
│  │ │ ║  "Morning meetings better for deep work"   ║   │ │      │
│  │ │ ║  Confidence: ████████░░ 75%                ║   │ │      │
│  │ │ ╚════════════════════════════════════════════╝   │ │      │
│  │ │                     ⇅                            │ │      │
│  │ │                [Flowing aurora particles]        │ │      │
│  │ │                [Green→Blue→Purple→Pink]          │ │      │
│  │ │                     ⇅                            │ │      │
│  │ │ ╔════════════════════════════════════════════╗   │ │      │
│  │ │ ║  New Observation (Today)                   ║   │ │      │
│  │ │ ║  "Afternoon meetings better for            ║   │ │      │
│  │ │ ║   team collaboration"                      ║   │ │      │
│  │ │ ║  Context: Different type of meeting        ║   │ │      │
│  │ │ ╚════════════════════════════════════════════╝   │ │      │
│  │ │                                                  │ │      │
│  │ │ [Aurora glow effect around entire card]         │ │      │
│  │ │ [Gradient animates: 0% → 100% in 8s loop]       │ │      │
│  │ └──────────────────────────────────────────────────┘ │      │
│  │                                                        │      │
│  │ These aren't contradictions - they're different       │      │
│  │ contexts! Would you like me to split this into:       │      │
│  │                                                        │      │
│  │ [Morning: Deep work] [Afternoon: Collaboration]       │      │
│  │ [Keep both]          [One is wrong]                   │      │
│  └───────────────────────────────────────────────────────┘      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

AURORA ANIMATION:
- Border: 2px flowing gradient (300% background size)
- Colors: #86efac → #93c5fd → #c084fc → #f0abfc → loop
- Particles: Float between cards with trail effects
- Glow: Soft shadow pulsing rgba(192,132,252,0.3)
- Duration: 8s ease infinite
```

### 5. Evolution Timeline Widget

```
┌─────────────────────────────────────────────────────────────────┐
│ [═════════] Memory Activity · 47 memories                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  You                                            4:20 PM          │
│  ┌─────────────────────────────────────────┐                    │
│  │ How has my standup view evolved?        │                    │
│  └─────────────────────────────────────────┘                    │
│                                                                   │
│  Lumara                                         4:20 PM          │
│  ┌───────────────────────────────────────────────────────┐      │
│  │ Your understanding has shifted significantly:          │      │
│  │                                                        │      │
│  │ ┌──────────────────────────────────────────────────┐ │      │
│  │ │ Evolution: Daily Standups  ┃  Jan → May 2025    │ │      │
│  │ ├──────────────────────────────────────────────────┤ │      │
│  │ │ 100% │                              ●            │ │      │
│  │ │      │                            ╱              │ │      │
│  │ │  85% │      ●──────●──────●─────●               │ │      │
│  │ │      │    ╱                                     │ │      │
│  │ │  70% │   ●                                      │ │      │
│  │ │      │ ╱                                        │ │      │
│  │ │  50% │●                                         │ │      │
│  │ │      │                                          │ │      │
│  │ │  30% │                            ●────●        │ │      │
│  │ │      │                          ╱              │ │      │
│  │ │   0% └────┬────┬────┬────┬────┬────┬────      │ │      │
│  │ │         Jan  Feb  Mar  Apr  May  Jun  Jul     │ │      │
│  │ │                                                │ │      │
│  │ │ [Path draws in over 2s with animated line]   │ │      │
│  │ │ [Nodes pulse on hover with details]          │ │      │
│  │ │                                                │ │      │
│  │ │ Key Transitions:                              │ │      │
│  │ │ Jan 15: "Standups essential" (40% conf)       │ │      │
│  │ │ Feb 20: Team grew to 7 (+25% conf)           │ │      │
│  │ │ Apr 10: Team hit 12 people (-40% conf!)      │ │      │
│  │ │ May 5: Switched to async (+15% conf)         │ │      │
│  │ │                                                │ │      │
│  │ │ [Gradient background: purple fade]            │ │      │
│  │ │ [Interactive: click node → jump to source]   │ │      │
│  │ └──────────────────────────────────────────────────┘ │      │
│  │                                                        │      │
│  │ Your beliefs are context-dependent - they adapt!      │      │
│  └───────────────────────────────────────────────────────┘      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

SVG PATH ANIMATION:
- Path: stroke-dasharray with animated offset
- Draw duration: 2000ms cubic-bezier
- Nodes: Appear sequentially after path
- Gradient: confidence-based (red→yellow→green)
- Hover: Node scale 1 → 1.3, show tooltip
```

### 6. Team Perspective Widget

```
┌─────────────────────────────────────────────────────────────────┐
│  Lumara                                         11:15 AM         │
│  ┌───────────────────────────────────────────────────────┐      │
│  │ Your team has mixed feelings about this:              │      │
│  │                                                        │      │
│  │ ┌──────────────────────────────────────────────────┐ │      │
│  │ │ Team Perspective: GraphQL Migration              │ │      │
│  │ ├──────────────────────────────────────────────────┤ │      │
│  │ │                                                  │ │      │
│  │ │ 👤 You        ████████████████████░ 95%         │ │      │
│  │ │               "Solves all our problems"          │ │      │
│  │ │               [Avatar with green border]         │ │      │
│  │ │                                                  │ │      │
│  │ │ 👤 Sarah      ████████████████░░░░ 80%          │ │      │
│  │ │               "Worth trying"                     │ │      │
│  │ │               [Avatar with yellow border]        │ │      │
│  │ │                                                  │ │      │
│  │ │ 👤 Mike       ████████░░░░░░░░░░░ 40%          │ │      │
│  │ │               "Too complex for gains"            │ │      │
│  │ │               [Avatar with orange border]        │ │      │
│  │ │               [Pulse indicator - divergent!]     │ │      │
│  │ │                                                  │ │      │
│  │ │ 👤 Team       ████████████░░░░░░░ 72%          │ │      │
│  │ │   Average     [Consensus indicator]              │ │      │
│  │ │                                                  │ │      │
│  │ │ ⚠️ Key Divergence:                              │ │      │
│  │ │ Mike raised scaling concerns you haven't        │ │      │
│  │ │ considered. [View his reasoning]                │ │      │
│  │ │                                                  │ │      │
│  │ │ [Bars fill with stagger: 100ms between each]    │ │      │
│  │ │ [Gradient: confidence-based colors]             │ │      │
│  │ └──────────────────────────────────────────────────┘ │      │
│  │                                                        │      │
│  │ Would you like to discuss with Mike before deciding? │      │
│  │ [Schedule call] [See his full perspective]           │      │
│  └───────────────────────────────────────────────────────┘      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌊 Complete User Flows

### Flow 1: First-Time User Onboarding (0-5 minutes)

```
┌─────────────────────────────────────────────────────────────────┐
│                         STEP 1: ARRIVAL                          │
│                      (0 seconds - First view)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                           🌱                                      │
│                    [gentle breathing]                            │
│                                                                   │
│                    Your garden awaits                            │
│                                                                   │
│              Plant your first thought and                        │
│                watch understanding grow                          │
│                                                                   │
│                                                                   │
│        ┌─────────────────────────────────────────────┐          │
│        │  Share a thought, ask a question...         │          │
│        │  [cursor blinking, subtle glow pulse]       │          │
│        └─────────────────────────────────────────────┘          │
│                                                                   │
│  USER ACTION: Reads, absorbs simplicity, feels invited          │
│  EMOTIONAL STATE: Calm, curious, ready                           │
│  NEXT: User starts typing                                        │
└─────────────────────────────────────────────────────────────────┘

               ↓ User types "I like coding in TypeScript"

┌─────────────────────────────────────────────────────────────────┐
│                       STEP 2: FIRST INPUT                        │
│                     (5-15 seconds - Typing)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│        ┌─────────────────────────────────────────────┐          │
│        │  I like coding in TypeScript█              │          │
│        │                                             │          │
│        │  [Border glowing blue from focus]           │          │
│        │  [Aurora shimmer on border]                 │          │
│        └─────────────────────────────────────────────┘          │
│                                                                   │
│  USER FEELING: Input feels responsive and alive                 │
│  TECHNICAL: Focus state triggered, aurora animation started     │
│  NEXT: User presses Enter                                        │
└─────────────────────────────────────────────────────────────────┘

               ↓ User presses Enter

┌─────────────────────────────────────────────────────────────────┐
│                    STEP 3: FIRST RESPONSE                        │
│                   (15-20 seconds - Thinking)                     │
├─────────────────────────────────────────────────────────────────┤
│  You                                            10:32 AM         │
│  ┌─────────────────────────────────────────┐                    │
│  │ I like coding in TypeScript             │                    │
│  │ [Fade in from bottom, 300ms]            │                    │
│  └─────────────────────────────────────────┘                    │
│                                                                   │
│  Lumara                                         10:32 AM         │
│  ┌───────────────────────────────────────────────────────┐      │
│  │ 💭 Thinking...                                        │      │
│  │ │                                                      │      │
│  │ ├─ 🔍 Creating your first memory...                  │      │
│  │ │   [Slides in from left, 200ms delay]               │      │
│  │ │                                                      │      │
│  │ ├─ ✨ Setting initial confidence...                  │      │
│  │ │   [Slides in, 200ms after previous]                │      │
│  │ │                                                      │      │
│  │ └─ 🌱 Memory planted!                                │      │
│  │     [Slides in, 200ms after previous]                │      │
│  └───────────────────────────────────────────────────────┘      │
│                                                                   │
│  USER FEELING: "Whoa, I can see it thinking!"                   │
│  EMOTIONAL PEAK: Anticipation building                           │
│  AHA MOMENT #1: "This AI shows its work"                        │
│  NEXT: Response appears                                          │
└─────────────────────────────────────────────────────────────────┘

               ↓ 1.5 seconds total thinking time

┌─────────────────────────────────────────────────────────────────┐
│                   STEP 4: FIRST MEMORY CARD                      │
│                  (20-30 seconds - Celebration)                   │
├─────────────────────────────────────────────────────────────────┤
│  Lumara                                         10:32 AM         │
│  ┌───────────────────────────────────────────────────────┐      │
│  │ I've captured your first thought! 🎉                  │      │
│  │                                                        │      │
│  │ ┌─────────────────────────────────────────────────┐  │      │
│  │ │ 🌱 Preference (Semantic Memory)                 │  │      │
│  │ │                                                  │  │      │
│  │ │ TypeScript for coding                           │  │      │
│  │ │                                                  │  │      │
│  │ │ Confidence: ██████░░░░ 60%                      │  │      │
│  │ │ [Bar fills over 800ms]                          │  │      │
│  │ │ [Yellow glow pulses]                            │  │      │
│  │ │                                                  │  │      │
│  │ │ Created: Just now                               │  │      │
│  │ │                                                  │  │      │
│  │ │ [Particles burst from center!]                  │  │      │
│  │ │ [Card scales: 0→1.1→1 over 500ms]              │  │      │
│  │ │ ["First memory" special glow]                   │  │      │
│  │ └─────────────────────────────────────────────────┘  │      │
│  │                                                        │      │
│  │ This will grow stronger as you validate it through    │      │
│  │ experience.                                            │      │
│  └───────────────────────────────────────────────────────┘      │
│                                                                   │
│  💡 Try typing "?" to add a test, or keep sharing thoughts      │
│  [Appears with slide-up, 2s delay]                              │
│                                                                   │
│  AHA MOMENT #2: "It remembers AND shows confidence"             │
│  EMOTIONAL STATE: Delighted, understood                          │
│  HOOK SET: User wants to see more                               │
│  NEXT: User continues conversation                               │
└─────────────────────────────────────────────────────────────────┘

ONBOARDING COMPLETE - User is hooked in < 30 seconds
```

### Flow 2: Contradiction Discovery (Mature User)

```
CONTEXT: User has 50+ memories, using for 2 weeks

┌─────────────────────────────────────────────────────────────────┐
│                    TRIGGER: Contradicting Input                  │
├─────────────────────────────────────────────────────────────────┤
│  You                                            2:45 PM          │
│  ┌─────────────────────────────────────────┐                    │
│  │ JavaScript is actually better for       │                    │
│  │ quick prototypes                         │                    │
│  └─────────────────────────────────────────┘                    │
│                                                                   │
│  [System detects: Contradicts "TypeScript for coding" memory]   │
│  [Aurora effect begins]                                          │
└─────────────────────────────────────────────────────────────────┘

               ↓ AI processing (2 seconds)

┌─────────────────────────────────────────────────────────────────┐
│                    AURORA CONTRADICTION REVEAL                   │
├─────────────────────────────────────────────────────────────────┤
│  Lumara                                         2:45 PM          │
│  ┌───────────────────────────────────────────────────────┐      │
│  │ ⚡ Interesting evolution!                              │      │
│  │                                                        │      │
│  │ ┌──────────────────────────────────────────────────┐ │      │
│  │ │ ╔═══════════════[AURORA BORDER]══════════════╗   │ │      │
│  │ │ ║                                             ║   │ │      │
│  │ │ ║  2 weeks ago:                              ║   │ │      │
│  │ │ ║  "TypeScript for coding"                   ║   │ │      │
│  │ │ ║  Confidence: ████████░░ 80%                ║   │ │      │
│  │ │ ║  Context: General preference               ║   │ │      │
│  │ │ ╚═════════════════════════════════════════════╝   │ │      │
│  │ │              ↕                                    │ │      │
│  │ │    [Aurora particles flowing]                    │ │      │
│  │ │    [Green→Blue→Purple→Pink]                      │ │      │
│  │ │              ↕                                    │ │      │
│  │ │ ╔═════════════════════════════════════════════╗   │ │      │
│  │ │ ║  Today:                                     ║   │ │      │
│  │ │ ║  "JavaScript better for quick prototypes"  ║   │ │      │
│  │ │ ║  Context: Speed matters                     ║   │ │      │
│  │ │ ╚═════════════════════════════════════════════╝   │ │      │
│  │ │                                                  │ │      │
│  │ │ [Aurora flows continuously, 8s loop]            │ │      │
│  │ └──────────────────────────────────────────────────┘ │      │
│  │                                                        │      │
│  │ This isn't a contradiction - it's nuance! Your        │      │
│  │ understanding has matured from "TypeScript always"    │      │
│  │ to "right tool for the job."                          │      │
│  │                                                        │      │
│  │ Should I update to:                                    │      │
│  │ • TypeScript: Production code (80% conf)              │      │
│  │ • JavaScript: Quick prototypes (65% conf)             │      │
│  │                                                        │      │
│  │ [Merge nuances] [Keep separate] [One is wrong]       │      │
│  └───────────────────────────────────────────────────────┘      │
│                                                                   │
│  AHA MOMENT #3: "Contradictions can be beautiful insights"      │
│  EMOTIONAL STATE: Impressed, validated                           │
│  KEY LEARNING: Understanding evolves                             │
└─────────────────────────────────────────────────────────────────┘
```

### Flow 3: Quick Capture Workflow

```
SCENARIO: Power user wants to quickly log something

┌─────────────────────────────────────────────────────────────────┐
│                     QUICK CAPTURE: START                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────┐          │
│  │  !coffee Makes me anxious after 2pm█             │          │
│  │                                                    │          │
│  │  [! detected → Lightning icon appears]            │          │
│  │  [Border turns orange/red]                        │          │
│  │  [Placeholder: "Describe the contradiction..."]   │          │
│  └───────────────────────────────────────────────────┘          │
│                                                                   │
│  ⚡ Contradiction mode active                                    │
│  [Indicator above input, subtle pulse]                          │
└─────────────────────────────────────────────────────────────────┘

               ↓ User presses Enter

┌─────────────────────────────────────────────────────────────────┐
│                    QUICK CAPTURE: PROCESSING                     │
├─────────────────────────────────────────────────────────────────┤
│  You                                            4:30 PM          │
│  ┌─────────────────────────────────────────┐                    │
│  │ ⚡ coffee Makes me anxious after 2pm    │                    │
│  │ [Lightning badge shown]                  │                    │
│  └─────────────────────────────────────────┘                    │
│                                                                   │
│  [Toast notification appears - top right]                        │
│  ┌────────────────────────────────────┐                         │
│  │ ⚡ Contradiction captured           │                         │
│  │                                     │                         │
│  │ Previous: "Coffee helps focus"     │                         │
│  │ New: "Anxious after 2pm"           │                         │
│  │                                     │                         │
│  │ [Resolve now] [Later] [✓]          │                         │
│  └────────────────────────────────────┘                         │
│  [Auto-dismiss in 8s or user clicks]                            │
│                                                                   │
│  NO INTERRUPTION: Back to chat immediately                       │
│  CAPTURED: Queued for next conversation                          │
└─────────────────────────────────────────────────────────────────┘

OTHER QUICK CAPTURE MODES:

+ Strengthen:   "+typescript Works great for large codebases"
                [Green indicator, confidence boost queued]

- Weaken:       "-standups Taking too long lately"
                [Orange indicator, confidence reduction queued]

? Test:         "?tdd Does it really save time?"
                [Blue indicator, adds to test queue]

@ Evidence:     "@microservices https://article.com"
                [Purple indicator, attaches to related memory]

# Tag:          "#insight Sleep affects my code quality"
                [Yellow indicator, tags for later review]

~ Maybe:        "~golang Might be worth learning"
                [Gray indicator, low confidence capture]
```

---

## 📱 Mobile vs Desktop Layouts

### Mobile (375px width)

```
┌─────────────────────────────┐
│ [═══] 47 memories           │ ← Minimal heatmap (4px)
├─────────────────────────────┤
│                             │
│                             │
│ You        10:32 AM         │
│ ┌─────────────────────────┐ │
│ │ How's my understanding  │ │
│ │ evolved?                │ │
│ │                         │ │
│ │ [70% width, right side] │ │
│ └─────────────────────────┘ │
│                             │
│ Lumara     10:32 AM         │
│ ┌───────────────────────┐   │
│ │ It's evolved!         │   │
│ │                       │   │
│ │ [Widget: Full width]  │   │
│ │ [No left/right margin]│   │
│ │ [Simplified for mobile]│  │
│ │                       │   │
│ │ [Swipe for details→]  │   │
│ └───────────────────────┘   │
│                             │
│                             │
│                             │
│                             │
│                             │
│                             │
│                             │
├─────────────────────────────┤
│ [Gradient fade to blur]     │ ← Sticky input area
│ ┌─────────────────────────┐ │
│ │ Ask or share...  [↑]   │ │
│ └─────────────────────────┘ │
│                             │
└─────────────────────────────┘

MOBILE OPTIMIZATIONS:
- Input always accessible (sticky)
- Widgets simplify (hide complexity)
- Swipe gestures for navigation
- Larger tap targets (44px min)
- No hover states
- Touch-optimized spacing
```

### Desktop (1440px width)

```
┌─────────────────────────────────────────────────────────────────┐
│ [════════════════] Memory Activity · 47 memories · 2 pending   │ ← Full heatmap
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                                                                   │
│  March 15, 2025 · 3 memories                                     │
│  ──────────────────────────────────────────                      │
│                                                                   │
│  You                                            10:32 AM         │
│                           ┌─────────────────────────────┐        │
│                           │ How has my understanding    │        │
│                           │ of TypeScript evolved?      │        │
│                           │                             │        │
│                           │ [40% width max]             │        │
│                           │ [Right-aligned]             │        │
│                           └─────────────────────────────┘        │
│                                                                   │
│  Lumara                                         10:32 AM         │
│  ┌─────────────────────────────────────────────────────┐        │
│  │ Your understanding matured significantly:            │        │
│  │                                                      │        │
│  │ ┌──────────────────────────────────────────────┐   │        │
│  │ │ [FULL EVOLUTION TIMELINE]                    │   │        │
│  │ │ [Rich interactions on hover]                 │   │        │
│  │ │ [Detailed tooltips]                          │   │        │
│  │ │ [Click nodes → jump to source]              │   │        │
│  │ │                                              │   │        │
│  │ │ [50% width max]                              │   │        │
│  │ │ [Left-aligned]                               │   │        │
│  │ └──────────────────────────────────────────────┘   │        │
│  └─────────────────────────────────────────────────────┘        │
│                                                                   │
│                                                                   │
│                                                                   │
│  ┌───────────────────────────────────────────────────┐          │
│  │  Ask or share...                          [Send]  │          │ ← Standard input
│  └───────────────────────────────────────────────────┘          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                                                                  ↑
                                                          Smart scrollbar
                                                          with milestones
```

---

## 🎬 Animation Sequences

### Sequence 1: Message Send Flow

```
FRAME 1 (0ms):
Input field focused, user typing
Border: Aurora glow active
Text: "I learned React hooks today"

FRAME 2 (100ms):
User hits Enter
Input: Shimmer effect starts
Submit button: Rotates to loading spinner

FRAME 3 (200ms):
User message appears
Animation: Fade in from bottom + slight slide up
Opacity: 0 → 1 over 300ms
Transform: translateY(20px) → translateY(0)

FRAME 4 (500ms):
AI thinking bubble appears
Animation: Fade in + scale
Opacity: 0 → 1
Scale: 0.95 → 1

FRAME 5 (700ms):
First thinking step appears
Animation: Slide from left + fade
Transform: translateX(-10px) → translateX(0)
Opacity: 0.5 → 1

FRAME 6 (900ms):
Second thinking step appears
[Same animation, 200ms delay]

FRAME 7 (1100ms):
Third thinking step appears
[Same animation, 200ms delay]

FRAME 8 (1500ms):
All steps complete
Each step icon: Subtle bounce
Confidence: 100% indicators

FRAME 9 (1800ms):
Response starts appearing
Thinking bubble: Fade out
Response text: Type-in effect (optional) or fade in

FRAME 10 (2000ms):
Memory card appears
Animation: Scale + particle burst
Scale: 0 → 1.1 → 1 over 500ms
Particles: 15 dots bursting outward
Confidence bar: Fills smoothly over 800ms

TOTAL DURATION: ~2.5 seconds
FEELING: Magical but not slow
```

### Sequence 2: Aurora Contradiction Effect

```
TRIGGER: Contradiction detected

FRAME 1 (0ms):
Normal message flow
AI response appearing

FRAME 2 (200ms):
Aurora border starts
Initial state: All green (#86efac)
Border: 2px solid

FRAME 3 (300ms):
Gradient animation begins
Background-position: 0% → 100%
Duration: 8s ease infinite
Colors: Green → Blue → Purple → Pink → loop

FRAME 4 (500ms):
First particle appears
Position: Center between cards
Color: Blue (#93c5fd)
Size: 3px
Velocity: Upward + slight random X

FRAME 5 (600ms - ongoing):
Particles spawn continuously
Rate: 5 per second
Lifespan: 2-3 seconds
Trail effect: Fade + shrink

FRAME 6 (1000ms):
Glow effect pulses
Box-shadow intensity: 0.2 → 0.4 → 0.2
Duration: 2s ease-in-out infinite
Color: Aurora purple rgba(192,132,252)

FRAME 7 (8000ms):
Gradient completes first loop
Seamlessly continues
User can interrupt anytime

STEADY STATE:
- Gradient flows continuously
- Particles spawn and fade
- Glow pulses gently
- User can interact with cards
- Click anywhere to resolve

USER FEELING: Mesmerized, not distracted
```

---

## 🎨 State Variations

### Memory Card States

```
STATE 1: DEFAULT (STABLE)
┌─────────────────────────────────────┐
│ 🌱 Preference                       │
│                                      │
│ TypeScript for coding                │
│                                      │
│ Confidence: ██████░░░░ 60%          │
│ [Steady yellow glow]                 │
│                                      │
│ Last updated: 2 days ago             │
└─────────────────────────────────────┘

STATE 2: HOVER (INTERACTIVE)
┌─────────────────────────────────────┐
│ 🌱 Preference            [↗ View]   │
│                                      │
│ TypeScript for coding                │
│                                      │
│ Confidence: ██████░░░░ 60%          │
│ [Intensified glow]                   │
│ [Lift effect: translateY(-2px)]     │
│ [Shadow deepens]                     │
│                                      │
│ Last updated: 2 days ago             │
│ Click to see full history →         │
└─────────────────────────────────────┘

STATE 3: JUST UPDATED (ANIMATED)
┌─────────────────────────────────────┐
│ 🌱 Preference            [Updated!] │
│                                      │
│ TypeScript for coding                │
│                                      │
│ Confidence: ████████░░ 75% ✨       │
│ [Pulsing bright glow]                │
│ [+15% animation playing]             │
│ [Particle burst effect]              │
│                                      │
│ Just now · +15% confidence           │
└─────────────────────────────────────┘

STATE 4: HAS CONTRADICTION (ALERT)
┌─────────────────────────────────────┐
│ 🌱 Preference            ⚡ 1       │
│ [Aurora border pulsing]              │
│                                      │
│ TypeScript for coding                │
│                                      │
│ Confidence: ██████░░░░ 60%          │
│ [Orange warning glow]                │
│                                      │
│ Contradicts: "JS for prototypes"    │
│ [Resolve] [Review]                   │
└─────────────────────────────────────┘

STATE 5: LOW CONFIDENCE (WEAK)
┌─────────────────────────────────────┐
│ 🌱 Preference            [Test?]    │
│                                      │
│ TypeScript for coding                │
│                                      │
│ Confidence: ███░░░░░░░ 25%          │
│ [Dim gray, barely glowing]           │
│ [Dashed border]                      │
│                                      │
│ Needs validation · 30 days old      │
└─────────────────────────────────────┘
```

---

## 💡 Key Takeaways for Implementation

### Visual Hierarchy (Most Important First)
1. **Input field** - Must be perfect, always accessible
2. **Thinking animation** - Creates magic and trust
3. **Memory cards** - Core value visualization
4. **Aurora effects** - Memorable moments
5. **Widgets** - Rich but optional enhancements

### Animation Principles
- **Purpose**: Every animation communicates state
- **Duration**: 200-500ms for most transitions
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1) for smoothness
- **Performance**: 60fps mandatory, use transform/opacity
- **Respect**: Honor prefers-reduced-motion

### Mobile-First Approach
- Touch targets: 44px minimum
- Sticky input: Always reachable
- Simplified widgets: Less is more
- Gestures: Swipe for actions
- Performance: Aggressive lazy loading

---

**Visual Examples Complete**
**Next Steps:** Create interactive prototypes in Figma
**Review:** Test with real users at each stage