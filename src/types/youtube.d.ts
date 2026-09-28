/** Minimal typings for the YouTube IFrame Player API */
declare namespace YT {
  const PlayerState: { UNSTARTED: -1; ENDED: 0; PLAYING: 1; PAUSED: 2; BUFFERING: 3; CUED: 5 }
  interface PlayerEvent {
    target: Player
    data: number
  }
  interface PlayerOptions {
    videoId: string
    width?: string | number
    height?: string | number
    playerVars?: Record<string, string | number>
    events?: {
      onReady?: (e: PlayerEvent) => void
      onStateChange?: (e: PlayerEvent) => void
      onError?: (e: PlayerEvent) => void
    }
  }
  class Player {
    constructor(el: HTMLElement | string, opts: PlayerOptions)
    getCurrentTime(): number
    getDuration(): number
    getPlayerState(): number
    seekTo(seconds: number, allowSeekAhead: boolean): void
    playVideo(): void
    pauseVideo(): void
    destroy(): void
  }
}

interface Window {
  YT?: typeof YT
  onYouTubeIframeAPIReady?: () => void
}
