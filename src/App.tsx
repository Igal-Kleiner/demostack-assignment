import SoundGrid from './components/SoundsGrid';
import SoundContextProvider from './store/sound-context';

//import sounds from './assets/sounds/*.mp3'
//const sounds = require('./assets/sounds/*.mp3')



function App() {

  return (
    <SoundContextProvider>
      <SoundGrid />
    </SoundContextProvider>
  );
}

export default App;
