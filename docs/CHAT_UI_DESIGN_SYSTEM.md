# Lumara Chat UI Design System

**Created:** 2025-10-18
**Status:** Complete Design System
**Purpose:** Comprehensive design tokens, CSS architecture, and visual language for implementation

*This document defines the complete design system for Lumara's chat-first interface, providing a single source of truth for all visual decisions.*

---

## 🎨 Design Tokens

### Color Palette

```css
/* ==========================================
   Foundation Colors
   ========================================== */

:root {
  /* Primary Background - Deep Purple Universe */
  --lumara-bg-primary: #1a0f2e;
  --lumara-bg-secondary: #2d1b69;
  --lumara-bg-tertiary: #241640;

  /* Surface Colors - Glass Layers */
  --lumara-surface-glass: rgba(255, 255, 255, 0.03);
  --lumara-surface-glass-hover: rgba(255, 255, 255, 0.05);
  --lumara-surface-glass-active: rgba(255, 255, 255, 0.08);
  --lumara-surface-solid: rgba(36, 22, 64, 0.95);

  /* Border Colors */
  --lumara-border-subtle: rgba(255, 255, 255, 0.05);
  --lumara-border-default: rgba(255, 255, 255, 0.1);
  --lumara-border-strong: rgba(255, 255, 255, 0.2);
  --lumara-border-focus: rgba(147, 197, 253, 0.5);
}

/* ==========================================
   Semantic Colors - Growth Stages
   ========================================== */

:root {
  /* Memory Growth Stages */
  --lumara-seed: #6366f1;        /* New memory */
  --lumara-seed-rgb: 99, 102, 241;

  --lumara-sprout: #10b981;      /* Growing */
  --lumara-sprout-rgb: 16, 185, 129;

  --lumara-plant: #14b8a6;       /* Established */
  --lumara-plant-rgb: 20, 184, 166;

  --lumara-tree: #3b82f6;        /* Mature */
  --lumara-tree-rgb: 59, 130, 246;
}

/* ==========================================
   Luminosity System - Confidence Levels
   ========================================== */

:root {
  /* Confidence-based Brightness */
  --lumara-dim: #4a5568;         /* 0-25% */
  --lumara-dim-rgb: 74, 85, 104;

  --lumara-glow: #fbbf24;        /* 26-50% */
  --lumara-glow-rgb: 251, 191, 36;

  --lumara-bright: #fde047;      /* 51-75% */
  --lumara-bright-rgb: 253, 224, 71;

  --lumara-radiant: #ffffff;     /* 76-100% */
  --lumara-radiant-rgb: 255, 255, 255;
}

/* ==========================================
   Aurora Palette - Contradictions & Discovery
   ========================================== */

:root {
  /* Aurora Colors */
  --lumara-aurora-green: #86efac;
  --lumara-aurora-green-rgb: 134, 239, 172;

  --lumara-aurora-blue: #93c5fd;
  --lumara-aurora-blue-rgb: 147, 197, 253;

  --lumara-aurora-purple: #c084fc;
  --lumara-aurora-purple-rgb: 192, 132, 252;

  --lumara-aurora-pink: #f0abfc;
  --lumara-aurora-pink-rgb: 240, 171, 252;

  /* Aurora Gradient */
  --lumara-aurora-gradient: linear-gradient(
    270deg,
    var(--lumara-aurora-green) 0%,
    var(--lumara-aurora-blue) 25%,
    var(--lumara-aurora-purple) 50%,
    var(--lumara-aurora-pink) 75%,
    var(--lumara-aurora-blue) 100%
  );
}

/* ==========================================
   Text Colors
   ========================================== */

:root {
  --lumara-text-primary: #ffffff;
  --lumara-text-secondary: rgba(255, 255, 255, 0.8);
  --lumara-text-tertiary: rgba(255, 255, 255, 0.6);
  --lumara-text-quaternary: rgba(255, 255, 255, 0.4);
  --lumara-text-disabled: rgba(255, 255, 255, 0.3);

  /* Inverted for light surfaces */
  --lumara-text-on-light: #1a0f2e;
  --lumara-text-on-light-secondary: rgba(26, 15, 46, 0.8);
}

/* ==========================================
   Functional Colors
   ========================================== */

:root {
  --lumara-success: #10b981;
  --lumara-success-rgb: 16, 185, 129;

  --lumara-warning: #f59e0b;
  --lumara-warning-rgb: 245, 158, 11;

  --lumara-error: #ef4444;
  --lumara-error-rgb: 239, 68, 68;

  --lumara-info: #3b82f6;
  --lumara-info-rgb: 59, 130, 246;
}
```

