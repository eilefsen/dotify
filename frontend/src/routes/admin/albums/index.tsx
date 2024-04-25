import { Album, ArtistWithImg } from "@/components/player/types";
import {
	ReactNode,
	createFileRoute,
	useLoaderData,
} from "@tanstack/react-router";
import axios from "axios";
import { AlbumLine } from "@/routes/albums";

export const Route = createFileRoute("/admin/albums/")({
	component: AlbumAdmin,
	loader: async () => {
		const res = await axios.get(`/api/artists`);
		return res.data;
	},
});

function AlbumAdmin() {
	const albums: Album[] = useLoaderData({ from: "/admin/album/" });
	return (
		<div className="pt-2">
			<AlbumsList albums={albums} />
		</div>
	);
}

interface AlbumsListProps {
	albums: Album[];
}

function AlbumsList(props: AlbumsListProps) {
	const artistLines: ReactNode[] = [];
	props.albums.forEach((album) => {
		artistLines.push(
			<AlbumLine
				key={album.id}
				album={album}
				to={`/admin/albums/${album.id}`}
			/>,
		);
	});

	return <div className="album-list">{artistLines}</div>;
}
