import ToggleButton from "./toggleButton"
import './transportControls.css'
import { IoPlay, IoPause } from "react-icons/io5";
import { Slider } from "./ui/slider";
import { useState } from "react";

interface PlayButtonProps {
    onClick: React.MouseEventHandler;
    isPlaying: boolean;
    isDisabled?: boolean;
}
export function PlayButton({ onClick, isPlaying, isDisabled }: PlayButtonProps) {
    return (
        <div className='flex items-center gap-3 justify-self-center'>
            <ToggleButton
                onClick={onClick}
                toggleState={!isPlaying}
                isDisabled={isDisabled}
                iconOn={<IoPlay />}
                iconOff={<IoPause />}
            />
        </div>
    )
}

interface ProgressBarProps {
    className?: string
    duration: number;
    currentProgress: number;
    onPointerUp: (val: number) => void;
    onValueChange: (val: number) => void;
}
export function ProgressBar({ duration, currentProgress, onValueChange, onPointerUp, className }: ProgressBarProps) {
    const [seekValue, setSeekValue] = useState(0)

    return (
        <div className="absolute h-1 -top-[6px] left-0 right-0">
            <Slider
                className={className}
                min={0}
                max={duration}
                value={[currentProgress]}
                onValueChange={(val: number[]) => {
                    setSeekValue(val[0])
                    onValueChange(val[0])
                }}
                onPointerUp={() => onPointerUp(seekValue)}
            />
        </div>
    )

}