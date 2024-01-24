import React, { useRef, useState } from 'react';
import { PlayButton, ProgressBar } from './transportControls';
import { VolumeSlider, MuteButton, VolumeControls } from './volumeControls';
import './player.css'


interface AudioPlayerProps {
    currentSong?: { title: string; artist: string; src: string; },
}

export default function AudioPlayer(props: AudioPlayerProps) {
    const { currentSong } = props

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
        <>
            <div className=' bg-slate-900 text-slate-400 p-3 relative'>
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

                <SongTitle title={currentSong?.title} artist={currentSong?.artist} />
                <div className="grid grid-cols-2 items-center mt-4">
                    {/* Transport controls */}
                    <div>
                        <PlayButton
                            onClick={togglePlayPause}
                            isPlaying={isPlaying}
                            isDisabled={!isReady}
                        />
                        <ProgressBar
                            className='[&>span]:rounded-b-none'
                            duration={duration}
                            currentProgress={currrentProgress}
                            onValueChange={setCurrrentProgress}
                            onPointerUp={(val: number) => {
                                if (!audioRef.current) return;
                                audioRef.current.currentTime = val;
                            }}
                        />
                    </div>
                    {/* Volume controls */}
                    <div className='flex  gap-2 items-center xxl:justify-self-end'>
                        <MuteButton
                            isMuted={isMuted}
                            onClick={toggleMuteUnmute}
                            volume={volume}
                        />
                        <VolumeSlider
                            volume={volume}
                            onChange={handleVolumeChange}
                        />
                    </div>
                </div>
            </div>
        </>
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