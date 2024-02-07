import './App.css';
import {PlayerStore, iconsContext, playerStoreContext} from './components/player';
import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';

import {MdEqualizer} from "react-icons/md";
import {PiPauseCircleFill, PiPlayCircleFill, PiSkipBackFill, PiSkipForwardFill, PiSpeakerHigh, PiSpeakerLow, PiSpeakerNone, PiSpeakerSlash, PiVinylRecord} from 'react-icons/pi';

import {songs} from './testData';
import Layout from './components/layout/Sidebar';


const iconSize = 32;
const playIconSize = 56;
const skipIconSize = 24;
const iconClassName = "hover:text-neutral-300 transition-colors duration-75";
const icons = {
    iconSize: iconSize,
    play: <PiPlayCircleFill size={playIconSize} className={iconClassName} />,
    pause: <PiPauseCircleFill size={playIconSize} className={iconClassName} />,
    prev: <PiSkipBackFill size={skipIconSize} className={iconClassName} />,
    next: <PiSkipForwardFill size={skipIconSize} className={iconClassName} />,
    volumeHigh: <PiSpeakerHigh size={iconSize} className={iconClassName} />,
    volumeMedium: <PiSpeakerLow size={iconSize} className={iconClassName} />,
    volumeLow: <PiSpeakerNone size={iconSize} className={iconClassName} />,
    volumeMute: <PiSpeakerSlash size={iconSize} className={iconClassName} />,
    equalizer: <MdEqualizer size={iconSize} />,
    album: <PiVinylRecord size={iconSize} className={iconClassName} />
};


function App() {
    const player = new PlayerStore(songs);

    return (
        <iconsContext.Provider value={icons}>
            <playerStoreContext.Provider value={player}>
                <Layout />
            </playerStoreContext.Provider>
        </iconsContext.Provider>
    );
}

export default App;
