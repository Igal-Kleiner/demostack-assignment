import React, { useState, useEffect, useRef } from "react"
import LoopItem from "../models/LoopItem"
import { PlayingSound, SoundContextObj } from '../custom-types'

export const SoundContext = React.createContext<SoundContextObj>({
  sounds: [],
  playingSounds: [],
  setSounds: (sounds: LoopItem[]) => {},
  addPlayingSound: () => {},
  removePlayingSound: () => {},
  stopPlaying: () => {},
  play: () => {},
  stop: () => {}
})

const SoundContextProvider: React.FC = props => {
  const [sounds, setSounds] = useState<LoopItem[]>([])
  const [playingSounds, setPlayingSounds] = useState<PlayingSound[]>([])
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const currentlyPlaying = useRef<string[]>([])
  const endedSoundsCounter = useRef<number>(0)

  const managePlaylist = () => {
    endedSoundsCounter.current = 0
    currentlyPlaying.current = []
    for (const item of playingSounds) {
      item.audio.play()
      item.isPlaying = true
      currentlyPlaying.current.push(item.id)
    }
    setIsPlaying(true)
  }

  useEffect(() => {
    if (!isPlaying && playingSounds.length) {
      managePlaylist()
    } else if (!playingSounds.length) {
      setIsPlaying(false)
    }
  }, [isPlaying])

  const setSoundsHandler = (sounds: LoopItem[]) => {
    setSounds(sounds)
  }

  const addPlayingSoundHandler = (id: string) => {
    const sound = sounds.find(item => item.id === id)
    const audio = new Audio(sound?.path)
    audio.addEventListener('ended', () => {
      endedSoundsCounter.current += 1
      if (endedSoundsCounter.current === currentlyPlaying.current.length) {
        setIsPlaying(false)
      }
    })
    const playingSound: PlayingSound = { id: id, audio: audio, isPlaying: false }
    setPlayingSounds(currentSounds => {
      return currentSounds.concat(playingSound)
    })
  }

  const removeSoundHandler = (id: string) => {
    setPlayingSounds(currentSounds => {
      const playingSound = playingSounds.find(sound => sound.id === id)
      playingSound!.audio.pause()
      playingSound!.isPlaying = false
      currentlyPlaying.current = currentlyPlaying.current.filter(curr => curr !== id)
      const filteredSounds = currentSounds.filter(current => current.id !== id)
      if (!filteredSounds.length) {
        setIsPlaying(false)
      }
      return filteredSounds
    })
  }

  const stopPlayingHandler = () => {
    setPlayingSounds([])
  }

  const playHandler = () => {
    managePlaylist()
  }

  const stopHandler = () => {
    for (const sound of playingSounds) {
      removeSoundHandler(sound.id)
    }
  }

  const contextValue: SoundContextObj = {
    sounds,
    playingSounds,
    setSounds: setSoundsHandler,
    addPlayingSound: addPlayingSoundHandler,
    removePlayingSound: removeSoundHandler,
    stopPlaying: stopPlayingHandler,
    play: playHandler,
    stop: stopHandler
  }

  return <SoundContext.Provider value={contextValue}>{props.children}</SoundContext.Provider>
}

export default SoundContextProvider