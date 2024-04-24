import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/albums/$albumId")({
	component: () => <AlbumContent />,
});

import { useLoaderData } from "react-router-dom";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { playerStoreContext, iconsContext } from "@/components/player";
import { AlbumWithSongs } from "@/components/player/types";
import { SongTable } from "@/components/songList";

export default function AlbumContent() {
	const album = useLoaderData() as AlbumWithSongs;
	console.debug("Album:", album);

	return (
		<div className="w-full overflow-hidden py-2">
			<div className="flex items-center px-4">
				<AlbumPlayButton album={album} />
				<div className="flex items-center">
					<div className="h-full w-full pl-4">
						<div className="text-3xl font-bold">{album.title}</div>
						<div className="pl-1 text-2xl font-medium text-neutral-400">
							{album.artist.name}
						</div>
					</div>
				</div>
			</div>
			<SongTable songs={album.songs} albumIndexing={true} />
		</div>
	);
}

interface albumPlayButtonProps {
	album: AlbumWithSongs;
}

const AlbumPlayButton = observer(({ album }: albumPlayButtonProps) => {
	const player = useContext(playerStoreContext);
	const icons = useContext(iconsContext);

	function toggleIcon() {
		if (player.currentSong == undefined) {
			return icons.playOutline;
		}
		if (player.currentSong.album.id == album.id && player.isPlaying) {
			return icons.pauseOutline;
		} else {
			return icons.playOutline;
		}
	}
	const btnIcon = toggleIcon();

	return (
		<div className="relative grid w-48 items-center justify-items-center overflow-hidden rounded-lg">
			<img
				className="col-start-1 row-start-1 aspect-square h-full w-full brightness-95"
				src={album.imgSrc}
				alt={album.title}
			/>
			<button
				className={
					"col-start-1 row-start-1 flex h-full w-full items-center justify-center text-neutral-100 drop-shadow-lg hover:text-white hover:backdrop-brightness-95 active:text-white active:backdrop-brightness-95 [&>svg]:hover:text-current"
				}
				onClick={() => {
					if (
						player.currentSong == undefined ||
						player.currentSong.album.id != album.id
					) {
						player.clearSongs();
						player.addSongs(album.songs);
						player.skipToIndex(0);
						player.play();
					} else {
						player.togglePlay();
					}
				}}
			>
				{btnIcon}
			</button>
		</div>
	);
});

