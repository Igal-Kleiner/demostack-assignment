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
      ctx.addPlayingSound(item.id)
    }
  }

  return (
    <div className={classes['sound-item']} onClick={clickHandler}>
      <button
        className={`${classes.button} ${ctx.playingSounds.find(sound => sound.id === item.id) ? classes.paused : ''}`}
      />
    </div>
  )
}
//[classes.button, props.item.isPlaying ? classes.paused : ''].join(', ')

export default SoundItem