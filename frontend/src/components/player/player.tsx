import { observer } from "mobx-react-lite";
import { useContext } from "react";

import { playerStoreContext } from "./context";
import {
	MuteButton,
	NextSongButton,
	PlayButton,
	PrevSongButton,
	ProgressBar,
	VolumeSlider,
} from "./controls";
import { SongTitle } from "./status";
import { Link } from "@tanstack/react-router";
import { isMobile } from "react-device-detect";

export const AudioPlayer = observer(() => {
	const player = useContext(playerStoreContext);

	function onClick() {
		player.isVisible = !player.isVisible;
	}

	return (
		<div className="player flex h-full w-full items-center justify-center px-12 text-center text-xl">
			<div className="flex w-full max-w-xl flex-col gap-4 self-center">
				<Link
					to={`/albums/${player.currentSong.album.id}`}
					onClick={onClick}
					className="mx-auto h-64 w-64"
				>
					<img
						src={player.currentSong?.album.imgSrc}
						alt={player.currentSong?.album.title}
					/>
				</Link>
				<SongTitle
					title={player.currentSong.title}
					artist={player.currentSong.artist.name}
				/>
				<ProgressBar />
				{!isMobile && (
					<div className="flex gap-2">
						<MuteButton />
						<VolumeSlider />
					</div>
				)}
				<Transport />
			</div>
		</div>
	);
});

function Transport() {
	return (
		<span className="transport-controls mx-auto flex justify-center gap-4 px-5 pb-2 align-middle">
			<PrevSongButton />
			<PlayButton />
			<NextSongButton />
		</span>
	);
}
