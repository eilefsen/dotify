import { ReactNode, useContext } from "react";
import { CoverImg, playerStoreContext } from "../player";
import { Link, useLoaderData } from "react-router-dom";
import { Album } from "../player/types";
import { observer } from "mobx-react-lite";

interface AlbumsProps {
	albums?: Album[];
}

export default function Albums(props: AlbumsProps) {
	const albumLines: ReactNode[] = [];
	let albums;
	if (props.albums) {
		albums = props.albums;
	} else {
		albums = useLoaderData() as Album[];
	}
	console.debug(albums);
	albums.forEach((album) => {
		albumLines.push(
			<AlbumLine key={album.id} album={album} to={`/album/${album.id}`} />,
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

interface AlbumCardProps {
	title: string;
	artist: string;
	imgSrc: string;
	to: string;
}

function AlbumCard({ title, artist, imgSrc, to }: AlbumCardProps) {
	return (
		<Link
			to={to}
			className="album-card w-48 overflow-hidden rounded-2xl bg-white"
		>
			<CoverImg src={imgSrc} alt={title} />
			<div className="px-6 py-1.5 font-bold">
				<h4 className="text-xl text-black">{title}</h4>
				<h5 className="text-neutral-800 ">{artist}</h5>
			</div>
		</Link>
	);
}
