import { Artist, Album } from "@/components/player/types";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import Albums, { PendingAlbums } from "../albums";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/artists/$artistId")({
	component: ArtistContent,
	loader: async (params): Promise<ArtistWithAlbums> => {
		const artistRes = await axios.get(`/api/${params.location.pathname}`);
		const albumsRes = await axios.get(
			`/api/albums/artist/${params.params.artistId}`,
		);
		return { artist: artistRes.data, albums: albumsRes.data };
	},
	pendingComponent: PendingArtistContent,
	pendingMs: 100,
	pendingMinMs: 200,
});

function PendingArtistContent() {
	return (
		<div className="artist-page">
			<div className="mx-auto max-w-xs p-6 text-center sm:max-w-sm">
				<Skeleton className="aspect-square w-full" />
				<Skeleton className="mx-auto mb-2 mt-3 h-9 w-3/4 sm:h-[3.75rem]" />
				<Skeleton className="mx-auto h-4 w-3/5" />
			</div>
			<div className="border-t border-border">
				<PendingAlbums amount={3} />
			</div>
		</div>
	);
}

export interface ArtistWithAlbums {
	artist: Artist;
	albums: Album[];
}

export function ArtistContent() {
	const data: ArtistWithAlbums = useLoaderData({
		from: "/artists/$artistId",
		strict: true,
	});
	return (
		<div className="artist-page">
			<div className="mx-auto max-w-xs p-6 text-center sm:max-w-sm">
				<img className="w-full" src={data.artist.imgSrc} />
				<h2 className="mt-2 text-4xl font-extrabold sm:text-6xl">
					{data.artist.name}
				</h2>
				<a
					className="text-base font-normal text-foreground underline underline-offset-2"
					href={data.artist.website}
					target="_blank"
				>
					{data.artist.website}
				</a>
			</div>
			<div className="border-t border-primary">
				<Albums albums={data.albums} />
			</div>
		</div>
	);
}