### Typography

```css
/* ==========================================
   Font Families
   ========================================== */

:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
               Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-mono: 'SF Mono', Monaco, Consolas, 'Liberation Mono',
               'Courier New', monospace;
}

/* ==========================================
   Font Sizes - Fluid Typography
   ========================================== */

:root {
  /* Base size scales with viewport */
  --text-xs: clamp(0.75rem, 2vw, 0.875rem);      /* 12-14px */
  --text-sm: clamp(0.875rem, 2.5vw, 1rem);       /* 14-16px */
  --text-base: clamp(1rem, 3vw, 1.125rem);       /* 16-18px */
  --text-lg: clamp(1.125rem, 3.5vw, 1.25rem);    /* 18-20px */
  --text-xl: clamp(1.25rem, 4vw, 1.5rem);        /* 20-24px */
  --text-2xl: clamp(1.5rem, 5vw, 1.875rem);      /* 24-30px */
  --text-3xl: clamp(1.875rem, 6vw, 2.25rem);     /* 30-36px */
  --text-4xl: clamp(2.25rem, 8vw, 3rem);         /* 36-48px */
}

/* ==========================================
   Font Weights
   ========================================== */

:root {
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}

/* ==========================================
   Line Heights
   ========================================== */

:root {
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}

/* ==========================================
   Letter Spacing
   ========================================== */

:root {
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
  --tracking-widest: 0.1em;
}
```

### Spacing System

```css
/* ==========================================
   Spacing Scale - 4px Base Unit
   ========================================== */

:root {
  --space-0: 0;
  --space-px: 1px;
  --space-0-5: 0.125rem;  /* 2px */
  --space-1: 0.25rem;     /* 4px */
  --space-1-5: 0.375rem;  /* 6px */
  --space-2: 0.5rem;      /* 8px */
  --space-2-5: 0.625rem;  /* 10px */
  --space-3: 0.75rem;     /* 12px */
  --space-3-5: 0.875rem;  /* 14px */
  --space-4: 1rem;        /* 16px */
  --space-5: 1.25rem;     /* 20px */
  --space-6: 1.5rem;      /* 24px */
  --space-7: 1.75rem;     /* 28px */
  --space-8: 2rem;        /* 32px */
  --space-9: 2.25rem;     /* 36px */
  --space-10: 2.5rem;     /* 40px */
  --space-12: 3rem;       /* 48px */
  --space-14: 3.5rem;     /* 56px */
  --space-16: 4rem;       /* 64px */
  --space-20: 5rem;       /* 80px */
  --space-24: 6rem;       /* 96px */
  --space-32: 8rem;       /* 128px */
  --space-40: 10rem;      /* 160px */
  --space-48: 12rem;      /* 192px */
  --space-56: 14rem;      /* 224px */
  --space-64: 16rem;      /* 256px */
}
```

### Border Radius

```css
/* ==========================================
   Border Radius System
   ========================================== */

:root {
  --radius-none: 0;
  --radius-sm: 0.125rem;    /* 2px */
  --radius-default: 0.25rem; /* 4px */
  --radius-md: 0.375rem;     /* 6px */
  --radius-lg: 0.5rem;       /* 8px */
  --radius-xl: 0.75rem;      /* 12px */
  --radius-2xl: 1rem;        /* 16px */
  --radius-3xl: 1.5rem;      /* 24px */
  --radius-full: 9999px;     /* Pill shape */

  /* Component-specific radii */
  --radius-button: var(--radius-lg);
  --radius-card: var(--radius-xl);
  --radius-modal: var(--radius-2xl);
  --radius-input: var(--radius-3xl);
}
```

### Shadows

