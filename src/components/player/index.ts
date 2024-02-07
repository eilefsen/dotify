import {PlayerStore, iconsContext, playerStoreContext} from './context';
import {Song} from './types';
import {
    NextSongButton,
    PrevSongButton,
    PlayButton,
    ProgressBar,
    VolumeSlider,
    MuteButton,
} from './controls';
import {AudioPlayer} from './player';
import CoverImg from './CoverImg';

// types
export type {
    Song
};
// context
export {
    PlayerStore,
    iconsContext as iconsContext,
    playerStoreContext,
};
// controls
export {
    NextSongButton,
    PrevSongButton,
    PlayButton,
    ProgressBar,
    VolumeSlider,
    MuteButton,
};
// player
export {
    AudioPlayer,
    CoverImg,
};
