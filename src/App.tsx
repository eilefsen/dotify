import {
	IoPlay, IoPause, IoPlaySkipForward, IoPlaySkipBack,
	IoVolumeHigh, IoVolumeMedium, IoVolumeLow, IoVolumeMute
} from "react-icons/io5";
import { MdEqualizer } from "react-icons/md";

import './App.css'
import { createContext } from 'react'
import { AudioPlayer, SongList, PlayerStore, playerStoreContext } from './components/player'

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
	equalizer: <MdEqualizer size={iconSize} />,
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
			imgSrc: "/album.jpg",
		},
		src: "/sound.m4a",
	},
]

function App() {
	const player = new PlayerStore(songs)

	return (
		<div className="max-w-2xl mx-auto">
			<playerStoreContext.Provider value={player}>
				<span className="flex">
					<SongList songs={songs} />
					<div className="block">
						<img
							className='object-cover'
							src={player.currentSong.album.imgSrc}
							alt={player.currentSong.album.title}
						/>
						<AudioPlayer />
					</div>
				</span>
			</playerStoreContext.Provider>
		</div >
	)
}

export default App
