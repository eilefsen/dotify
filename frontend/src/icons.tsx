import {
	PiGithubLogoBold,
	PiGuitar,
	PiMusicNotesSimple,
	PiPauseCircleBold,
	PiPauseCircleFill,
	PiPauseFill,
	PiPlayCircleBold,
	PiPlayCircleFill,
	PiPlayFill,
	PiPlaylist,
	PiSignIn,
	PiSignOut,
	PiSkipBackFill,
	PiSkipForwardFill,
	PiSpeakerHigh,
	PiSpeakerLow,
	PiSpeakerNone,
	PiSpeakerSlash,
	PiTimer,
	PiVinylRecord,
} from "react-icons/pi";

const iconSize = 32;
const playIconSize = 56;
const skipIconSize = 24;
const iconClassName = "hover:text-neutral-300 transition-colors duration-75";
export const icons = {
	iconSize: iconSize,
	play: <PiPlayCircleFill size={playIconSize} className={iconClassName} />,
	playOutline: (
		<PiPlayCircleBold size={playIconSize} className={iconClassName} />
	),
	playSmall: <PiPlayFill size={16} className={iconClassName} />,
	pause: <PiPauseCircleFill size={playIconSize} className={iconClassName} />,
	pauseOutline: (
		<PiPauseCircleBold size={playIconSize} className={iconClassName} />
	),
	pauseSmall: <PiPauseFill size={16} className={iconClassName} />,
	prev: <PiSkipBackFill size={skipIconSize} className={iconClassName} />,
	next: <PiSkipForwardFill size={skipIconSize} className={iconClassName} />,
	volumeHigh: <PiSpeakerHigh size={iconSize} className={iconClassName} />,
	volumeMedium: <PiSpeakerLow size={iconSize} className={iconClassName} />,
	volumeLow: <PiSpeakerNone size={iconSize} className={iconClassName} />,
	volumeMute: <PiSpeakerSlash size={iconSize} className={iconClassName} />,
	album: <PiVinylRecord size={iconSize} className={iconClassName} />,
	song: <PiMusicNotesSimple size={iconSize} className={iconClassName} />,
	playlist: <PiPlaylist size={iconSize} className={iconClassName} />,
	artist: <PiGuitar size={iconSize} className={iconClassName} />,
	timer: <PiTimer size={24} className={iconClassName} />,
	login: <PiSignIn size={32} />,
	logout: <PiSignOut size={32} />,
	github: <PiGithubLogoBold size={32} />,
};
