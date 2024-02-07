import {MdEqualizer} from "react-icons/md";
import {PiMusicNotesSimple, PiPauseCircleFill, PiPlayCircleFill, PiPlaylist, PiSkipBackFill, PiSkipForwardFill, PiSpeakerHigh, PiSpeakerLow, PiSpeakerNone, PiSpeakerSlash, PiVinylRecord} from 'react-icons/pi';

const iconSize = 32;
const playIconSize = 56;
const skipIconSize = 24;
const iconClassName = "hover:text-neutral-300 transition-colors duration-75";
export const icons = {
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
    album: <PiVinylRecord size={iconSize} className={iconClassName} />,
    song: <PiMusicNotesSimple size={iconSize} className={iconClassName} />,
    playlist: <PiPlaylist size={iconSize} className={iconClassName} />,
};
