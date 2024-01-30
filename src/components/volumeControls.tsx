import { Slider } from "@/components/ui/slider"
import { useContext } from "react";
import { iconsContext, playerStoreContext } from "@/App";
import { observer } from "mobx-react-lite";

export const VolumeSlider = observer(() => {
	const store = useContext(playerStoreContext);
	return (
		<Slider
			min={0}
			max={1}
			step={0.01}
			value={[store.volume]}
			onValueChange={(val: number[]) => store.setVolume(val[0])}
		/>
	)
})


export const MuteButton = observer(() => {
	const store = useContext(playerStoreContext);
	const icons = useContext(iconsContext)
	if (store.volume >= 0.8) {
		var volumeIcon = icons.volumeHigh
	} else if (store.volume >= 0.3) {
		var volumeIcon = icons.volumeMedium
	} else if (store.volume > 0) {
		var volumeIcon = icons.volumeLow
	} else {
		var volumeIcon = icons.volumeMute
	}

	return (
		<div className='flex items-center gap-3 justify-self-center'>
			<button
				onClick={() => {
					store.toggleMute()
				}}
			>
				{store.isMuted ? icons.volumeMute : volumeIcon}
			</button>
		</div>
	)
})