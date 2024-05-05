import { observer } from "mobx-react-lite";
import { useContext } from "react";
import {
	playerStoreContext,
	ProgressBar,
	PrevSongButton,
	PlayButton,
	NextSongButton,
} from ".";
import { OverflowMarquee } from "../overflowMarquee";

export const MiniPlayer = observer(() => {
	const player = useContext(playerStoreContext);

	function onClick() {
		player.toggleVisible();
	}

	return (
		<div className="relative">
			<div className="absolute bottom-0 left-0 right-0 h-1">
				<ProgressBar className="[&_.slider-thumb]:hidden [&_.slider-track]:h-px [&_.slider-track]:rounded-none [&_.slider-track]:bg-foreground/60" />
			</div>
			<div className="grid w-full grid-cols-5 items-center justify-between px-4 pb-2 pt-0.5">
				<button
					disabled={!player.isReady}
					onClick={onClick}
					className="col-span-4 text-left"
				>
					<SongInfo />
				</button>
				<Controls disabled={!player.isReady} />
			</div>
		</div>
	);
});

interface ControlsProps {
	disabled?: boolean;
}

function Controls(props: ControlsProps) {
	if (!!props.disabled) {
		return;
	}
	return (
		<div className="col-span-1 flex h-full justify-end gap-3">
			<PrevSongButton className="hidden sm:block" />
			<PlayButton />
			<NextSongButton className="hidden sm:block" />
		</div>
	);
}

const SongInfo = observer(function () {
	const player = useContext(playerStoreContext);

	return (
		<div className="song-info flex h-14 w-full items-center gap-2 pr-2">
			{player.currentSong && (
				<img
					src={player.currentSong.album.imgSrc}
					alt={`${player.currentSong.album.artist} - ${player.currentSong.album.title}`}
					className="aspect-square h-14 rounded border border-border"
				/>
			)}
			<div className="block w-full min-w-0">
				<div className="font-bold text-foreground">
					<OverflowMarquee>
						{player.currentSong?.title || "No Song playing"}
					</OverflowMarquee>
				</div>
				{player.currentSong?.artist.name && (
					<OverflowMarquee className="font-light text-foreground/80">
						{player.currentSong?.artist.name}
					</OverflowMarquee>
				)}
			</div>
		</div>
	);
});
