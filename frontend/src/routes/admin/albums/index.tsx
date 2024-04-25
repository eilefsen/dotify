import { Album } from "@/components/player/types";
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
		const res = await axios.get(`/api/albums`);
		return res.data;
	},
});

function AlbumAdmin() {
	const albums: Album[] = useLoaderData({ from: "/admin/albums/" });
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
	const albumLines: ReactNode[] = [];
	props.albums.forEach((album) => {
		console.log(album);
		albumLines.push(
			<AlbumLine
				key={album.id}
				album={album}
				to={`/admin/albums/${album.id}`}
			/>,
		);
	});

	return <div className="album-list">{albumLines}</div>;
}
