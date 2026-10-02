import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-[background,box-shadow,transform,color,border-color] duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-cta text-[#04121a] shadow-[0_0_0_1px_rgb(255_255_255/0.15)_inset,0_8px_24px_-10px_rgb(6_182_212/0.7)] hover:shadow-[0_0_0_1px_rgb(255_255_255/0.25)_inset,0_10px_30px_-8px_rgb(0_242_254/0.6)] hover:brightness-110',
        violet: 'bg-violet text-white shadow-[0_8px_24px_-10px_rgb(139_92_246/0.8)] hover:brightness-110',
        secondary: 'bg-surface-2 text-fg-strong border border-line hover:bg-surface-3',
        outline: 'border border-line-strong bg-transparent text-fg hover:bg-surface-2',
        ghost: 'text-muted hover:bg-surface-2 hover:text-fg-strong',
        success: 'bg-emerald text-white hover:brightness-110',
        danger: 'bg-crimson text-white hover:brightness-110',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
        icon: 'size-10',
        'icon-sm': 'size-8 rounded-lg',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, asChild, type, ...props }: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} type={asChild ? undefined : (type ?? 'button')} {...props} />
}

export { buttonVariants }
