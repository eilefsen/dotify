import {
	NextSongButton,
	PlayButton,
	PrevSongButton,
	ProgressBar,
	playerStoreContext,
} from "@/components/player";
import { observer } from "mobx-react-lite";
import React from "react";
import { useContext } from "react";
import { OverflowMarquee } from "../overflowMarquee";

interface BaseFooterProps {
	content: React.ReactNode;
	className?: string;
}

export function BaseFooter({ content, className }: BaseFooterProps) {
	return (
		<div
			className={
				"fixed bottom-0 left-0 right-0 z-20 flex bg-background" +
				" " +
				className
			}
		>
			<div className="footer-content h-full w-full">{content}</div>
		</div>
	);
}

export const Footer = observer(() => {
	const player = useContext(playerStoreContext);

	function onClick() {
		player.isVisible = !player.isVisible;
	}

	return (
		<div className="fixed bottom-0 left-0 right-0 z-20 bg-background">
			<div className="absolute left-0 right-0 top-0 h-1">
				<ProgressBar className="[&_.slider-thumb]:hidden [&_.slider-track]:rounded-none" />
			</div>
			<div className="grid w-full grid-cols-5 items-center justify-between px-4 py-2">
				<button
					disabled={player.isEmpty}
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
			<div></div>
		</div>
	);
});

const SongInfo = observer(function () {
	const player = useContext(playerStoreContext);

	return (
		<div className="song-info flex h-20 w-full items-center gap-2 pr-2">
			{player.currentSong && (
				<img
					src={player.currentSong.album.imgSrc}
					alt={`${player.currentSong.album.artist} - ${player.currentSong.album.title}`}
					className="aspect-square h-16 w-16 rounded border border-border"
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
