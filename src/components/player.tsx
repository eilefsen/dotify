import { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { PlayButton, NextSongButton, PrevSongButton, ProgressBar } from './transportControls';
import { VolumeSlider, MuteButton } from './volumeControls';
import './player.css'
import { makeAutoObservable, computed, runInAction } from "mobx";
import { iconsContext, playerStoreContext } from '@/App';
import { observer } from 'mobx-react-lite';

interface Song {
	title: string;
	artist: string;
	album: {
		title: string;
		imgSrc: string;
	};
	src: string;
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
		this.audio.src = this.currentSong.src;
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
		this.audio.addEventListener('playing', (ev) => {
			runInAction(() => {
				this.isPlaying = true;
			});
		});
		this.audio.addEventListener('pause', (ev) => {
			runInAction(() => {
				this.isPlaying = false;
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
			this.audio.pause();
		} else {
			this.audio.play();
		}
		this.isPlaying = !this.isPlaying;
	}

	toggleMute() {
		this.audio.muted = !this.audio.muted;
		this.isMuted = !this.isMuted;
	};

	setVolume(vol: number) {
		this.audio.volume = vol
		this.volume = vol
	}
	setProgress(time: number) {
		this.audio.currentTime = time
		this.seek = time
	}

	skip(increment: number) {
		this.skipToIndex(this.songIndex + increment)
	}
	skipToIndex(index: number) {
		this.songIndex = index;
		this.audio.src = this.currentSong.src;
		this.audio.load();
	}
	playAtIndex(index: number) {
		this.skipToIndex(index);
		this.delayedPlay();
	}
	delayedPlay(ms: number = 500) {
		setTimeout(() => {
			this.audio.play()
		}, ms)
	}

	get songCount() {
		return this.songList.length;
	}

	get currentSong() {
		return this.songList[this.songIndex];
	}
}

interface SongListProps {
	songs: Array<Song>;
}

interface SongEntryProps {
	song: Song;
	index: number;
}

const SongEntry = observer(({ song, index }: SongEntryProps) => {
	const icons = useContext(iconsContext)
	const store = useContext(playerStoreContext)

	return (
		<div className='flex bg-slate-900 border-slate-700 border-b-2 px-4 py-1 text-left '>
			<button
				onClick={() => {
					if (store.songIndex != index) {
						store.skipToIndex(index);
						store.audio.play()
					} else {
						store.togglePlay();
					}
				}}
			>
				{(store.songIndex == index && store.isPlaying) ? icons.pause : icons.play}
			</button>
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
	const store = useContext(playerStoreContext)

	return (
		<div>
			<img
				className='object-cover'
				src={store.currentSong.album.imgSrc}
				alt={store.currentSong.album.title}
			/>
			<div className='bg-slate-900 text-slate-400 p-3 relative'>

				<ProgressBar
					className='[&_.slider-track]:rounded-none'
				/>
				<SongTitle title={store.currentSong.title} artist={store.currentSong.artist} />
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