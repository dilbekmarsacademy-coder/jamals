import confetti from 'canvas-confetti'

const COLORS = ['#00F2FE', '#06B6D4', '#8B5CF6', '#F59E0B', '#10B981']

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Two quick side bursts — for badges and level-ups */
export function celebrate() {
  if (reduced()) return
  const base = { particleCount: 70, spread: 70, startVelocity: 45, colors: COLORS, zIndex: 80, scalar: 0.9 }
  confetti({ ...base, angle: 60, origin: { x: 0, y: 0.75 } })
  confetti({ ...base, angle: 120, origin: { x: 1, y: 0.75 } })
}

/** Small burst from a point — for completions */
export function pop(x = 0.5, y = 0.5) {
  if (reduced()) return
  confetti({ particleCount: 45, spread: 60, startVelocity: 30, colors: COLORS, zIndex: 80, scalar: 0.8, origin: { x, y } })
}
