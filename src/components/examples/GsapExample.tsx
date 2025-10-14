import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Card } from '@/components/ui/Card'

export function GsapExample() {
  const boxRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    if (boxRef.current && textRef.current) {
      // Create a timeline for complex sequenced animations
      tlRef.current = gsap.timeline({ repeat: -1, yoyo: true })

      tlRef.current
        .to(boxRef.current, {
          x: 200,
          rotation: 360,
          duration: 2,
          ease: 'power2.inOut',
        })
        .to(
          boxRef.current,
          {
            scale: 1.5,
            duration: 0.5,
            ease: 'back.out(1.7)',
          },
          '-=0.5'
        )
        .to(boxRef.current, {
          scale: 1,
          duration: 0.5,
          ease: 'back.in(1.7)',
        })

      // Fade in text
      gsap.from(textRef.current, {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power2.out',
      })
    }

    return () => {
      // Kill the timeline first to stop infinite loop
      if (tlRef.current) {
        tlRef.current.kill()
      }
      // Then cleanup individual tweens, filtering out null refs
      const targets = [boxRef.current, textRef.current].filter(Boolean)
      if (targets.length > 0) {
        gsap.killTweensOf(targets)
      }
    }
  }, [])

  return (
    <Card className="space-y-6">
      <div ref={textRef}>
        <h2 className="text-xl font-semibold mb-2">GSAP Animation Example</h2>
        <p className="text-white/70 text-sm">
          Complex timeline animation with multiple steps and easing functions
        </p>
      </div>
      <div className="h-24 relative">
        <div
          ref={boxRef}
          className="w-16 h-16 bg-gradient-to-r from-brand-indigo to-brand-violet rounded-lg shadow-lg"
        />
      </div>
    </Card>
  )
}
