import {
	NextSongButton,
	PlayButton,
	PrevSongButton,
	ProgressBar,
	playerStoreContext,
} from "@/components/player";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { OverflowMarquee } from "../overflowMarquee";
import { NavBar } from "../navbar";

export const MiniPlayer = observer(() => {
	const player = useContext(playerStoreContext);

	function onClick() {
		player.toggleVisible();
	}

	return (
		<div className="relative">
			<div className="absolute bottom-0 left-0 right-0 h-1">
				<ProgressBar className="[&_.slider-thumb]:hidden [&_.slider-track]:h-px [&_.slider-track]:rounded-none [&_.slider-track]:bg-muted-foreground" />
			</div>
			<div className="grid w-full grid-cols-5 items-center justify-between px-4 pb-3 pt-2">
				<button
					disabled={!player.isReady}
					onClick={onClick}
					className="col-span-4 text-left"
				>
					<SongInfo />
				</button>
				<div className="col-span-1 flex h-full justify-end gap-3">
					<PrevSongButton className="hidden sm:block" />
					<PlayButton />
					<NextSongButton className="hidden sm:block" />
				</div>
			</div>
		</div>
	);
});

export function Footer() {
	return (
		<div className="fixed bottom-0 left-0 right-0 h-[9.5rem] border-t border-t-border bg-secondary shadow-sm shadow-black -shadow-y-0.5 shadow-blur-3">
			<MiniPlayer />
			<NavBar />
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
					<div className="overflow-x-hidden font-light text-muted-foreground">
						{player.currentSong?.artist.name}
					</div>
				)}
			</div>
		</div>
	);
});
