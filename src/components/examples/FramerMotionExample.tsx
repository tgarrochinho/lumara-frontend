import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export function FramerMotionExample() {
  const [isVisible, setIsVisible] = useState(true)
  const [count, setCount] = useState(0)

  return (
    <Card className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Framer Motion Example</h2>
        <p className="text-white/70 text-sm">
          Declarative animations with gesture support and layout transitions
        </p>
      </div>

      <div className="space-y-4">
        {/* Toggle animation */}
        <div>
          <Button onClick={() => setIsVisible(!isVisible)} size="sm">
            Toggle Element
          </Button>
          <AnimatePresence mode="wait">
            {isVisible && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <p className="text-white/90">I fade in and out smoothly!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Layout animation */}
        <div>
          <Button onClick={() => setCount(count + 1)} size="sm">
            Add Item (Count: {count})
          </Button>
          <motion.div layout className="mt-4 space-y-2">
            {Array.from({ length: count % 5 }).map((_, i) => (
              <motion.div
                key={`${count}-${i}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout
                className="p-3 bg-gradient-to-r from-brand-indigo/20 to-brand-violet/20 rounded-lg border border-white/10"
              >
                <p className="text-white/90 text-sm">Item {i + 1}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Drag example */}
        <div>
          <p className="text-sm text-white/70 mb-2">Drag the box below:</p>
          <div className="h-32 bg-white/5 rounded-lg border border-white/10 relative overflow-hidden">
            <motion.div
              drag
              dragConstraints={{
                top: 0,
                left: 0,
                right: 200,
                bottom: 80,
              }}
              dragElastic={0.1}
              whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
              className="w-12 h-12 bg-gradient-to-r from-brand-indigo to-brand-violet rounded-lg cursor-grab absolute"
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
