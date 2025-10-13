# Lumara Logo Design Specifications

**Version:** 1.0
**Created:** January 2025
**Status:** Design Specification
**Purpose:** Technical specifications for Lumara logo creation

*Complete technical guide for designing and implementing the Lumara brand identity system.*

---

## 🎯 Logo Concept Overview

### Core Design Elements
The Lumara logo combines two visual metaphors:
1. **Tree** (Lum-): Representing growing understanding with luminous qualities
2. **Aurora** (-ara): Representing the beautiful contradictions and synthesis moments

### Design Philosophy
- **Organic**: Natural tree forms, not geometric
- **Luminous**: Glowing, light-emanating qualities
- **Mystical**: Ethereal, enchanting aesthetic
- **Minimal**: Clean enough to work at small sizes
- **Memorable**: Distinctive silhouette

---

## 🖼️ Primary Logo: Tree with Aurora Crown

### Visual Description
```
                    ✨ Aurora waves (flowing, organic)
                   ╱ ╲╱ ╲╱ ╲
                  ╱  ╱╲  ╱╲  ╲
                 ╱  ╱  ╲╱  ╲  ╲
                ╱  ╱    🌟    ╲  ╲
               ╱  ╱      |      ╲  ╲
                    🌿  |||  🌿     ← Branches (asymmetric, reaching)
                      ╱ ||| ╲
                     ╱  |||  ╲
                    ╱   |||   ╲      ← Trunk (subtle curve, organic)
                   ╱    |||    ╲
                  ╱     |||     ╲
                 └─────┴┴┴──────┘    ← Roots (optional, subtle)
```

### Detailed Specifications

#### Tree Element
**Trunk:**
- Width: 15% of total logo width at base, tapering to 8% at top
- Height: 60% of total logo height
- Curve: Subtle organic curve (not straight vertical)
- Color: Gradient from `#14b8a6` (teal, base) to `#10b981` (emerald, top)
- Effect: Inner glow, 5px blur, 40% opacity white

**Branches:**
- Count: 4-6 main branches
- Style: Asymmetric, reaching upward and outward
- Thickness: 3-5% of logo width, tapering to points
- Angle: 30-60° from vertical
- Color: Same gradient as trunk, slightly brighter at tips
- Effect: Subtle glow at branch tips (recent growth feeling)

**Roots (Optional):**
- Depth: 10% of logo height below trunk
- Style: Mirror of branches but inverted and simplified
- Opacity: 40-60% (subtle, grounding)
- Color: Darker teal `#0f766e`

#### Aurora Element
**Wave Pattern:**
- Position: Above tree, crowning the top branches
- Height: 25% of total logo height
- Width: 120% of tree width (extends beyond tree)
- Waves: 3-4 flowing, overlapping wave forms
- Style: Organic, flowing curves (like northern lights)

**Colors (Gradient Flow):**
```css
/* Aurora gradient (left to right) */
linear-gradient(
  90deg,
  #86efac 0%,    /* Aurora green */
  #93c5fd 35%,   /* Aurora blue */
  #c084fc 65%,   /* Aurora purple */
  #f0abfc 100%   /* Aurora pink */
)
```

**Effects:**
- Opacity: 60-80% (translucent, ethereal)
- Blur: Soft edge blur, 8px
- Glow: Outer glow, 10px spread, 30% opacity
- Animation (digital only): Slow flowing movement (8s cycle)

### Proportions & Grid

#### Grid System (100x100 unit base)
```
Units: 100 x 100 grid
Clear space: 15 units on all sides

Tree placement:
- Base: 15 units from bottom
- Center: 50 units horizontal center
- Top: 70 units from bottom
- Width: 30 units at widest point

Aurora placement:
- Base: 65 units from bottom
- Width: 40-50 units (extends beyond tree)
- Height: 20 units

Root placement (if included):
- Base: 10 units from bottom
- Width: 25 units
```

#### Aspect Ratio
- **Square format**: 1:1 (primary)
- **Horizontal format**: 3:1 (with wordmark)
- **Vertical format**: 1:2 (stacked with wordmark)

---

## 📐 Logo Variations

### 1. Full Logo (Primary)
**Components:** Tree + Aurora + Wordmark "Lumara"

