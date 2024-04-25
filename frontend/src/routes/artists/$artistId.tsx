import { Artist, Album } from "@/components/player/types";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import Albums from "../albums";
import axios from "axios";

export const Route = createFileRoute("/artists/$artistId")({
	component: () => <Artist />,
	loader: async (params): Promise<ArtistWithAlbums> => {
		const artistRes = await axios.get(`/api/${params.location.pathname}`);
		const albumsRes = await axios.get(
			`/api/albums/artist/${params.params.artistId}`,
		);
		return { artist: artistRes.data, albums: albumsRes.data };
	},
});

export interface ArtistWithAlbums {
	artist: Artist;
	albums: Album[];
}

export function Artist() {
	const data: ArtistWithAlbums = useLoaderData({
		from: "/artists/$artistId",
		strict: true,
	});
	return (
		<div className="artist-page">
			<div className="mx-auto max-w-xs p-6 text-center sm:max-w-sm">
				<img className="w-full" src={data.artist.imgSrc} />
				<h2 className="mt-2 text-5xl font-bold sm:text-6xl">
					{data.artist.name}
				</h2>
				<a
					className="text-neutral-300 underline underline-offset-2"
					href={data.artist.website}
				>
					{data.artist.website}
				</a>
			</div>
			<div className="border-t border-neutral-700">
				<Albums albums={data.albums} />
			</div>
		</div>
	);
}
