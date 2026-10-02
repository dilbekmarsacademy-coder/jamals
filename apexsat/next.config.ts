import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  // The repo root has its own lockfile (the Jamals Vite app); pin this app's root
  turbopack: { root: path.resolve(__dirname) },
}

export default nextConfig