```css
/* ==========================================
   Shadow System
   ========================================== */

:root {
  /* Elevation shadows */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
               0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
               0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
               0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
               0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

  /* Glow shadows */
  --shadow-glow-sm: 0 0 10px rgba(var(--lumara-aurora-blue-rgb), 0.3);
  --shadow-glow-md: 0 0 20px rgba(var(--lumara-aurora-blue-rgb), 0.4);
  --shadow-glow-lg: 0 0 40px rgba(var(--lumara-aurora-purple-rgb), 0.5);

  /* Inner shadows */
  --shadow-inner-sm: inset 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-inner-md: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
}
```

### Animation Timing

```css
/* ==========================================
   Animation Duration
   ========================================== */

:root {
  --duration-instant: 50ms;
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 700ms;
  --duration-slowest: 1000ms;
}

/* ==========================================
   Animation Easing Functions
   ========================================== */

:root {
  /* Standard easings */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* Custom easings */
  --ease-elastic: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-bounce: cubic-bezier(0.87, -0.41, 0.19, 1.44);
  --ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);

  /* Spring physics */
  --ease-spring: cubic-bezier(0.5, 1.25, 0.75, 1.25);
  --ease-spring-soft: cubic-bezier(0.5, 1.5, 0.75, 1.25);
}
```

---

## 🏗️ CSS Architecture

### Layer System

```css
/* ==========================================
   CSS Cascade Layers
   ========================================== */

@layer reset, base, tokens, components, utilities;

/* Reset layer - Normalize browser defaults */
@layer reset {
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
}

/* Base layer - Element styles */
@layer base {
  body {
    font-family: var(--font-sans);
    font-size: var(--text-base);
    line-height: var(--leading-normal);
    color: var(--lumara-text-primary);
    background: var(--lumara-bg-primary);
  }
}

/* Tokens layer - Design tokens */
@layer tokens {
  /* All design tokens defined here */
}

/* Components layer - Component styles */
@layer components {
  .btn {
    /* Component styles */
  }
}

/* Utilities layer - Utility classes */
@layer utilities {
  .text-center {
    text-align: center;
  }
}
```

### Component Structure

```css
/* ==========================================
   BEM-inspired Component Structure
   ========================================== */

/* Block */
.message-card {
  /* Block styles */
}

/* Element */
.message-card__header {
  /* Element styles */
}

/* Modifier */
.message-card--highlighted {
  /* Modifier styles */
}

/* State */
.message-card.is-loading {
  /* State styles */
}

/* Responsive */
@media (min-width: 768px) {
  .message-card {
    /* Tablet styles */
  }
}
```

### Glass Morphism System

```css
/* ==========================================
   Glassmorphism Utilities
   ========================================== */

.glass {
  background: var(--lumara-surface-glass);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--lumara-border-default);
}

.glass-heavy {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--lumara-border-strong);
}

.glass-light {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid var(--lumara-border-subtle);
}

/* Frosted glass effect */
.glass-frosted {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
```

### Glow Effects

```css
/* ==========================================
   Luminosity Glow System
   ========================================== */

.glow-dim {
  box-shadow: 0 0 20px rgba(var(--lumara-dim-rgb), 0.3);
}

.glow-medium {
  box-shadow: 0 0 30px rgba(var(--lumara-glow-rgb), 0.4);
}

.glow-bright {
  box-shadow: 0 0 40px rgba(var(--lumara-bright-rgb), 0.5);
}

.glow-radiant {
  box-shadow: 0 0 60px rgba(var(--lumara-radiant-rgb), 0.6);
}

/* Aurora glow */
.glow-aurora {
  box-shadow:
    0 0 20px rgba(var(--lumara-aurora-green-rgb), 0.3),
    0 0 40px rgba(var(--lumara-aurora-blue-rgb), 0.2),
    0 0 60px rgba(var(--lumara-aurora-purple-rgb), 0.1);
  animation: aurora-pulse 4s ease-in-out infinite;
}

@keyframes aurora-pulse {
  0%, 100% {
    filter: hue-rotate(0deg) brightness(1);
  }
  50% {
    filter: hue-rotate(30deg) brightness(1.1);
  }
}
```

---

## 🎭 Component Styles

### Button System

