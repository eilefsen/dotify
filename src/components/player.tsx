import { ReactNode, useRef, useState } from 'react';
import { PlayButton, NextSongButton, PrevSongButton, ProgressBar } from './transportControls';
import { VolumeSlider, MuteButton } from './volumeControls';
import './player.css'
import { createContext } from 'react';
import { makeAutoObservable } from "mobx";

export const audioIsPlayingContext = createContext([false, () => { }]);
export const audioIsMutedContext = createContext(null);
export const audioVolumeContext = createContext(0.7);
export const audioDurationContext = createContext(0);
export const AudioPogressContext = createContext(0);

class PlayerStore {
	isPlaying = false;
	isMuted = false;
	volume = 0.7;
	duration = 0;
	progress = 0;
	audioRef;

	constructor(audioRef?: React.MutableRefObject<HTMLAudioElement>) {
		makeAutoObservable(this, {
			audioRef: false,
		});
		if (audioRef) {
			this.audioRef = audioRef;
		}
	}
	togglePlayPause() {
		if (this.audioRef?.current) {
			if (this.isPlaying) {
				this.audioRef.current.pause();
			} else {
				this.audioRef.current.play();
			}
		}
		this.isPlaying = !this.isPlaying;
	}

	toggleMuteUnmute() {
		if (this.audioRef?.current) {
			this.audioRef.current.muted = !this.audioRef.current.muted;
		}
		this.isMuted = !this.isMuted;
	};

	handleVolumeChange(volumeValue: number) {
		if (this.audioRef?.current) {
			this.audioRef.current.volume = volumeValue
		}
		this.volume = volumeValue
	}
}

const playerStore = new PlayerStore()

interface Song {
	title: string;
	artist: string;
	album: {
		title: string;
		imgSrc: string;
	};
	src: string;
}

interface SongListProps {
	songs: Array<Song>;
}

interface SongEntryProps {
	song: Song;
}

function SongEntry({ song }: SongEntryProps) {
	return (
		<div className='bg-slate-900 border-slate-500 border-b-2 px-4 py-1 text-left'>
			<span>
				<span className='text-slate-300 font-bold text-base'>
					{song.title}
				</span>
				<span> - </span>
				<span className='text-slate-400 font-bold text-sm'>
					{song.artist}
				</span>
			</span>
		</div>
	)
}

export function SongList({ songs }: SongListProps) {

	const songElements: Array<ReactNode> = []
	songs.forEach((song) => {
		const songElement = <SongEntry song={song} />
		songElements.push(songElement)
	})

	return (
		<div className=' min-w-fit p-2'>
			{songElements}
		</div>
	)
}

interface AudioPlayerProps {
	currentSong?: Song;
	onPrev: () => void;
	onNext: () => void;
}

export default function AudioPlayer(props: AudioPlayerProps) {
	const { currentSong, onPrev, onNext } = props

	const audioRef = useRef<HTMLAudioElement | null>(null);

	// States
	const [isReady, setIsReady] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false)
	const [isMuted, setIsMuted] = useState(false)
	const [volume, setVolume] = useState(0.7)
	const [duration, setDuration] = useState(0)
	const [currrentProgress, setCurrrentProgress] = useState(0);


	function togglePlayPause() {
		if (isPlaying) {
			audioRef.current?.pause()
			setIsPlaying(false)
		} else {
			audioRef.current?.play()
			setIsPlaying(true)
		}
	}
	const toggleMuteUnmute = () => {
		if (!audioRef.current) return;
		setIsMuted(!audioRef.current.muted)
		audioRef.current.muted = !audioRef.current.muted
	};

	function handleVolumeChange(volumeValue: number) {
		if (!audioRef.current) return;
		audioRef.current.volume = volumeValue
		setVolume(volumeValue)
	}


	return (
		<div>
			<img
				className='object-cover'
				src={currentSong?.album.imgSrc}
				alt={currentSong?.album.title}
			/>
			<div className='bg-slate-900 text-slate-400 p-3 relative'>
				<audio
					ref={audioRef}
					preload='metadata'
					onDurationChange={(e) => setDuration(e.currentTarget.duration)}
					onCanPlay={(e) => {
						e.currentTarget.volume = volume
						setIsReady(true)
					}}
					onPlaying={() => setIsPlaying(true)}
					onPause={() => setIsPlaying(false)}
					onTimeUpdate={(e) => {
						setCurrrentProgress(e.currentTarget.currentTime)
					}}
				>
					<source type='audio/mpeg' src={currentSong?.src} />
				</audio>

				<ProgressBar
					className='[&_.slider-track]:rounded-none'
					duration={duration}
					currentProgress={currrentProgress}
					onValueChange={setCurrrentProgress}
					onPointerUp={(val: number) => {
						if (!audioRef.current) return;
						audioRef.current.currentTime = val;
					}}
				/>
				<SongTitle title={currentSong?.title} artist={currentSong?.artist} />
				<div className="grid grid-cols-2 items-center mt-4">
					{/* Transport controls */}
					<span className='flex'>
						<PrevSongButton
							onClick={onPrev}
						/>
						<PlayButton
							onClick={togglePlayPause}
							isPlaying={isPlaying}
							isDisabled={!isReady}
						/>
						<NextSongButton
							onClick={onNext}
						/>
					</span>
					{/* Volume controls */}
					<span className='flex gap-2 items-center xxl:justify-self-end'>
						<MuteButton
							isMuted={isMuted}
							onClick={toggleMuteUnmute}
							volume={volume}
						/>
						<VolumeSlider
							volume={volume}
							onChange={handleVolumeChange}
						/>
					</span>
				</div >
			</div>
		</div>
	)
}


interface SongTitleProps {
	title?: string
	artist?: string
}

function SongTitle({ title, artist }: SongTitleProps) {
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
}
