# Lumara Brand Identity Guidelines

**Version:** 1.0
**Created:** January 2025
**Status:** Active
**Purpose:** Complete brand identity system for Lumara

*These guidelines ensure visual and conceptual consistency across all touchpoints of the Lumara brand.*

---

## 🎯 Brand Essence

### Core Concept
**Lumara = Luma (luminosity/light) + Aura (aurora/energy field)**

A mystical digital garden where your understanding grows from dim seeds to radiant trees of knowledge, with auroras illuminating the contradictions that lead to deeper truth.

### Brand Attributes
- **Organic**: Growth, not construction
- **Luminous**: Light reveals confidence
- **Mystical**: Ethereal, not mechanical
- **Personal**: Your truth, your garden
- **Evolving**: Always in motion, never static
- **Contemplative**: Space for reflection

### Brand Promise
*"Lumara illuminates your journey from uncertainty to personal truth through organic understanding growth."*

---

## 🎨 Visual Identity System

### 1. Logo Concepts

#### Primary Logo: Tree with Aurora Crown
```
Concept: Stylized tree silhouette with glowing aurora crown
- Tree trunk: Simple, organic curves
- Branches: Reaching upward with natural asymmetry
- Aurora: Flowing waves above in cyan/purple gradient
- Glow: Subtle light emanation from trunk and branches
```

**Logo Variations:**
1. **Full Logo**: Tree + aurora + wordmark "Lumara"
2. **Icon Only**: Tree with aurora (for app icon, favicon)
3. **Wordmark Only**: "Lumara" text (for text-only contexts)
4. **Minimal**: Simple tree outline (for watermarks)

#### App Icon Design
```
Square: 1024x1024px
- Background: Deep purple gradient (#1a0f2e → #2d1b69)
- Tree: Centered, glowing cyan (#14b8a6)
- Aurora: Purple/pink waves (#c084fc → #f0abfc) above tree
- Effect: Soft glow blur around tree (luminosity)
- Contrast: High enough for recognition at small sizes
```