**Specifications:**
- **Dimensions**: 1000px × 400px (horizontal)
- **Tree + Aurora**: Left 40% of space
- **Wordmark**: Right 60% of space, vertically centered
- **Spacing**: 50px gap between symbol and wordmark
- **Usage**: Website header, marketing materials, presentations

**Wordmark Typography:**
- Font: Plus Jakarta Sans Bold (or Inter Bold)
- Size: 160px (relative to 400px height)
- Color: White `#ffffff`
- Letter spacing: -2% (tighter)
- Effect: Subtle glow, 3px blur, 20% opacity cyan

### 2. Symbol Only (App Icon)
**Components:** Tree + Aurora only (no wordmark)

**Specifications:**
- **Dimensions**: 1024px × 1024px (iOS requirement)
- **Safe area**: 924px × 924px (90% of total, accounting for rounded corners)
- **Tree scale**: 70% of safe area height
- **Aurora scale**: Proportional to tree
- **Background**: Deep purple gradient
  ```css
  linear-gradient(180deg, #1a0f2e 0%, #2d1b69 100%)
  ```
- **Padding**: 100px on all sides
- **Usage**: App icons, favicons, social media avatars

**Export Formats:**
- iOS: 1024×1024px PNG (required), 180×180px, 120×120px, 80×80px
- Android: 512×512px PNG (required), 192×192px, 144×144px, 96×96px
- Favicon: 32×32px, 16×16px ICO
- Web: 512×512px PNG, 192×192px PNG, SVG

### 3. Wordmark Only
**Components:** "Lumara" text only

**Specifications:**
- **Height**: 100px (base size)
- **Font**: Plus Jakarta Sans Bold
- **Color variations**:
  - Light theme: Deep purple `#1a0f2e`
  - Dark theme: White `#ffffff`
  - Gradient: Teal to Purple
    ```css
    linear-gradient(90deg, #14b8a6 0%, #8b5cf6 100%)
    ```
- **Letter spacing**: -1%
- **Usage**: Text-only contexts, tight spaces, footer

### 4. Minimal Icon
**Components:** Simplified tree silhouette

**Specifications:**
- **Style**: Single color, no gradients
- **Dimensions**: 24×24px (base), scalable
- **Stroke width**: 2px
- **Color**: Teal `#14b8a6` or white
- **Usage**: UI icons, loading states, watermarks

---

## 🎨 Color Variations

### Dark Theme (Primary)
**Background:** Deep purple `#1a0f2e` or darker
**Tree:** Teal gradient `#14b8a6` → `#10b981`
**Aurora:** Full color gradient (green → blue → purple → pink)
**Wordmark:** White `#ffffff` with cyan glow

### Light Theme (Alternative)
**Background:** White `#ffffff` or light gray
**Tree:** Darker teal `#0f766e` → `#047857`
**Aurora:** Reduced opacity (40%), same colors
**Wordmark:** Deep purple `#1a0f2e`

### Monochrome (White)
**Background:** Dark (any)
**Tree:** White `#ffffff`
**Aurora:** White with gradient opacity (40% → 70% → 40%)
**Wordmark:** White `#ffffff`
**Usage:** Print, embroidery, engraving

### Monochrome (Black)
**Background:** Light (any)
**Tree:** Black `#000000` or deep purple `#1a0f2e`
**Aurora:** Black with gradient opacity (20% → 40% → 20%)
**Wordmark:** Black `#000000`
**Usage:** Print, dark surfaces

---

## 📏 Technical Requirements

### File Formats

#### Vector (Source Files)
- **Primary**: SVG (web-optimized)
- **Design**: Adobe Illustrator (.ai), Figma (.fig)
- **Requirements**: Editable layers, named groups, organized artboards

#### Raster (Export Formats)
- **PNG**: Transparent background, 72dpi (web), 300dpi (print)
- **JPG**: Opaque background, 300dpi (print only)
- **WebP**: Optimized web format, transparent background

### Size Requirements

#### Digital
- **App Icon**: 1024×1024px (iOS), 512×512px (Android)
- **Web Header**: 200px height (responsive width)
- **Social Media**: 800×800px (profile), 1200×630px (Open Graph)
- **Favicon**: 32×32px, 16×16px

#### Print
- **Business Card**: 300dpi minimum
- **Poster**: Vector (SVG/AI) preferred, or 300dpi PNG
- **Merchandise**: Vector required for screen printing

### Export Settings

