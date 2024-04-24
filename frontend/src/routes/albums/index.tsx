import { Link, createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute("/albums/")({
	component: () => <Albums />,
	loader: async (params) => {
		const res = await axios.get(`/api/${params.location.pathname}`);
		return res.data;
	},
});

import { ReactNode, useContext } from "react";
import { observer } from "mobx-react-lite";
import { playerStoreContext } from "@/components/player";
import { Album } from "@/components/player/types";
import axios from "axios";

interface AlbumsProps {
	albums?: Album[];
}

export default function Albums(props: AlbumsProps) {
	let albums: Album[];
	if (props.albums) {
		albums = props.albums;
	} else {
		albums = useLoaderData({ strict: true, from: "/albums/" });
	}
	console.debug(albums);

	const albumLines: ReactNode[] = [];
	albums.forEach((album) => {
		albumLines.push(
			<AlbumLine key={album.id} album={album} to={`/albums/${album.id}`} />,
		);
	});

	return (
		<>
			<div className="album-list">{albumLines}</div>
		</>
	);
}

interface AlbumLineProps {
	album: Album;
	to: string;
}

const AlbumLine = observer(({ album, to }: AlbumLineProps) => {
	const player = useContext(playerStoreContext);
	var bgColor = "bg-neutral-950";
	if (album.id == player.currentSong?.album.id) {
		bgColor = "bg-neutral-900";
	}

	return (
		<Link
			to={to}
			className={
				"album-line flex h-16 w-full items-center border-b border-neutral-900 p-1 active:bg-neutral-800" +
				" " +
				bgColor
			}
		>
			<img
				className="aspect-square h-full rounded border border-neutral-300"
				src={album.imgSrc}
				alt={album.title}
			/>
			<div className="pl-2">
				<p className="text-base font-bold text-neutral-50">{album.title}</p>
				<p className="text-sm font-bold text-neutral-400">
					<span className="font-normal">Album · </span>
					{album.artist.name}
				</p>
			</div>
		</Link>
	);
});