#### Logo Usage Rules
✅ **DO:**
- Use on dark backgrounds (#1a0f2e or darker)
- Maintain clear space (minimum 20% of logo height)
- Scale proportionally
- Use approved color variations only

❌ **DON'T:**
- Place on light backgrounds (logo optimized for dark)
- Add drop shadows or outer glows
- Rotate or distort
- Combine with other logos without spacing

### 2. Color System

#### Foundation Colors
```css
:root {
  /* Backgrounds */
  --lumara-deep-purple: #1a0f2e;
  --lumara-purple-gradient: linear-gradient(180deg, #1a0f2e 0%, #2d1b69 100%);
  --lumara-dark-overlay: rgba(26, 15, 46, 0.95);

  /* Glass/UI Elements */
  --lumara-glass: rgba(255, 255, 255, 0.1);
  --lumara-glass-border: rgba(255, 255, 255, 0.2);
  --lumara-glass-hover: rgba(255, 255, 255, 0.15);
}
```

#### Growth States (Tree Stages)
```css
:root {
  /* Knowledge Maturity */
  --lumara-seed: #6366f1;      /* Indigo - New ideas */
  --lumara-sprout: #10b981;    /* Emerald - Growing */
  --lumara-plant: #14b8a6;     /* Teal - Established */
  --lumara-tree: #3b82f6;      /* Blue - Deep truth */
}
```

**Usage:**
- `seed`: Untested ideas, just planted
- `sprout`: First validation, early growth
- `plant`: Medium confidence, stable
- `tree`: High confidence, mature understanding

#### Luminosity Levels (Confidence)
```css
:root {
  /* Tree Brightness Based on Confidence */
  --lumara-dim: #4a5568;       /* 0-25% confidence */
  --lumara-glow: #fbbf24;      /* 26-50% confidence */
  --lumara-bright: #fde047;    /* 51-75% confidence */
  --lumara-radiant: #ffffff;   /* 76-100% confidence */
}
```

**Usage:**
- Node opacity maps to confidence (0-100%)
- Glow intensity increases with recent activity
- Color temperature: cooler (dim) → warmer (bright) → white (radiant)

#### Aurora Effects (Contradictions)
```css
:root {
  /* Aurora Colors for Contradiction Visualization */
  --lumara-aurora-green: #86efac;
  --lumara-aurora-blue: #93c5fd;
  --lumara-aurora-purple: #c084fc;
  --lumara-aurora-pink: #f0abfc;

  /* Gradients */
  --lumara-aurora-gradient: linear-gradient(
    90deg,
    var(--lumara-aurora-green) 0%,
    var(--lumara-aurora-blue) 25%,
    var(--lumara-aurora-purple) 50%,
    var(--lumara-aurora-pink) 100%
  );
}
```

**Usage:**
- Aurora effects when contradictions detected
- Animated flowing gradients
- Particle effects in aurora colors
- Synthesis moments use purple-dominant aurora

#### Semantic Colors (Functional)
```css
:root {
  /* Confidence Indicators */
  --lumara-confidence-high: #10b981;   /* Green */
  --lumara-confidence-medium: #f59e0b; /* Amber */
  --lumara-confidence-low: #ef4444;    /* Red */

  /* Contradiction States */
  --lumara-contradiction-active: #ef4444;    /* Red */
  --lumara-contradiction-blue: #3b82f6;      /* Blue */
  --lumara-synthesis: #8b5cf6;               /* Purple */

  /* UI States */
  --lumara-success: #10b981;
  --lumara-warning: #f59e0b;
  --lumara-error: #ef4444;
  --lumara-info: #3b82f6;
}
```

#### Accessibility
- **Contrast ratios**: All text must meet WCAG AA (4.5:1 minimum)
- **Color blindness**: Don't rely on color alone; use icons + text
- **Dark mode optimized**: Primary interface is dark theme

### 3. Typography

#### Font Families
```css
:root {
  /* Primary Font: Clean, modern, readable */
  --lumara-font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Monospace: Code, technical data */
  --lumara-font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;

  /* Display: Marketing, headers (optional) */
  --lumara-font-display: 'Plus Jakarta Sans', 'Inter', sans-serif;
}
```

**Font Weights:**
- 300 (Light): Subtle labels, secondary text
- 400 (Regular): Body text, descriptions
- 500 (Medium): UI labels, buttons
- 600 (Semibold): Subheadings, emphasis
- 700 (Bold): Headings, CTAs

#### Type Scale
```css
:root {
  /* Font Sizes */
  --lumara-text-xs: 0.75rem;    /* 12px - Timestamps, metadata */
  --lumara-text-sm: 0.875rem;   /* 14px - Secondary text */
  --lumara-text-base: 1rem;     /* 16px - Body text */
  --lumara-text-lg: 1.125rem;   /* 18px - Emphasized text */
  --lumara-text-xl: 1.25rem;    /* 20px - Small headings */
  --lumara-text-2xl: 1.5rem;    /* 24px - Headings */
  --lumara-text-3xl: 1.875rem;  /* 30px - Large headings */
  --lumara-text-4xl: 2.25rem;   /* 36px - Display text */

  /* Line Heights */
  --lumara-leading-tight: 1.25;
  --lumara-leading-normal: 1.5;
  --lumara-leading-relaxed: 1.75;
}
```

#### Typography Usage
**Headings:**
- H1 (Display): `text-4xl font-bold leading-tight` - Page titles
- H2 (Section): `text-3xl font-semibold leading-tight` - Major sections
- H3 (Subsection): `text-2xl font-semibold leading-normal` - Subsections
- H4 (Card Title): `text-xl font-medium leading-normal` - Component titles

**Body:**
- Primary: `text-base font-normal leading-relaxed` - Main content
- Secondary: `text-sm font-normal leading-normal` - Supporting text
- Caption: `text-xs font-light leading-normal` - Metadata, timestamps

**UI Elements:**
- Buttons: `text-base font-medium` - Clear CTAs
- Labels: `text-sm font-medium` - Form labels, tags
- Input: `text-base font-normal` - User input fields

### 4. Spacing & Layout

#### Spacing Scale (8px base)
```css
:root {
  --lumara-space-1: 0.25rem;   /* 4px */
  --lumara-space-2: 0.5rem;    /* 8px */
  --lumara-space-3: 0.75rem;   /* 12px */
  --lumara-space-4: 1rem;      /* 16px */
  --lumara-space-5: 1.25rem;   /* 20px */
  --lumara-space-6: 1.5rem;    /* 24px */
  --lumara-space-8: 2rem;      /* 32px */
  --lumara-space-10: 2.5rem;   /* 40px */
  --lumara-space-12: 3rem;     /* 48px */
  --lumara-space-16: 4rem;     /* 64px */
}
```

#### Border Radius (Organic Curves)
```css
:root {
  --lumara-radius-sm: 0.375rem;   /* 6px - Small elements */
  --lumara-radius-md: 0.5rem;     /* 8px - Cards, buttons */
  --lumara-radius-lg: 0.75rem;    /* 12px - Panels */
  --lumara-radius-xl: 1rem;       /* 16px - Modals */
  --lumara-radius-full: 9999px;   /* Pills, avatars */
}
```

**Usage:**
- NO sharp corners (avoid `border-radius: 0`)
- Use `radius-md` as default for most UI
- Use `radius-full` for tree nodes, pills, tags
- Larger radii for larger components

#### Layout Principles
- **Asymmetry**: Organic positioning, avoid strict grids for garden
- **Whitespace**: Generous spacing between elements (minimum 24px)
- **Hierarchy**: Size + weight + color to establish importance
- **Breathing room**: Components need space to "glow"

---

## ✨ Visual Effects & Animation

### 1. Core Effects

#### Glow Effects
```css
/* Subtle glow for active/recent elements */
.lumara-glow-sm {
  box-shadow: 0 0 10px rgba(20, 184, 166, 0.3);
}

.lumara-glow-md {
  box-shadow: 0 0 20px rgba(20, 184, 166, 0.4);
}

.lumara-glow-lg {
  box-shadow: 0 0 40px rgba(20, 184, 166, 0.5);
}

/* Animated pulse */
@keyframes lumara-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.lumara-pulse {
  animation: lumara-pulse 2s ease-in-out infinite;
}
```

**Usage:**
- Recent activity: Small glow
- High confidence: Medium glow
- Active interaction: Large glow
- Pulsing for "alive" feel

#### Glass Morphism
```css
.lumara-glass {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.lumara-glass-hover {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
```

**Usage:**
- Floating panels and cards
- UI controls over garden
- Tooltips and popovers
- Navigation elements

#### Aurora Effects (Shaders)
```glsl
// Fragment shader for aurora (simplified concept)
uniform float time;
uniform vec2 resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;

  // Flowing waves
  float wave1 = sin(uv.x * 5.0 + time) * 0.5 + 0.5;
  float wave2 = sin(uv.x * 3.0 - time * 0.7) * 0.5 + 0.5;

  // Aurora colors
  vec3 color1 = vec3(0.53, 0.94, 0.67); // Green
  vec3 color2 = vec3(0.58, 0.77, 0.99); // Blue
  vec3 color3 = vec3(0.75, 0.52, 0.99); // Purple

  // Blend
  vec3 aurora = mix(mix(color1, color2, wave1), color3, wave2);

  gl_FragColor = vec4(aurora, 0.6);
}
```

**Usage:**
- Contradiction visualization
- Synthesis moments
- Background ambient effects
- Loading states

### 2. Animation Principles

#### Timing Functions
```css
:root {
  /* Organic, natural easing */
  --lumara-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --lumara-ease-out: cubic-bezier(0.0, 0, 0.2, 1);
  --lumara-ease-in: cubic-bezier(0.4, 0, 1, 1);

  /* Bouncy, playful */
  --lumara-ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

  /* Duration */
  --lumara-duration-fast: 150ms;
  --lumara-duration-normal: 300ms;
  --lumara-duration-slow: 500ms;
  --lumara-duration-slower: 1000ms;
}
```

#### Animation Guidelines
✅ **DO:**
- Use organic, flowing animations (no mechanical snapping)
- Animate opacity + transform together for smoothness
- Respect `prefers-reduced-motion`
- 60fps minimum (use GPU-accelerated properties)
- Subtle, purposeful animations

❌ **DON'T:**
- No sudden, jarring movements
- Avoid animating expensive properties (width, height)
- Don't animate everything (use sparingly)
- No looping animations without purpose

#### Key Animations

**Growth Animation (Seed → Tree):**
```css
@keyframes lumara-grow {
  from {
    transform: scale(0.1) translateY(20px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.lumara-grow {
  animation: lumara-grow 1s var(--lumara-ease-out) forwards;
}
```

**Particle Float:**
```css
@keyframes lumara-float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-10px) translateX(5px);
  }
  75% {
    transform: translateY(-5px) translateX(-5px);
  }
}

.lumara-particle {
  animation: lumara-float 4s ease-in-out infinite;
}
```

**Aurora Flow:**
```css
@keyframes lumara-aurora-flow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.lumara-aurora {
  background: var(--lumara-aurora-gradient);
  background-size: 200% 200%;
  animation: lumara-aurora-flow 8s ease-in-out infinite;
}
```

### 3. Interaction Patterns

#### Hover States
```css
/* Default hover: Subtle lift + glow */
.lumara-hover {
  transition: all 300ms var(--lumara-ease-out);
}

.lumara-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);
}
```

#### Active/Focus States
```css
/* Active: Press down */
.lumara-active:active {
  transform: translateY(1px);
}

/* Focus: Clear ring */
.lumara-focus:focus-visible {
  outline: 2px solid var(--lumara-plant);
  outline-offset: 2px;
}
```

#### Loading States
```css
/* Pulsing loader */
.lumara-loading {
  animation: lumara-pulse 1.5s ease-in-out infinite;
}

/* Skeleton loading */
.lumara-skeleton {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 75%
  );
  background-size: 200% 100%;
  animation: lumara-shimmer 1.5s infinite;
}

@keyframes lumara-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

---

## 🗣️ Voice & Tone

### Brand Voice
**Lumara speaks like a wise, gentle guide in a mystical garden.**

#### Characteristics
- **Organic**: "Your understanding grows" (not "Track your knowledge")
- **Luminous**: "Illuminate", "brighten", "glow" (not "show", "display")
- **Encouraging**: "This lumara is strengthening" (not "Confidence increased")
- **Mystical**: "Aurora forming" (not "Contradiction detected")
- **Personal**: "Your truth" (not "The truth")

### Writing Principles

#### ✅ DO Write Like This:
```
"Plant a new seed of light..."
"Your understanding's aura is expanding"
"Contradictions create auroras of possibility"
"Watch this idea grow brighter through testing"
"Your truth tree is becoming more radiant"
```

#### ❌ DON'T Write Like This:
```
"Add new entry"
"Confidence level updated"
"Error: Conflicting data detected"
"Click to increase validation score"
"Knowledge base updated successfully"
```

### Content Tone by Context

**Onboarding:**
- Warm, inviting, mystical
- Short sentences, clear next steps
- Emphasize wonder and growth

**In-app guidance:**
- Gentle, encouraging
- Organic metaphors
- Positive framing (even for contradictions)

**Error states:**
- Organic (withering, not breaking)
- Solution-focused
- Never harsh or technical

**Success moments:**
- Celebratory but subtle
- Growth-focused language
- Visual + textual feedback

### Vocabulary Guide

| ❌ Avoid | ✅ Use Instead |
|---------|---------------|
| Knowledge base | Garden |
| Entry / Note | Seed / Idea |
| Confidence score | Luminosity / Brightness |
| Contradiction | Aurora / Tension |
| Resolution | Synthesis |
| Update | Grow / Evolve |
| Delete | Let wither |
| Archive | Plant in deeper layers |
| Test result | Watering |
| Validation | Strengthening |
| Error | Withering |
| Success | Blooming |
| Loading | Germinating |

---

## 📱 Component Guidelines

### Buttons

```tsx
// Primary CTA
<button className="
  px-6 py-3
  bg-lumara-plant text-white
  rounded-lg font-medium
  hover:bg-lumara-tree
  active:transform active:scale-95
  transition-all duration-300
  lumara-glow-sm
">
  Plant New Seed
</button>

// Secondary
<button className="
  px-6 py-3
  bg-lumara-glass text-white
  border border-lumara-glass-border
  rounded-lg font-medium
  hover:bg-lumara-glass-hover
  transition-all duration-300
">
  View Garden
</button>

// Ghost
<button className="
  px-4 py-2
  text-lumara-plant
  hover:bg-lumara-glass
  rounded-md font-medium
  transition-all duration-300
">
  Learn More
</button>
```

### Cards

```tsx
// Glass card
<div className="
  lumara-glass
  rounded-lg
  p-6
  hover:lumara-glass-hover
  transition-all duration-300
">
  <h3 className="text-xl font-semibold text-white mb-2">
    Understanding Evolution
  </h3>
  <p className="text-sm text-white/70">
    Watch your ideas grow brighter over time
  </p>
</div>

// Garden node card
<div className="
  relative
  rounded-full
  w-24 h-24
  flex items-center justify-center
  lumara-glow-md
  transition-all duration-500
  hover:scale-110
"
style={{
  backgroundColor: 'rgba(20, 184, 166, 0.2)',
  borderColor: 'rgba(20, 184, 166, 0.8)'
}}>
  <span className="text-white font-medium">85%</span>
</div>
```

### Input Fields

```tsx
<div className="space-y-2">
  <label className="text-sm font-medium text-white/90">
    What's glowing in your mind?
  </label>
  <input
    type="text"
    placeholder="Plant a new seed of light..."
    className="
      w-full px-4 py-3
      bg-lumara-glass
      border border-lumara-glass-border
      rounded-lg
      text-white placeholder:text-white/40
      focus:border-lumara-plant
      focus:outline-none
      focus:ring-2 focus:ring-lumara-plant/20
      transition-all duration-300
    "
  />
</div>
```

### Tooltips

```tsx
<div className="
  lumara-glass
  rounded-md
  px-3 py-2
  text-sm text-white
  max-w-xs
  backdrop-blur-lg
">
  This lumara has 73% confidence based on 12 test results
</div>
```

---

## 🎯 Application Patterns

### 1. Empty States

```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <div className="w-16 h-16 mb-4 opacity-40">
    {/* Dimmed seed icon */}
    <SeedIcon />
  </div>
  <h3 className="text-lg font-medium text-white/90 mb-2">
    Your garden awaits
  </h3>
  <p className="text-sm text-white/60 mb-6 max-w-sm">
    Plant your first seed of light to begin growing your understanding
  </p>
  <button className="px-6 py-3 bg-lumara-plant text-white rounded-lg">
    Plant First Seed
  </button>
</div>
```

### 2. Loading States

```tsx
// Skeleton for garden node
<div className="animate-pulse">
  <div className="w-20 h-20 rounded-full bg-white/10" />
  <div className="mt-2 h-4 w-16 bg-white/10 rounded" />
</div>

// Germinating message
<div className="flex items-center gap-2 text-white/70">
  <div className="lumara-pulse">
    <GerminatingIcon />
  </div>
  <span className="text-sm">Germinating your idea...</span>
</div>
```

### 3. Error States

```tsx
<div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
  <WitheringIcon className="text-red-400" />
  <div>
    <h4 className="text-sm font-medium text-red-400 mb-1">
      This seed is withering
    </h4>
    <p className="text-xs text-red-300/70">
      Connection to the garden was lost. Try watering again.
    </p>
  </div>
</div>
```

### 4. Success States

```tsx
<div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg lumara-glow-sm">
  <BloomingIcon className="text-green-400" />
  <div>
    <h4 className="text-sm font-medium text-green-400 mb-1">
      Your idea is blooming!
    </h4>
    <p className="text-xs text-green-300/70">
      Luminosity increased to 85% through testing
    </p>
  </div>
</div>
```

---

## 🚫 Don'ts - What to Avoid

### Visual Don'ts
❌ Sharp corners and mechanical shapes
❌ Harsh, bright white backgrounds
❌ Grid-based rigid layouts for garden
❌ Mechanical, robotic animations
❌ Flat, lifeless colors
❌ Cluttered, cramped spacing
❌ Progress bars (use growth metaphors)
❌ Traditional error icons (use organic withering)

### Language Don'ts
❌ Technical jargon ("API", "Database", "Sync")
❌ Corporate speak ("Optimize", "Leverage", "Utilize")
❌ Aggressive CTAs ("Click here NOW!")
❌ Cold, robotic messages ("Operation completed")
❌ Negative framing ("You failed", "Invalid input")
❌ Overly formal language ("Proceed to dashboard")

### Interaction Don'ts
❌ Sudden, jarring transitions
❌ Modal dialogs that block flow
❌ Confirmation dialogs for everything
❌ Loading spinners (use organic growth)
❌ Aggressive notifications
❌ Auto-playing sounds

---

## ✅ Usage Checklist

Before launching any Lumara design:

### Visual Design
- [ ] Uses approved color palette
- [ ] Typography follows scale and weights
- [ ] Organic curves (no sharp corners)
- [ ] Appropriate spacing (8px base)
- [ ] Glass morphism for floating UI
- [ ] Glow effects for active states
- [ ] Dark theme optimized
- [ ] Accessible contrast ratios

### Animation & Interaction
- [ ] Smooth, organic animations
- [ ] 60fps performance
- [ ] Respects reduced motion
- [ ] Hover/focus states clear
- [ ] Touch targets 44px minimum
- [ ] Gestures feel natural

### Content & Voice
- [ ] Uses organic metaphors
- [ ] Positive, encouraging tone
- [ ] Avoids technical jargon
- [ ] Clear, concise copy
- [ ] Mystical, luminous language
- [ ] Growth-focused messaging

### Implementation
- [ ] Uses CSS variables
- [ ] Follows naming conventions
- [ ] Component reusability
- [ ] Performance optimized
- [ ] Responsive design
- [ ] Accessibility compliant

---

## 📚 Resources

### Design Files
- Logo files: `assets/brand/logo/`
- Color swatches: `assets/brand/colors/`
- Typography specimens: `assets/brand/typography/`

### Code Implementation
- CSS variables: `src/styles/variables.css`
- Component library: `src/components/lumara-ui/`
- Animation utilities: `src/utils/animations.ts`

### Reference Documents
- [APP_NAMING_DECISION.md](./APP_NAMING_DECISION.md) - Naming rationale
- [DIGITAL_GARDEN_UI_DESIGN.md](./DIGITAL_GARDEN_UI_DESIGN.md) - UI specification
- [PERSONAL_TRUTH_STRATEGY.md](./PERSONAL_TRUTH_STRATEGY.md) - Product strategy

---

## 🔄 Version History

**v1.0 - January 2025**
- Initial brand guidelines
- Logo concepts defined
- Complete color system
- Typography scale
- Animation principles
- Component guidelines

---

*"In Lumara, every pixel glows with purpose, every animation breathes with life, and every word invites you deeper into your garden of truth."*
