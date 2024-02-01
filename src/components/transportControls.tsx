import ToggleButton from "./toggleButton"
import './transportControls.css'
import { iconsContext, playerStoreContext } from "@/App";
import { Slider } from "./ui/slider";
import { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";

export const NextSongButton = observer(() => {
	const icons = useContext(iconsContext)
	const player = useContext(playerStoreContext)
	return (
		<button
			onClick={() => {
				player.skip(1)
			}}
			disabled={player.songIndex === player.songCount - 1}
			aria-label="next song"
		>
			{icons.next}
		</button >
	)
})
export const PrevSongButton = observer(() => {
	const icons = useContext(iconsContext)
	const player = useContext(playerStoreContext)
	return (
		<button
			onClick={() => {
				player.skip(-1)
			}}
			disabled={player.songIndex <= 0}
			aria-label="previous song"
		>
			{icons.prev}
		</button>
	)
})

export const PlayButton = observer(() => {
	const icons = useContext(iconsContext)
	const player = useContext(playerStoreContext)
	return (
		<div className='flex items-center gap-3 justify-self-center'>
			<ToggleButton
				onClick={() => player.togglePlay()}
				toggleState={!player.isPlaying}
				isDisabled={!player.isReady}
				iconOn={icons.play}
				iconOff={icons.pause}
			/>
		</div>
	)
})

interface ProgressBarProps {
	className?: string
}

export const ProgressBar = observer(({ className }: ProgressBarProps) => {
	const player = useContext(playerStoreContext);
	const [localVal, setLocalVal] = useState(0);
	const [mouseDown, setMouseDown] = useState(false);

	return (
		<div className="absolute h-1 -top-[6px] left-0 right-0">
			<Slider
				className={className}
				min={0}
				max={player.duration}
				step={0.01}
				value={mouseDown ? [localVal] : [player.seek]}
				onPointerDown={() => setMouseDown(true)}
				onPointerUp={() => setMouseDown(false)}
				onValueChange={(val) => {
					setLocalVal(val[0])
				}}
				onValueCommit={(val) => {
					runInAction(() => {
						player.setProgress(val[0])
					})
				}}
			/>
		</div>
	)
})