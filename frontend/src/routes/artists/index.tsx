import { Link, createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute("/artists/")({
	component: () => <Artists />,
	loader: async (params) => {
		const res = await axios.get(`/api/${params.location.pathname}`);
		return res.data;
	},
});

import { ReactNode, useContext } from "react";
import { observer } from "mobx-react-lite";
import { playerStoreContext, CoverImg } from "@/components/player";
import { Artist } from "@/components/player/types";
import axios from "axios";

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
			<ArtistLine
				key={artist.id}
				artist={artist}
				to={`/artists/${artist.id}`}
			/>,
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
	var bgColor = "bg-neutral-950";
	if (artist.id == player.currentSong?.artist.id) {
		bgColor = "bg-neutral-900";
	}

	return (
		<Link
			to={to}
			className={
				"album-line flex h-20 w-full items-center border-b border-neutral-900 p-2 active:bg-neutral-800" +
				" " +
				bgColor
			}
		>
			<img
				className="aspect-square h-full rounded-full border border-neutral-300"
				src={artist.imgSrc}
				alt={artist.name}
			/>
			<div className="pl-2">
				<p className="text-base font-bold text-neutral-50">{artist.name}</p>
				<p className="text-sm font-normal text-neutral-400">Artist</p>
			</div>
		</Link>
	);
});
