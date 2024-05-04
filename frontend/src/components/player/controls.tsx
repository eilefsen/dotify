import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";

import { Slider } from "@/components/ui/slider";
import ToggleButton from "@/components/ui/toggleButton";

import { iconsContext, playerStoreContext } from "./context";
import { SliderProps } from "@radix-ui/react-slider";

interface SkipSongButtonProps {
	className?: string;
}

export const NextSongButton = observer(({ className }: SkipSongButtonProps) => {
	const icons = useContext(iconsContext);
	const player = useContext(playerStoreContext);
	return (
		<button
			onClick={() => {
				player.skip(1);
				player.play();
			}}
			disabled={player.songIndex === player.songCount - 1}
			aria-label="next song"
			className={className}
		>
			{icons.next}
		</button>
	);
});
export const PrevSongButton = observer(({ className }: SkipSongButtonProps) => {
	const icons = useContext(iconsContext);
	const player = useContext(playerStoreContext);
	return (
		<button
			onClick={() => {
				player.skip(-1);
				player.play();
			}}
			disabled={player.songIndex <= 0}
			aria-label="previous song"
			className={className}
		>
			{icons.prev}
		</button>
	);
});

export const PlayButton = observer(() => {
	const icons = useContext(iconsContext);
	const player = useContext(playerStoreContext);
	return (
		<div className="flex items-center gap-3 justify-self-center">
			<ToggleButton
				onClick={() => player.togglePlay()}
				toggleState={!player.isPlaying}
				isDisabled={!player.isReady}
				iconOn={icons.play}
				iconOff={icons.pause}
			/>
		</div>
	);
});

interface ProgressBarProps extends SliderProps {}

export const ProgressBar = observer(({ className }: ProgressBarProps) => {
	const player = useContext(playerStoreContext);
	const [localVal, setLocalVal] = useState(0);
	const [mouseDown, setMouseDown] = useState(false);

	return (
		<Slider
			className={className}
			min={0}
			max={player.duration}
			step={0.01}
			value={mouseDown ? [localVal] : [player.seek]}
			onPointerDown={() => setMouseDown(true)}
			onPointerUp={() => setMouseDown(false)}
			onValueChange={(val) => {
				setLocalVal(val[0]);
			}}
			onValueCommit={(val) => {
				runInAction(() => {
					player.setProgress(val[0]);
				});
			}}
		/>
	);
});

export const VolumeSlider = observer(() => {
	const player = useContext(playerStoreContext);
	return (
		<Slider
			min={0}
			max={1}
			step={0.01}
			value={[player.volume]}
			onValueChange={(val: number[]) => player.setVolume(val[0])}
		/>
	);
});

export const MuteButton = observer(() => {
	const player = useContext(playerStoreContext);
	const icons = useContext(iconsContext);
	if (player.volume >= 0.8) {
		var volumeIcon = icons.volumeHigh;
	} else if (player.volume >= 0.3) {
		var volumeIcon = icons.volumeMedium;
	} else if (player.volume > 0) {
		var volumeIcon = icons.volumeLow;
	} else {
		var volumeIcon = icons.volumeMute;
	}

	return (
		<div className="flex items-center gap-3 justify-self-center">
			<button
				onClick={() => {
					player.toggleMute();
				}}
			>
				{player.isMuted ? icons.volumeMute : volumeIcon}
			</button>
		</div>
	);
});
