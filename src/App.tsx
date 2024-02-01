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
	play: <IoPlay size={iconSize} className="hover:text-slate-300 transition-colors duration-75" />,
	pause: <IoPause size={iconSize} className="hover:text-slate-300 transition-colors duration-75" />,
	prev: <IoPlaySkipBack size={iconSize} className="hover:text-slate-300 transition-colors duration-75" />,
	next: <IoPlaySkipForward size={iconSize} className="hover:text-slate-300 transition-colors duration-75" />,
	volumeHigh: <IoVolumeHigh size={iconSize} className="hover:text-slate-300 transition-colors duration-75" />,
	volumeMedium: <IoVolumeMedium size={iconSize} className="hover:text-slate-300 transition-colors duration-75" />,
	volumeLow: <IoVolumeLow size={iconSize} className="hover:text-slate-300 transition-colors duration-75" />,
	volumeMute: <IoVolumeMute size={iconSize} className="hover:text-slate-300 transition-colors duration-75" />,
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
