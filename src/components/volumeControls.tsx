import { Slider } from "@/components/ui/slider"
import { useContext } from "react";
import { iconsContext, playerStoreContext } from "@/App";
import { observer } from "mobx-react-lite";

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
	)
})


export const MuteButton = observer(() => {
	const player = useContext(playerStoreContext);
	const icons = useContext(iconsContext)
	if (player.volume >= 0.8) {
		var volumeIcon = icons.volumeHigh
	} else if (player.volume >= 0.3) {
		var volumeIcon = icons.volumeMedium
	} else if (player.volume > 0) {
		var volumeIcon = icons.volumeLow
	} else {
		var volumeIcon = icons.volumeMute
	}

	return (
		<div className='flex items-center gap-3 justify-self-center'>
			<button
				onClick={() => {
					player.toggleMute()
				}}
			>
				{player.isMuted ? icons.volumeMute : volumeIcon}
			</button>
		</div>
	)
})