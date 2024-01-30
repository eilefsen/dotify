import ToggleButton from "./toggleButton"
import './transportControls.css'
import { iconsContext, playerStoreContext } from "@/App";
import { Slider } from "./ui/slider";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";

export const NextSongButton = observer(() => {
	const icons = useContext(iconsContext)
	const store = useContext(playerStoreContext)
	return (
		<button
			onClick={() => {
				store.skip(1)
			}}
			disabled={store.songIndex === store.songCount - 1}
			aria-label="next song"
		>
			{icons.next}
		</button >
	)
})
export const PrevSongButton = observer(() => {
	const icons = useContext(iconsContext)
	const store = useContext(playerStoreContext)
	return (
		<button
			onClick={() => {
				store.skip(-1)
			}}
			disabled={store.songIndex <= 0}
			aria-label="previous song"
		>
			{icons.prev}
		</button>
	)
})

export const PlayButton = observer(() => {
	const icons = useContext(iconsContext)
	const store = useContext(playerStoreContext)
	return (
		<div className='flex items-center gap-3 justify-self-center'>
			<ToggleButton
				onClick={() => store.togglePlay()}
				toggleState={!store.isPlaying}
				isDisabled={!store.isReady}
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
	const store = useContext(playerStoreContext)

	return (
		<div className="absolute h-1 -top-[6px] left-0 right-0">
			<Slider
				className={className}
				min={0}
				max={store.duration}
				step={0.01}
				value={[store.seek]}
				onValueChange={(val: number[]) => {
					runInAction(() => {
						store.seek = val[0]
					})
				}}
				onPointerUp={() => {
					runInAction(() => {
						store.audio.currentTime = store.seek
					})
				}}
			/>
		</div>
	)
})