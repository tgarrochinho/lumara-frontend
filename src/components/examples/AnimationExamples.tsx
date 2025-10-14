import { FramerMotionExample } from './FramerMotionExample'
import { GsapExample } from './GsapExample'
import { Button } from '@/components/ui/Button'

export function AnimationExamples() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            Lumara Animation Library Examples
          </h1>
          <p className="text-white/70 text-lg">
            Interactive demonstrations of Framer Motion and GSAP animations
          </p>
        </div>

        {/* Button showcase */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-white">
            Button Animations (Framer Motion)
          </h2>
          <p className="text-white/70">
            All buttons now have built-in hover and tap animations with spring
            physics
          </p>
          <div className="flex gap-4 flex-wrap">
            <Button variant="primary" size="sm">
              Primary Small
            </Button>
            <Button variant="primary" size="md">
              Primary Medium
            </Button>
            <Button variant="primary" size="lg">
              Primary Large
            </Button>
            <Button variant="secondary" size="md">
              Secondary
            </Button>
            <Button variant="ghost" size="md">
              Ghost
            </Button>
          </div>
        </div>

        {/* Framer Motion examples */}
        <div>
          <FramerMotionExample />
        </div>

        {/* GSAP examples */}
        <div>
          <GsapExample />
        </div>

        {/* Guidelines summary */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-white">
            When to Use Each Library
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-brand-indigo mb-2">
                Framer Motion
              </h3>
              <ul className="text-white/70 text-sm space-y-1 list-disc list-inside">
                <li>React component animations</li>
                <li>Gesture-based interactions (drag, hover, tap)</li>
                <li>Layout animations</li>
                <li>Enter/exit transitions</li>
                <li>Declarative, component-scoped animations</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-violet mb-2">
                GSAP
              </h3>
              <ul className="text-white/70 text-sm space-y-1 list-disc list-inside">
                <li>Complex timeline sequences</li>
                <li>High-performance animations</li>
                <li>Scroll-based animations (ScrollTrigger)</li>
                <li>SVG animations and morphing</li>
                <li>Physics-based animations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
