import React, { useState, useEffect, useRef } from "react"
import LoopItem from "../models/LoopItem"

type PlayingSound = {
  id: string,
  audio: HTMLMediaElement
}

type SoundContextObj = {
  sounds: LoopItem[]
  playingSounds: PlayingSound[]
  setSounds: (sounds: LoopItem[]) => void
  addPlayingSound: (id: string) => void
  removePlayingSound: (id: string) => void
  stopPlaying: () => void,
}


export const SoundContext = React.createContext<SoundContextObj>({
  sounds: [],
  playingSounds: [],
  setSounds: (sounds: LoopItem[]) => {},
  addPlayingSound: () => {},
  removePlayingSound: () => {},
  stopPlaying: () => {}
})

const SoundContextProvider: React.FC = props => {
  const [sounds, setSounds] = useState<LoopItem[]>([])
  const [playingSounds, setPlayingSounds] = useState<PlayingSound[]>([])
  let [isPlaying, setIsPlaying] = useState<boolean>(false)

  const currentlyPlaying = useRef<string[]>([])
  const endedSoundsCounter = useRef<number>(0)

  const managePlaylist = (playlist: PlayingSound[]) => {
    endedSoundsCounter.current = 0
    currentlyPlaying.current = []
    for (const item of playlist) {
      item.audio.play()
      currentlyPlaying.current.push(item.id)
    }
    setIsPlaying(true)
  }

  useEffect(() => {
    console.log(playingSounds.length)
    if (!isPlaying && playingSounds.length) {
      managePlaylist(playingSounds)
    } else if (!playingSounds.length) {
      setIsPlaying(false)
    }
  }, [playingSounds, isPlaying])

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
    const playingSound: PlayingSound = { id: id, audio: audio }
    setPlayingSounds(currentSounds => {
      return currentSounds.concat(playingSound)
    })
  }

  const removeSoundHandler = (id: string) => {
    setPlayingSounds(currentSounds => {
      const playingSound = playingSounds.find(sound => sound.id === id)
      playingSound?.audio.pause()
      currentlyPlaying.current = currentlyPlaying.current.filter(curr => curr !== id)
      return currentSounds.filter(current => current.id !== id)
    })
  }

  const stopPlayingHandler = () => {
    setPlayingSounds([])
  }

  const contextValue: SoundContextObj = {
    sounds,
    playingSounds,
    setSounds: setSoundsHandler,
    addPlayingSound: addPlayingSoundHandler,
    removePlayingSound: removeSoundHandler,
    stopPlaying: stopPlayingHandler
  }

  return <SoundContext.Provider value={contextValue}>{props.children}</SoundContext.Provider>
}

export default SoundContextProvider