import React, { useContext } from 'react'
import { SoundContext } from '../store/sound-context'

import classes from './PlayControls.module.css'

const PlayControls: React.FC = () => {
  const ctx = useContext(SoundContext)

  const playClickHandler = () => {
    ctx.play()
  }

  const stopClickHandler = () => {
    ctx.stop()
  }

  const getControlClass = () => {
    const controlClass = [classes.control]
    if (ctx.playingSounds.filter(sound => sound.isPlaying).length) {
      controlClass.push(classes.playing)
    }
    return controlClass.join(' ')
  }

  return (
    <div className={classes['controls-container']}>
      <div className={getControlClass()} onClick={playClickHandler}>
        <div className={`play ${classes.icon}`} />
        Play
      </div>
      <div className={classes.control} onClick={stopClickHandler}>
        <div className={`stop ${classes.icon}`} />
        Stop
      </div>
    </div>
  )
}

export default PlayControls
