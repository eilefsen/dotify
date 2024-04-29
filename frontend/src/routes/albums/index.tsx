import { playerStoreContext } from "@/components/player";
import { Album } from "@/components/player/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, createFileRoute, useLoaderData } from "@tanstack/react-router";
import axios from "axios";
import { observer } from "mobx-react-lite";
import { ReactNode, useContext } from "react";

export const Route = createFileRoute("/albums/")({
	component: Albums,
	loader: async (params) => {
		const res = await axios.get(`/api/${params.location.pathname}`);
		return res.data;
	},
	pendingComponent: () => <PendingAlbums amount={5} />,
	pendingMs: 100,
	pendingMinMs: 200,
});

interface PendingAlbumsProps {
	amount: number;
}

export function PendingAlbums(props: PendingAlbumsProps) {
	const albumLines: ReactNode[] = [];
	for (let i = 0; i < props.amount; i++) {
		albumLines.push(
			<div className="skeleton-album flex h-20 w-full items-center border-b border-secondary p-2">
				<Skeleton className="aspect-square h-full rounded" />
				<div className="pl-2">
					<Skeleton className="mb-2 h-3.5 w-40" />
					<div className="flex items-center gap-2">
						<span className="text-sm font-normal text-muted-foreground">
							Album ·{" "}
						</span>
						<Skeleton className="h-3 w-20" />
					</div>
				</div>
			</div>,
		);
	}

	return (
		<>
			<div className="album-list">{albumLines}</div>
		</>
	);
}

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

export const AlbumLine = observer(({ album, to }: AlbumLineProps) => {
	const player = useContext(playerStoreContext);
	var bgColor = "bg-background";
	if (album.id == player.currentSong?.album.id) {
		bgColor = "bg-secondary";
	}

	return (
		<Link
			to={to}
			className={
				"album-line flex h-20 w-full items-center border-b border-secondary p-2 active:bg-secondary" +
				" " +
				bgColor
			}
		>
			<img
				className="aspect-square h-full rounded border border-accent"
				src={album.imgSrc}
				alt={album.title}
			/>
			<div className="pl-2">
				<p className="text-base font-bold text-foreground">{album.title}</p>
				<p className="text-sm font-bold text-muted-foreground">
					<span className="font-normal">Album · </span>
					{album.artist.name}
				</p>
			</div>
		</Link>
	);
});
