import {
	IoPlay, IoPause, IoPlaySkipForward, IoPlaySkipBack,
	IoVolumeHigh, IoVolumeMedium, IoVolumeLow, IoVolumeMute
} from "react-icons/io5";

import { createContext } from 'react'
import './App.css'
import AudioPlayer, { SongList } from './components/player'

const iconSize = 32;
export const iconsContext = createContext({
	iconSize: iconSize,
	play: <IoPlay size={iconSize} />,
	pause: <IoPause size={iconSize} />,
	prev: <IoPlaySkipBack size={iconSize} />,
	next: <IoPlaySkipForward size={iconSize} />,
	volumeHigh: <IoVolumeHigh size={iconSize} />,
	volumeMedium: <IoVolumeMedium size={iconSize} />,
	volumeLow: <IoVolumeLow size={iconSize} />,
	volumeMute: <IoVolumeMute size={iconSize} />,
})

const songs = [
	{
		title: "test1",
		artist: "testArtisteeee",
		album: {
			title: "ALBUM",
			imgSrc: "/cover.png",
		},
		src: "/sound.m4a",
	},
	{
		title: "test2",
		artist: "ARTIST3",
		album: {
			title: "alb",
			imgSrc: "/cover.png",
		},
		src: "/sound.m4a",
	},
	{
		title: "test3",
		artist: "Artist",
		album: {
			title: "cool",
			imgSrc: "/cover.png",
		},
		src: "/sound.m4a",
	},
]

function App() {

	return (
		<div className="max-w-2xl mx-auto">
			<span className="flex">
				<SongList songs={songs} />
				<AudioPlayer
					currentSong={{
						title: "test",
						artist: "testArtist",
						album: {
							title: "TestAlbum",
							imgSrc: "/cover.png",
						},
						src: "/sound.m4a",
					}}
					onNext={() => { }}
					onPrev={() => { }}
				/>
			</span>
		</div >
	)
}

export default App
