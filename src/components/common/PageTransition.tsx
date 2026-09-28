import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

/** Quick, understated fade between routes */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.16, ease: 'easeOut' }}>
      {children}
    </motion.div>
  )
}

/** Section entrance: a single gentle fade, no bouncing */
export const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.03 } } },
  item: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.25 } },
  },
}