```css
/* ==========================================
   Button Base
   ========================================== */

.btn {
  /* Structure */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-5);

  /* Typography */
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-snug);
  text-decoration: none;

  /* Appearance */
  border-radius: var(--radius-button);
  border: 1px solid transparent;
  cursor: pointer;
  user-select: none;

  /* Animation */
  transition: all var(--duration-normal) var(--ease-out);
}

/* ==========================================
   Button Variants
   ========================================== */

.btn-primary {
  background: linear-gradient(135deg,
    rgba(var(--lumara-seed-rgb), 0.9),
    rgba(var(--lumara-plant-rgb), 0.9)
  );
  color: white;
  border-color: rgba(255, 255, 255, 0.1);
}

.btn-primary:hover {
  background: linear-gradient(135deg,
    rgba(var(--lumara-seed-rgb), 1),
    rgba(var(--lumara-plant-rgb), 1)
  );
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow-md);
}

.btn-glass {
  background: var(--lumara-surface-glass);
  backdrop-filter: blur(10px);
  border-color: var(--lumara-border-default);
  color: var(--lumara-text-primary);
}

.btn-glass:hover {
  background: var(--lumara-surface-glass-hover);
  border-color: var(--lumara-border-strong);
}

.btn-aurora {
  background: var(--lumara-aurora-gradient);
  background-size: 200% 100%;
  color: var(--lumara-text-on-light);
  animation: aurora-flow 4s ease infinite;
}
```

### Input System

```css
/* ==========================================
   Input Base
   ========================================== */

.input {
  /* Structure */
  width: 100%;
  padding: var(--space-3) var(--space-4);

  /* Typography */
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--lumara-text-primary);

  /* Appearance */
  background: var(--lumara-surface-glass);
  backdrop-filter: blur(10px);
  border: 1px solid var(--lumara-border-default);
  border-radius: var(--radius-input);

  /* Animation */
  transition: all var(--duration-normal) var(--ease-out);
}

.input:focus {
  outline: none;
  background: var(--lumara-surface-glass-hover);
  border-color: transparent;
  box-shadow:
    0 0 0 1px var(--lumara-border-focus),
    var(--shadow-glow-sm);
}

.input::placeholder {
  color: var(--lumara-text-quaternary);
}
```

### Card System

```css
/* ==========================================
   Card Base
   ========================================== */

.card {
  /* Structure */
  padding: var(--space-4);

  /* Appearance */
  background: var(--lumara-surface-glass);
  backdrop-filter: blur(10px);
  border: 1px solid var(--lumara-border-default);
  border-radius: var(--radius-card);

  /* Animation */
  transition: all var(--duration-normal) var(--ease-out);
}

/* ==========================================
   Memory Card Specific
   ========================================== */

.memory-card {
  position: relative;
  overflow: hidden;
}

/* Confidence gradient overlay */
.memory-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: var(--confidence, 50%);
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(var(--lumara-glow-rgb), 0.1)
  );
  pointer-events: none;
  transition: width var(--duration-slow) var(--ease-out);
}

/* Growth stage indicator */
.memory-card[data-stage="seed"] {
  border-color: rgba(var(--lumara-seed-rgb), 0.3);
  background: rgba(var(--lumara-seed-rgb), 0.05);
}

.memory-card[data-stage="sprout"] {
  border-color: rgba(var(--lumara-sprout-rgb), 0.3);
  background: rgba(var(--lumara-sprout-rgb), 0.05);
}

.memory-card[data-stage="plant"] {
  border-color: rgba(var(--lumara-plant-rgb), 0.3);
  background: rgba(var(--lumara-plant-rgb), 0.05);
}

.memory-card[data-stage="tree"] {
  border-color: rgba(var(--lumara-tree-rgb), 0.3);
  background: rgba(var(--lumara-tree-rgb), 0.05);
}
```

---

## 🌊 Animation Library

### Core Animations

```css
/* ==========================================
   Entrance Animations
   ========================================== */

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* ==========================================
   Continuous Animations
   ========================================== */

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* ==========================================
   Aurora Animations
   ========================================== */

@keyframes auroraFlow {
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

@keyframes auroraWave {
  0% {
    transform: translateX(-100%) skewX(-10deg);
  }
  100% {
    transform: translateX(100%) skewX(-10deg);
  }
}
```

