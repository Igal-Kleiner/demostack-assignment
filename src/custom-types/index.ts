import LoopItem from "../models/LoopItem"

export type PlayingSound = {
  id: string,
  audio: HTMLMediaElement,
  isPlaying: boolean
}

export type SoundContextObj = {
  sounds: LoopItem[]
  playingSounds: PlayingSound[]
  setSounds: (sounds: LoopItem[]) => void
  addPlayingSound: (id: string) => void
  removePlayingSound: (id: string) => void
  stopPlaying: () => void,
  play: () => void,
  stop: () => void
}