import { useState, useEffect } from 'react'

/**
 * Hook to detect if the user prefers reduced motion
 *
 * Returns true if the user has enabled "reduce motion" in their system preferences.
 * This should be used to disable or simplify animations for accessibility.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 *
 * <motion.div
 *   animate={prefersReducedMotion ? {} : { scale: 1.2 }}
 * />
 * ```
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    // Check on mount if window is available (SSR safety)
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    // Update state if preference changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    // Modern browsers
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return prefersReducedMotion
}
