import confetti from 'canvas-confetti'

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** A short, restrained burst near the toast area — only for badges and level-ups */
export const subtleCelebration = () => {
  if (reduced()) return
  confetti({
    particleCount: 36,
    spread: 50,
    startVelocity: 22,
    scalar: 0.7,
    ticks: 90,
    gravity: 1.1,
    origin: { x: 0.9, y: 0.95 },
    angle: 110,
    colors: ['#6D5BFF', '#9B5CFF', '#FF7A5C', '#F2B54A'],
    disableForReducedMotion: true,
  })
}
