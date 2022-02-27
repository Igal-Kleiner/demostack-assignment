import React, { useContext, useEffect } from 'react'
import SoundItem from './SoundItem'
import { SoundContext } from '../store/sound-context'
import LoopItem from '../models/LoopItem'

import classes from './SoundGrid.module.css'

const SoundGrid: React.FC = () => {
  const ctx = useContext(SoundContext)

  // On first load, import all the .mp3 files in the assets/sounds folder
  useEffect(() => {
    function importAll(req: any): LoopItem[] {
      const sounds: LoopItem[] = []
      for (const item of req.keys()) {
        sounds.push(new LoopItem(item.replace('./', './assets/sounds/')))
      }
      return sounds
    }

    const sounds = importAll(require.context('../../public/assets/sounds', false, /\.mp3/))

    // set the imported sounds in the state
    ctx.setSounds(sounds)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={classes.container}>
      {ctx.sounds.map(item => {
        return <SoundItem key={item.id} item={item} />
      })}
    </div>
  )
}

export default SoundGrid