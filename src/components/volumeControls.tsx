import { IoVolumeHigh, IoVolumeMedium, IoVolumeLow, IoVolumeMute } from "react-icons/io5";
import ToggleButton from "./toggleButton";
import { Slider } from "@/components/ui/slider"

interface VolumeControlsProps {
    volume: number;
    isMuted: boolean;
    onVolumeChange: (value: number) => void;
    onMuteClick: () => void;
}
export function VolumeControls({ volume, isMuted, onVolumeChange, onMuteClick }: VolumeControlsProps) {
    return (
        <>
            <MuteButton onClick={onMuteClick} volume={volume} isMuted={isMuted} />
            <VolumeSlider
                className=""
                onChange={onVolumeChange}
                volume={volume}
            />
        </>
    )

}

type VolumeSliderProps = {
    volume: number,
    onChange: (value: number) => void,
    className?: string
}

export function VolumeSlider({ volume, onChange, className }: VolumeSliderProps) {
    return (
        <Slider
            className={className}
            min={0}
            max={1}
            step={0.05}
            value={[volume]}
            onValueChange={(val: number[]) => onChange(val[0])}
        />
    )
}


interface MuteButtonProps {
    onClick: React.MouseEventHandler;
    isMuted: boolean;
    volume: number
    className?: string
}

export function MuteButton({ onClick, isMuted, volume, className }: MuteButtonProps) {
    if (volume >= 0.8) {
        var volumeIcon = <IoVolumeHigh />
    } else if (volume >= 0.3) {
        var volumeIcon = <IoVolumeMedium />
    } else if (volume > 0) {
        var volumeIcon = <IoVolumeLow />
    } else {
        var volumeIcon = <IoVolumeMute />
    }

    return (
        <div className='flex items-center gap-3 justify-self-center'>
            <ToggleButton
                className={className}
                onClick={onClick}
                toggleState={isMuted}
                iconOn={<IoVolumeMute />}
                iconOff={volumeIcon}
            />
        </div>
    )
}