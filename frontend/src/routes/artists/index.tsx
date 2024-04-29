import { Link, createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute("/artists/")({
	component: () => <Artists />,
	loader: async (params) => {
		const res = await axios.get(`/api/${params.location.pathname}`);
		return res.data;
	},
	pendingComponent: PendingArtists,
	pendingMs: 100,
	pendingMinMs: 200,
});

import { ReactNode, useContext } from "react";
import { observer } from "mobx-react-lite";
import { playerStoreContext } from "@/components/player";
import { Artist } from "@/components/player/types";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

function PendingArtists() {
	const albumLines: ReactNode[] = [];
	for (let i = 0; i < 5; i++) {
		albumLines.push(
			<div className="skeleton-album flex h-20 w-full items-center border-b border-primary p-2">
				<Skeleton className="aspect-square h-full rounded-full" />
				<div className="pl-2">
					<Skeleton className="mb-2 h-3.5 w-40" />
					<p className="text-sm font-normal text-muted-foreground">Artist</p>
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

interface ArtistProps {
	artists?: Artist[];
}

export default function Artists(props: ArtistProps) {
	let artists: Artist[];
	if (props.artists) {
		artists = props.artists;
	} else {
		artists = useLoaderData({
			strict: true,
			from: "/artists/",
		});
	}

	const artistLines: ReactNode[] = [];
	artists.forEach((artist) => {
		artistLines.push(
			<div className="border-b border-border" key={artist.id}>
				<ArtistLine artist={artist} to={`/artists/${artist.id}`} />
			</div>,
		);
	});

	return <div className="album-list">{artistLines}</div>;
}

interface ArtistLineProps {
	artist: Artist;
	to: string;
}

export const ArtistLine = observer(({ artist, to }: ArtistLineProps) => {
	const player = useContext(playerStoreContext);
	var bgColor = "bg-background";
	if (artist.id == player.currentSong?.artist.id) {
		bgColor = "bg-secondary";
	}

	return (
		<Link
			to={to}
			className={
				"album-line flex h-20 w-full items-center p-2 active:bg-secondary" +
				" " +
				bgColor
			}
		>
			<img
				className="aspect-square h-full rounded-full border border-border"
				src={artist.imgSrc}
				alt={artist.name}
			/>
			<div className="pl-2">
				<p className="text-base font-bold text-foreground">{artist.name}</p>
				<p className="text-sm font-normal text-muted-foreground">Artist</p>
			</div>
		</Link>
	);
});
