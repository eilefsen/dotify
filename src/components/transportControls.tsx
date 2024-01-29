import ToggleButton from "./toggleButton"
import './transportControls.css'
import { iconsContext } from "@/App";
import { Slider } from "./ui/slider";
import { useContext, useState } from "react";

interface NextSongButtonProps {
	onClick: React.MouseEventHandler;
	isDisabled?: boolean;
}
interface PrevSongButtonProps extends NextSongButtonProps { }

export function NextSongButton({ onClick, isDisabled }: NextSongButtonProps) {
	const icons = useContext(iconsContext)
	return (
		<button
			onClick={onClick}
			disabled={isDisabled}
			role="next song"
		>
			{icons.next}
		</button>
	)
}
export function PrevSongButton({ onClick, isDisabled }: PrevSongButtonProps) {
	const icons = useContext(iconsContext)
	return (
		<button
			onClick={onClick}
			disabled={isDisabled}
			role="previous song"
		>
			{icons.prev}
		</button>
	)
}

interface PlayButtonProps {
	onClick: React.MouseEventHandler;
	isPlaying: boolean;
	isDisabled?: boolean;
}
export function PlayButton({ onClick, isPlaying, isDisabled }: PlayButtonProps) {
	const icons = useContext(iconsContext)
	return (
		<div className='flex items-center gap-3 justify-self-center'>
			<ToggleButton
				onClick={onClick}
				toggleState={!isPlaying}
				isDisabled={isDisabled}
				iconOn={icons.play}
				iconOff={icons.pause}
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
				step={0.01}
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