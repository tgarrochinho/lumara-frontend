# Animation Guidelines

This document provides guidelines for using animation libraries in the Lumara project.

## Overview

Lumara uses two animation libraries:
- **Framer Motion**: For declarative React component animations
- **GSAP**: For complex timeline-based and high-performance animations

## When to Use Framer Motion

Framer Motion is ideal for React component-level animations that are declarative and gesture-based.

### Use Cases
- **Component enter/exit animations**: Fade in/out, slide in/out when mounting/unmounting
- **Gesture-based interactions**: Hover, tap, drag, and other user interactions
- **Layout animations**: Automatic smooth transitions when layout changes
- **Simple declarative animations**: Straightforward animations tied to component lifecycle

### Examples
- Button hover and tap effects
- Modal and dialog transitions
- Card animations on hover
- List item stagger animations
- Page transitions
- Dropdown and menu animations
- Drag-and-drop interfaces

### Code Example
```tsx
import { motion } from 'framer-motion'

function Component() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Content
    </motion.div>
  )
}
```

### Best Practices
- Use `AnimatePresence` for exit animations
- Leverage `layout` prop for automatic layout transitions
- Use spring physics for natural motion (`transition={{ type: 'spring' }}`)
- Keep animations short (200-300ms) for UI feedback
- Use `whileHover` and `whileTap` for interactive elements

## When to Use GSAP

GSAP excels at complex, timeline-based animations and high-performance scenarios with many elements.

### Use Cases
- **Complex animation sequences**: Multi-step animations with precise timing
- **Timeline-based animations**: Coordinated animations across multiple elements
- **High-performance scenarios**: Many elements animating simultaneously
- **Scroll-based animations**: Using ScrollTrigger plugin for scroll-driven effects
- **SVG animations**: Path morphing, drawing animations
- **Advanced physics**: Custom easing and physics simulations

### Examples
- Hero section reveal animations
- Data visualization transitions
- Complex onboarding flows
- Scroll-triggered parallax effects
- SVG icon morphing
- Evolution visualization in Lumara (memory growth animations)
- Timeline-based storytelling

### Code Example
```tsx
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

function Component() {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (elementRef.current) {
      const tl = gsap.timeline({ repeat: -1, yoyo: true })

      tl.to(elementRef.current, {
        x: 100,
        rotation: 360,
        duration: 2,
        ease: 'power2.inOut',
      })
        .to(elementRef.current, {
          scale: 1.5,
          duration: 0.5,
          ease: 'back.out(1.7)',
        })
    }

    return () => {
      gsap.killTweensOf(elementRef.current)
    }
  }, [])

  return <div ref={elementRef}>Animated Element</div>
}
```

### Best Practices
- Use timelines for complex sequences
- Always clean up animations in the effect cleanup function
- Use `gsap.killTweensOf()` to prevent memory leaks
- Leverage GSAP's easing functions for professional motion
- Consider ScrollTrigger for scroll-based animations
- Test performance with many simultaneous animations

## Performance Best Practices

Regardless of which library you use, follow these performance guidelines:

### GPU-Accelerated Properties
Always prefer animating these properties (they trigger GPU acceleration):
- `transform` (translate, rotate, scale)
- `opacity`

### Avoid Animating
These properties trigger layout recalculations and are expensive:
- `width` / `height` (use `scale` instead)
- `top` / `left` (use `transform: translate` instead)
- `margin` / `padding`

### General Guidelines
- Keep UI feedback animations under 300ms
- Use 500-800ms for emphasis animations
- Avoid animations longer than 1 second for user-initiated actions
- Test on mobile devices and lower-end hardware
- Use `will-change` sparingly and only when needed
- Reduce motion for users with `prefers-reduced-motion` preference

### Accessibility
```tsx
// Respect user's motion preferences
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

const transition = prefersReducedMotion
  ? { duration: 0.01 }
  : { type: 'spring', stiffness: 400, damping: 17 }
```

## Decision Matrix

| Scenario | Framer Motion | GSAP |
|----------|--------------|------|
| Button hover effect | ✅ | ❌ |
| Modal entrance | ✅ | ❌ |
| Complex multi-step sequence | ❌ | ✅ |
| Scroll-triggered parallax | ❌ | ✅ |
| Drag and drop | ✅ | ❌ |
| SVG morphing | ❌ | ✅ |
| Layout changes | ✅ | ❌ |
| Timeline coordination | ❌ | ✅ |
| Simple component animations | ✅ | ❌ |
| High-performance (100+ elements) | ❌ | ✅ |

## Testing Animations

### Manual Testing
1. Test on different devices and browsers
2. Check performance with Chrome DevTools Performance tab
3. Verify animations with reduced motion settings
4. Test touch interactions on mobile devices

### Visual Regression Testing
Consider using Playwright for visual regression testing of animations:
```tsx
// Example test
await page.goto('http://localhost:5173/animations')
await page.hover('[data-testid="animated-button"]')
await page.screenshot({ path: 'button-hover.png' })
```

## Examples in This Project

See working examples in `/src/components/examples/`:
- `AnimationExamples.tsx` - Full showcase of both libraries
- `FramerMotionExample.tsx` - Framer Motion demonstrations
- `GsapExample.tsx` - GSAP timeline example

Run the dev server and visit the examples page to see animations in action:
```bash
npm run dev
```

## Additional Resources

### Framer Motion
- [Official Documentation](https://www.framer.com/motion/)
- [Animation Controls](https://www.framer.com/motion/animation/)
- [Gestures](https://www.framer.com/motion/gestures/)
- [Layout Animations](https://www.framer.com/motion/layout-animations/)

### GSAP
- [Official Documentation](https://greensock.com/docs/)
- [Getting Started](https://greensock.com/get-started/)
- [Timeline](https://greensock.com/docs/v3/GSAP/Timeline)
- [Easing Visualizer](https://greensock.com/ease-visualizer/)

## Questions?

If you're unsure which library to use:
1. Start with Framer Motion if it's a React component animation
2. Switch to GSAP if you need complex timelines or advanced features
3. Consult this guide and the examples
4. Ask the team for guidance on complex animation requirements
