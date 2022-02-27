import { useContext } from 'react'
import { SoundContext } from '../store/sound-context'

import LoopItem from '../models/LoopItem'

import classes from './SoundItem.module.css'

const SoundItem: React.FC<{ item: LoopItem }> = props => {
  const {item} = props
  const ctx = useContext(SoundContext)

  const clickHandler = (event: React.MouseEvent) => {
    event.stopPropagation()
    const playingSound = ctx.playingSounds.find(sound => sound.id === item.id)
    if (playingSound) {
      ctx.removePlayingSound(item.id)
    } else {
      ctx.addPlayingSound(item)
    }
  }

  const isPlayingSound= () => {
    return ctx.playingSounds.find(sound => sound.id === item.id)
  }

  const getItemclass = () => {
    const itemClass = [classes['sound-item']]
    const playingSound = isPlayingSound()
    if (playingSound) {
      playingSound.isPlaying ? itemClass.push(classes.playing) : itemClass.push(classes.waiting)
    }
    return itemClass.join(' ')
  }

  const getIconClass = () => {
    const iconClass = ['play', classes.play]
    if (isPlayingSound()) {
      iconClass.push(classes.paused)
    }
    return iconClass.join(' ')
  }

  return (
    <div
      className={getItemclass()}
      onClick={clickHandler}
    >
      <div
        className={getIconClass()}
      />
    </div>
  )
}

export default SoundItem