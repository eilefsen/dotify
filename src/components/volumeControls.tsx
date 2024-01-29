import ToggleButton from "./toggleButton";
import { iconsContext } from "@/App";
import { Slider } from "@/components/ui/slider"
import { useContext } from "react";

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
			step={0.01}
			value={[volume]}
			onValueChange={(val: number[]) => onChange(val[0])}
		/>
	)
}


interface MuteButtonProps {
	onClick: React.MouseEventHandler;
	isMuted: boolean;
	volume: number;
	className?: string;
}

export function MuteButton({ onClick, isMuted, volume, className }: MuteButtonProps) {
	const icons = useContext(iconsContext)
	if (volume >= 0.8) {
		var volumeIcon = icons.volumeHigh
	} else if (volume >= 0.3) {
		var volumeIcon = icons.volumeMedium
	} else if (volume > 0) {
		var volumeIcon = icons.volumeLow
	} else {
		var volumeIcon = icons.volumeMute
	}

	return (
		<div className='flex items-center gap-3 justify-self-center'>
			<ToggleButton
				className={className}
				onClick={onClick}
				toggleState={isMuted}
				iconOn={icons.volumeMute}
				iconOff={volumeIcon}
			/>
		</div>
	)
}