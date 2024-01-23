import { ChangeEventHandler, MouseEventHandler, PointerEventHandler, useRef, useState } from 'react';
import ReactHowler, { HowlCallback } from 'react-howler'

import { Button } from "@/components/ui/button"

import { PlayIcon } from '@heroicons/react/24/solid'
import { PauseIcon } from '@heroicons/react/24/solid'
import { Slider } from './ui/slider';

export default function Player() {
    const player = useRef<ReactHowler>(null);
    const soundSource = "/sound.m4a"
    const [volume, setVolume] = useState(0.7)
    const [seek, setSeek] = useState(0)
    const [playing, setPlaying] = useState(false)

    function togglePlay() {
        setPlaying(!playing)
    }

    return (
        <>
            <ReactHowler
                src={soundSource}
                playing={playing}
                volume={volume}
                ref={player}
            />
            <PlayButton
                onClick={togglePlay}
                playing={playing}
            />
            <VolumeSlider
                onVolumeChange={setVolume}
                volume={volume}
            />
            <SeekSlider
                seek={seek}
                onSeekChange={setSeek}
                onPointerUp={() => player.current?.seek(seek)}
            />
        </>
    )
}

type PlayButtonProps = {
    onClick: MouseEventHandler,
    playing: boolean
}

function PlayButton({ onClick, playing }: PlayButtonProps) {
    if (playing) {
        var icon = <PauseIcon className='h-6 w-6' />
    } else {
        var icon = <PlayIcon className='h-6 w-6' />
    }
    return (
        <Button onClick={onClick}>
            {icon}
        </Button>
    )
}


type VolumeSliderProps = {
    onVolumeChange: (value: number) => void,
    volume: number,
}

function VolumeSlider({ onVolumeChange, volume }: VolumeSliderProps) {
    return (
        <Slider
            onValueChange={(val) => onVolumeChange(val[0])}
            value={[volume]}
            max={1}
            min={0}
            step={0.001} />
    )
}
type SeekSliderProps = {
    seek: number,
    onSeekChange: (value: number) => void,
    onPointerUp: PointerEventHandler,
}

function SeekSlider({ seek, onSeekChange, onPointerUp, }: SeekSliderProps) {
    return (
        <Slider
            onValueChange={(val) => onSeekChange(val[0])}
            onPointerUp={onPointerUp}
            value={[seek]}
            min={0}
            step={0.01} />
    )
}