### Particle System

```css
/* ==========================================
   Particle Effects
   ========================================== */

.particle {
  position: absolute;
  pointer-events: none;
  animation: particleFloat 3s ease-out forwards;
}

@keyframes particleFloat {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(
      calc(var(--random-x) * 100px),
      calc(var(--random-y) * -100px)
    ) scale(0);
    opacity: 0;
  }
}

/* CSS Custom Properties for randomization */
.particle:nth-child(1) { --random-x: 0.5; --random-y: 0.8; }
.particle:nth-child(2) { --random-x: -0.3; --random-y: 0.6; }
.particle:nth-child(3) { --random-x: 0.7; --random-y: 0.9; }
.particle:nth-child(4) { --random-x: -0.6; --random-y: 0.7; }
.particle:nth-child(5) { --random-x: 0.2; --random-y: 0.5; }
```

---

## 📱 Responsive System

### Breakpoint Variables

```css
/* ==========================================
   Responsive Breakpoints
   ========================================== */

:root {
  --screen-xs: 475px;   /* Extra small phones */
  --screen-sm: 640px;   /* Small devices */
  --screen-md: 768px;   /* Medium devices */
  --screen-lg: 1024px;  /* Large devices */
  --screen-xl: 1280px;  /* Extra large devices */
  --screen-2xl: 1536px; /* Huge screens */
}
```

### Container Queries

```css
/* ==========================================
   Container Query Support
   ========================================== */

.responsive-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card-content {
    display: flex;
    gap: var(--space-4);
  }
}

@container card (min-width: 600px) {
  .card-content {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}
```

---

## 🎯 Utility Classes

### Display Utilities

```css
.hidden { display: none; }
.block { display: block; }
.inline-block { display: inline-block; }
.flex { display: flex; }
.inline-flex { display: inline-flex; }
.grid { display: grid; }

/* Responsive display */
@media (min-width: 768px) {
  .md\:hidden { display: none; }
  .md\:block { display: block; }
  .md\:flex { display: flex; }
}
```

### Spacing Utilities

```css
/* Margin utilities */
.m-0 { margin: 0; }
.m-1 { margin: var(--space-1); }
.m-2 { margin: var(--space-2); }
.m-3 { margin: var(--space-3); }
.m-4 { margin: var(--space-4); }

/* Padding utilities */
.p-0 { padding: 0; }
.p-1 { padding: var(--space-1); }
.p-2 { padding: var(--space-2); }
.p-3 { padding: var(--space-3); }
.p-4 { padding: var(--space-4); }
```

### Text Utilities

```css
/* Text alignment */
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-justify { text-align: justify; }

/* Text size */
.text-xs { font-size: var(--text-xs); }
.text-sm { font-size: var(--text-sm); }
.text-base { font-size: var(--text-base); }
.text-lg { font-size: var(--text-lg); }

/* Text weight */
.font-light { font-weight: var(--font-light); }
.font-normal { font-weight: var(--font-normal); }
.font-medium { font-weight: var(--font-medium); }
.font-bold { font-weight: var(--font-bold); }
```

---

## ✨ Special Effects

### Aurora Contradiction Effect

```css
.aurora-effect {
  position: relative;
  overflow: hidden;
}

.aurora-effect::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: var(--lumara-aurora-gradient);
  background-size: 50% 50%;
  animation: auroraRotate 8s linear infinite;
  opacity: 0.3;
  pointer-events: none;
}

@keyframes auroraRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

### Success Celebration

```css
.celebration {
  position: relative;
}

.celebration::after {
  content: '';
  position: absolute;
  inset: -20px;
  background: radial-gradient(
    circle at center,
    rgba(var(--lumara-radiant-rgb), 0.2),
    transparent 70%
  );
  animation: celebrationPulse 1s ease-out;
  pointer-events: none;
}

@keyframes celebrationPulse {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
```

---

**Design System Status:** Complete and ready for implementation
**CSS Architecture:** Layered, maintainable, and performant
**Next Steps:** Create component library with these tokens