#### SVG Optimization
```xml
<!-- Remove unnecessary metadata -->
<!-- Simplify paths -->
<!-- Decimal precision: 2 -->
<!-- Minify: Yes -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Clean, optimized SVG code -->
</svg>
```

#### PNG Export
- **Color mode**: RGB
- **Bit depth**: 32-bit (with alpha transparency)
- **Compression**: Maximum (lossless)
- **Resolution**: 72dpi (web), 300dpi (print)

#### WebP Export
- **Quality**: 85-90%
- **Transparency**: Yes
- **Compression**: Lossy (for smaller file size)

---

## 🖥️ Digital Implementation

### CSS Implementation (SVG Inline)

```html
<!-- Primary logo with hover glow effect -->
<div class="lumara-logo">
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Tree gradient -->
      <linearGradient id="tree-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#14b8a6;stop-opacity:1" />
      </linearGradient>

      <!-- Aurora gradient -->
      <linearGradient id="aurora-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#86efac;stop-opacity:0.7" />
        <stop offset="35%" style="stop-color:#93c5fd;stop-opacity:0.8" />
        <stop offset="65%" style="stop-color:#c084fc;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#f0abfc;stop-opacity:0.7" />
      </linearGradient>

      <!-- Glow filter -->
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <!-- Tree trunk -->
    <path d="M45,80 Q47,50 48,30 Q50,50 55,80 Z"
          fill="url(#tree-gradient)"
          filter="url(#glow)" />

    <!-- Aurora waves (simplified) -->
    <path d="M20,30 Q35,25 50,30 T80,30"
          stroke="url(#aurora-gradient)"
          stroke-width="8"
          fill="none"
          opacity="0.7" />
  </svg>
</div>
```

```css
/* Logo container */
.lumara-logo {
  width: 100px;
  height: 100px;
  transition: filter 300ms ease;
}

.lumara-logo:hover {
  filter: drop-shadow(0 0 20px rgba(20, 184, 166, 0.5));
}

/* Responsive sizing */
@media (max-width: 768px) {
  .lumara-logo {
    width: 60px;
    height: 60px;
  }
}
```

### React Component

```tsx
import React from 'react';

interface LumaraLogoProps {
  size?: number;
  variant?: 'full' | 'symbol' | 'wordmark';
  className?: string;
}

export const LumaraLogo: React.FC<LumaraLogoProps> = ({
  size = 100,
  variant = 'symbol',
  className = ''
}) => {
  if (variant === 'symbol') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`lumara-logo ${className}`}
      >
        {/* SVG content here */}
      </svg>
    );
  }

  // Additional variants...
};
```

---

## 🎨 Image Generation Prompts

Use these prompts to generate logo concepts for validation:

### Prompt 1: Primary Logo (Tree + Aurora)
```
A minimalist, mystical logo featuring a glowing tree with aurora borealis crown. The tree is stylized with organic curves, glowing cyan-teal gradient (#14b8a6 to #10b981), with subtle inner glow. Above the tree floats ethereal aurora waves in gradient colors from green to blue to purple to pink, translucent and flowing. Dark deep purple background (#1a0f2e). Clean, modern, enchanting aesthetic. Vector style, smooth gradients, soft glowing effects. Centered composition, 1024x1024px.
```

### Prompt 2: App Icon Version
```
App icon design for Lumara: A luminous tree silhouette with aurora crown on deep purple gradient background. The tree glows with cyan-teal light (#14b8a6), simple but elegant organic branches reaching upward. Aurora waves flow above in soft gradient colors (green, blue, purple, pink), ethereal and translucent. Mystical, enchanting feel. Clean composition with generous padding. Dark purple gradient background (#1a0f2e to #2d1b69). Modern, minimal, recognizable at small sizes. 1024x1024px, iOS app icon style.
```

### Prompt 3: Horizontal Full Logo
```
Horizontal logo layout: Left side shows a glowing tree with aurora crown (same style as previous), right side has the wordmark "Lumara" in clean, modern sans-serif font (Plus Jakarta Sans style), white color with subtle cyan glow. Tree element is cyan-teal gradient with glowing effect, aurora waves above in green-blue-purple-pink gradient. Deep purple background (#1a0f2e). Spacing between symbol and text. Professional, mystical, clean. 3:1 aspect ratio, 1200x400px.
```

