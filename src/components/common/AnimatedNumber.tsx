import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'
import { formatNumber } from '@/lib/utils'

/** Counts from the previous value to the new one */
export function AnimatedNumber({ value, format = formatNumber }: { value: number; format?: (n: number) => string }) {
  const [display, setDisplay] = useState(value)
  const prev = useRef(value)
  useEffect(() => {
    const controls = animate(prev.current, value, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    prev.current = value
    return () => controls.stop()
  }, [value])
  return <span className="tabular-nums">{format(display)}</span>
}
