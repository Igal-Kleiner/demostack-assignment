import SoundGrid from './components/SoundsGrid';
import PlayControls from './components/PlayControls';
import SoundContextProvider from './store/sound-context';

import classes from './App.module.css'

function App() {

  return (
    <SoundContextProvider>
      <div className={classes.container}>
        <div className={classes.title}>Demostack Loop Machine</div>
        <div className={classes.subtitle}>By Igal Kleiner</div>
      </div>
      <SoundGrid />
      <PlayControls />
    </SoundContextProvider>
  )
}

export default App;