### Prompt 4: Minimal Icon
```
Simple, minimal icon of a stylized tree outline. Single color (cyan-teal #14b8a6), line art style, 2px stroke weight. Organic, flowing lines forming a recognizable tree shape. Clean, modern, scalable. Transparent background. Can work at 24x24px size. Vector style, no gradients, just clean lines. Suitable for UI icons and small-scale usage.
```

### Prompt 5: Alternative Concept (Abstract)
```
Abstract geometric logo concept: Intertwining light streams and aurora waves forming a tree-like shape. Flowing, dynamic composition using curves and gradients. Cyan-teal light streams (#14b8a6) merge with purple-pink aurora colors (#c084fc, #f0abfc). Luminous, glowing effects. Mystical, modern, unique. Dark purple background. More abstract than literal tree representation. Ethereal energy visualization. 1024x1024px, centered.
```

---

## ✅ Design Checklist

Before finalizing the logo:

### Visual Quality
- [ ] Clean, scalable vector paths
- [ ] Smooth curves (no jagged edges)
- [ ] Balanced composition
- [ ] Clear visual hierarchy
- [ ] Recognizable at 16px size
- [ ] Works in monochrome

### Technical Quality
- [ ] All layers properly named
- [ ] Colors use defined palette
- [ ] Gradients are smooth
- [ ] Effects are subtle (not overdone)
- [ ] File size optimized (<50KB SVG)
- [ ] Exported in all required formats

### Brand Alignment
- [ ] Captures "Lumara" essence (light + aura)
- [ ] Feels organic and mystical
- [ ] Matches color palette
- [ ] Consistent with UI design
- [ ] Memorable and distinctive
- [ ] Scalable to full brand system

### Practical Tests
- [ ] Test on dark backgrounds (primary)
- [ ] Test on light backgrounds (secondary)
- [ ] Test at app icon size (60×60px)
- [ ] Test at favicon size (16×16px)
- [ ] Test in grayscale
- [ ] Test with screen readers (alt text works)

---

## 📦 Deliverables

### Phase 1: Concept Exploration
- [ ] 3-5 initial concept sketches
- [ ] Digital mockups of top 2 concepts
- [ ] Concept refinement based on feedback

### Phase 2: Primary Logo Development
- [ ] Full logo (tree + aurora + wordmark) - SVG
- [ ] Symbol only (tree + aurora) - SVG + PNG exports
- [ ] Wordmark only - SVG + PNG exports
- [ ] Minimal icon - SVG

### Phase 3: Variations & Formats
- [ ] Color variations (dark, light, monochrome)
- [ ] All required export sizes
- [ ] App icons (iOS, Android, web)
- [ ] Favicons (ICO, PNG)
- [ ] Social media formats

### Phase 4: Implementation Assets
- [ ] Design source files (AI, Figma, Sketch)
- [ ] React component implementation
- [ ] CSS implementation with animations
- [ ] Usage guidelines document
- [ ] Asset library ZIP

---

## 📚 References

- [APP_NAMING_DECISION.md](./APP_NAMING_DECISION.md) - Logo concept rationale
- [LUMARA_BRAND_GUIDELINES.md](./LUMARA_BRAND_GUIDELINES.md) - Color and typography system
- [DIGITAL_GARDEN_UI_DESIGN.md](./DIGITAL_GARDEN_UI_DESIGN.md) - Visual design context

---

## 📝 Notes for Designer

### Design Approach
1. **Start organic**: Sketch natural tree forms, avoid geometric templates
2. **Luminosity first**: Focus on the glowing, light-emanating quality
3. **Aurora integration**: Make sure aurora feels integrated, not added on
4. **Simplify**: Start complex, then simplify for scalability
5. **Test small**: Constantly check how it looks at icon size

### Inspiration References
- Northern Lights photography (aurora movement)
- Botanical illustrations (organic tree forms)
- Light and glow effects in UI design
- Mystical/ethereal brand aesthetics (not dark/gothic)

### Technical Tips
- Use vector paths with minimal nodes
- Apply gradients in design tool, not as raster effects
- Keep separate layers for tree, aurora, effects
- Export with clear names: `lumara-logo-full.svg`
- Test exports immediately after creation

---

*"The Lumara logo is more than an image—it's the visual embodiment of light meeting aura, understanding blooming into truth."*
