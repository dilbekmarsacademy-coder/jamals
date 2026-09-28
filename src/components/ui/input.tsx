import * as React from 'react'
import { cn } from '@/lib/utils'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-lg border border-border-strong bg-surface px-3 text-sm outline-none transition-colors placeholder:text-subtle focus:border-primary focus-visible:outline-none',
        className,
      )}
      {...props}
    />
  ),
)
Input.displayName = 'Input'
