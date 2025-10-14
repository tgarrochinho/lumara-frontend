import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

type CardProps = HTMLAttributes<HTMLDivElement>

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl bg-white/5 border border-white/10 p-6',
          className
        )}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'
