import { Link, createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute("/artists/")({
	component: () => <Artists />,
});
import { ReactNode, useContext } from "react";
import { observer } from "mobx-react-lite";
import { playerStoreContext, CoverImg } from "@/components/player";
import { ArtistWithImg } from "@/components/player/types";

export default function Artists() {
	const artistLines: ReactNode[] = [];
	const artists = useLoaderData({ strict: true, from: "/artists/" });
	console.debug(artists);
	artists.forEach((artist) => {
		artistLines.push(
			<ArtistLine
				key={artist.id}
				artist={artist}
				to={`/artist/${artist.id}`}
			/>,
		);
	});

	return <div className="album-list">{artistLines}</div>;
}

interface ArtistLineProps {
	artist: ArtistWithImg;
	to: string;
}

const ArtistLine = observer(({ artist, to }: ArtistLineProps) => {
	const player = useContext(playerStoreContext);
	var bgColor = "bg-neutral-950";
	if (artist.id == player.currentSong?.artist.id) {
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

interface artistCardProps {
	name: string;
	imgSrc: string;
	to: string;
}

function ArtistCard({ name, imgSrc, to }: artistCardProps) {
	return (
		<Link
			to={to}
			className="album-card w-48 overflow-hidden rounded-2xl bg-white"
		>
			<CoverImg src={imgSrc} alt={name} />
			<div className="px-6 py-1.5 font-bold">
				<h4 className="text-xl text-black">{name}</h4>
			</div>
		</Link>
	);
}

