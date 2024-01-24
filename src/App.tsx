import './App.css'
import AudioPlayer from './components/player'

function App() {

    return (
        <>
            <AudioPlayer currentSong={{ title: "test", artist: "testArtist", src: "/sound.m4a" }}></AudioPlayer>
        </>
    )
}

export default App
