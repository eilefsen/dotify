import { ReactNode, createContext, useContext, useRef } from 'react';
import { PlayButton, NextSongButton, PrevSongButton, ProgressBar } from './transportControls';
import { VolumeSlider, MuteButton } from './volumeControls';
import './player.css'
import { makeAutoObservable, computed, runInAction } from "mobx";
import { iconsContext } from '@/App';
import { observer } from 'mobx-react-lite';
import { useHoverDirty } from 'react-use';
import { VscBlank } from 'react-icons/vsc';
import { IconContext } from 'react-icons';

interface Song {
	title: string;
	artist: string;
	album: {
		title: string;
		imgSrc: string;
	};
	src: string;
	length?: number;
}

export class PlayerStore {
	audio = new Audio();
	isReady = false;
	isPlaying = false;
	isMuted = false;
	volume = 0.7;
	duration = 0;
	seek = 0;
	songIndex = 0;
	songList: Song[] = []

	constructor(songs: Song[]) {
		this.songList = songs;
		this.audio.preload = "metadata";
		if (this.songCount != 0) {
			this.audio.src = this.currentSong.src;
		}
		makeAutoObservable(this, {
			audio: false,
			songCount: computed,
			currentSong: computed,
		});

		this.audio.addEventListener('durationchange', (ev) => {
			const target = (ev.currentTarget as HTMLAudioElement)
			runInAction(() => {
				this.duration = target.duration;
			});
		});
		this.audio.addEventListener('canplay', (ev) => {
			const target = (ev.currentTarget as HTMLAudioElement)
			runInAction(() => {
				target.volume = this.volume;
				this.isReady = true;
			});
		});
		this.audio.addEventListener('timeupdate', (ev) => {
			const target = (ev.currentTarget as HTMLAudioElement)
			runInAction(() => {
				this.seek = target.currentTime;
			});
		});
	}

	togglePlay() {
		if (this.isPlaying) {
			this.pause();
		} else {
			this.play();
		}
	}
	play() {
		this.audio.play();
		this.isPlaying = true;
	}
	pause() {
		this.audio.pause();
		this.isPlaying = false;
	}

	toggleMute() {
		this.audio.muted = !this.audio.muted;
		this.isMuted = !this.isMuted;
	};

	setVolume(vol: number) {
		this.audio.volume = vol;
		this.volume = vol;
	}
	setProgress(time: number) {
		this.audio.currentTime = time;
		this.seek = time;
	}

	skip(increment: number) {
		this.skipToIndex(this.songIndex + increment);
	}
	skipToIndex(index: number) {
		this.songIndex = index;
		this.audio.src = this.currentSong.src;
		this.audio.load();
	}
	delayedPlay(ms: number = 500) {
		setTimeout(() => {
			this.play();
		}, ms);
	}

	get songCount() {
		return this.songList.length;
	}

	get currentSong() {
		return this.songList[this.songIndex];
	}
}

export const playerStoreContext = createContext(new PlayerStore([]))

interface SongListProps {
	songs: Array<Song>;
}

interface SongEntryProps {
	song: Song;
	index: number;
}

const SongEntry = observer(({ song, index }: SongEntryProps) => {
	const icons = useContext(iconsContext);
	const store = useContext(playerStoreContext);
	function toggleIcon() {
		if (store.songIndex == index && store.isPlaying) {
			return icons.pause;
		} else {
			return icons.play;
		}
	}
	function hoverIcon(isHovering: boolean) {
		if (isHovering) {
			if (store.songIndex == index) {
				return toggleIcon();
			}
			return icons.play;
		} else if (store.songIndex == index) {
			return icons.equalizer;
		}
		return <VscBlank size={icons.iconSize} />;
	}


	const hoverRef = useRef(null);
	const isHovering = useHoverDirty(hoverRef);
	const btnIcon = hoverIcon(isHovering);


	return (
		<button
			ref={hoverRef}
			className={`w-full block`}
			onClick={() => {
				if (store.songIndex != index) {
					store.skipToIndex(index);
					store.play();
				} else {
					store.togglePlay();
				}
			}}
		>
			<div className='flex bg-slate-900 border-slate-700 border-b-2 px-4 py-1 text-left'>
				<IconContext.Provider value={isHovering ? { className: "text-slate-500" } : { className: "text-slate-600" }}>
					{btnIcon}
				</IconContext.Provider>
				<span className=' pl-2 pt-1'>
					<span className='text-slate-300 font-bold text-base'>
						{song.title}
					</span>
					<span> - </span>
					<span className='text-slate-400 font-bold text-sm'>
						{song.artist}
					</span>
				</span>
			</div >
		</button>
	)
})

export const SongList = observer(({ songs }: SongListProps) => {

	const songElements: Array<ReactNode> = []
	songs.forEach((song, i) => {
		const songElement = <SongEntry key={i} song={song} index={i} />
		songElements.push(songElement)
	})

	return (
		<div className=' bg-slate-950 min-w-fit'>
			{songElements}
		</div>
	)
})

export const AudioPlayer = observer(() => {
	const player = useContext(playerStoreContext)

	return (
		<div>
			<div className='bg-slate-900 text-slate-400 p-3 relative'>

				<ProgressBar
					className='[&_.slider-track]:rounded-none'
				/>
				<SongTitle title={player.currentSong.title} artist={player.currentSong.artist} />
				<div className="grid grid-cols-2 items-center mt-4">
					{/* Transport controls */}
					<span className='flex'>
						<PrevSongButton />
						<PlayButton />
						<NextSongButton />
					</span>
					{/* Volume controls */}
					<span className='flex gap-2 items-center xxl:justify-self-end'>
						<MuteButton />
						<VolumeSlider />
					</span>
				</div >
			</div>
		</div >
	)
})


interface SongTitleProps {
	title?: string
	artist?: string
}

const SongTitle = observer(function ({ title, artist }: SongTitleProps) {
	return (
		<div className='text-center mb-1'>
			<div className='text-slate-300 font-bold text-base'>
				{title ?? "No Song playing"}
			</div>
			{artist && (
				<div className='text-slate-400 font-bold text-sm'>
					{artist}
				</div>
			)}
		</div >
	)
})