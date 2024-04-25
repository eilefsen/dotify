import {
	ReactNode,
	createFileRoute,
	useLoaderData,
} from "@tanstack/react-router";
import axios from "axios";
import { ArtistLine } from "../../artists";
import { ArtistWithImg } from "@/components/player/types";

export const Route = createFileRoute("/admin/artists/")({
	component: ArtistAdmin,
	loader: async () => {
		const res = await axios.get(`/api/artists`);
		return res.data;
	},
});

function ArtistAdmin() {
	const artists: ArtistWithImg[] = useLoaderData({ from: "/admin/artists/" });
	return (
		<div className="pt-2">
			<ArtistsList artists={artists} />
		</div>
	);
}

interface ArtistsListProps {
	artists: ArtistWithImg[];
}

function ArtistsList(props: ArtistsListProps) {
	const artistLines: ReactNode[] = [];
	props.artists.forEach((artist) => {
		artistLines.push(
			<ArtistLine
				key={artist.id}
				artist={artist}
				to={`/admin/artists/${artist.id}`}
			/>,
		);
	});

	return <div className="album-list">{artistLines}</div>;
}
