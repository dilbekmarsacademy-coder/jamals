/** Minimal typings for the YouTube IFrame Player API */
declare namespace YT {
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
    setPlaybackRate(rate: number): void
    mute(): void
    unMute(): void
    isMuted(): boolean
    destroy(): void
  }
}

interface Window {
  YT?: { Player: typeof YT.Player }
  onYouTubeIframeAPIReady?: () => void
}
