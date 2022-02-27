import React, { useState, useEffect, useRef } from "react"
import LoopItem from "../models/LoopItem"
import { PlayingSound, SoundContextObj } from '../custom-types'

// Context API definition
export const SoundContext = React.createContext<SoundContextObj>({
  sounds: [],
  playingSounds: [],
  setSounds: (sounds: LoopItem[]) => {},
  addPlayingSound: (sound: LoopItem) => {},
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

  // Inner functions, not exposed outside
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

  const handleEndedSound = () => {
    endedSoundsCounter.current += 1
    // when all the tracks stopped playing - set isPlaying state to false
    // it will trigger useEffect, which will call the managePlaylist method.
    // managePlaylist will restart playing all the added tracks
    if (endedSoundsCounter.current === currentlyPlaying.current.length) {
      setIsPlaying(false)
    }
  }

  // Runs whenever isPlaying state changes
  useEffect(() => {
    if (!isPlaying && playingSounds.length) {
      managePlaylist()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying])

  const setSoundsHandler = (sounds: LoopItem[]) => {
    setSounds(sounds)
  }

  const addPlayingSoundHandler = (sound: LoopItem) => {
    // create new HTMLAudioElement and add 'ended' event listener to it
    const audio = new Audio(sound?.path)
    audio.addEventListener('ended', handleEndedSound)

    // for every added track create a PlayingSound type and add it to the list of playing sounds
    const playingSound: PlayingSound = { id: sound.id, audio: audio, isPlaying: false }
    setPlayingSounds(currentSounds => {
      return currentSounds.concat(playingSound)
    })
  }

  const removeSoundHandler = (id: string) => {
    setPlayingSounds(currentSounds => {
      // when removing a sound, find it in playingSounds array, pause it's playing, 
      //   set isPlaying to false and remove it from the playingSounds array.
      // Pausing will caouse it to stop immediately, removing from array will prevent
      //   it from playing on next iteration.
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