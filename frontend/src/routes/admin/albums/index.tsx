import { Album, ArtistNoID } from "@/components/player/types";
import {
	ReactNode,
	createFileRoute,
	useLoaderData,
	useRouter,
} from "@tanstack/react-router";
import axios from "axios";
import { AlbumLine } from "@/routes/albums";
import { PiTrashFill } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { DeleteDialog } from "@/components/deleteDialog";

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

	const router = useRouter();

	const mutation = useMutation({
		mutationKey: ["deleteAlbum"],
		mutationFn: async (id: string) => {
			const res = await axios.delete(`/api/admin/albums/${id}`);
			return res;
		},
		onSuccess: () => {
			router.invalidate();
		},
	});

	props.albums.forEach((album) => {
		albumLines.push(
			<div className="flex items-center gap-2" key={album.id}>
				<AlbumLine album={album} to={`/admin/albums/${album.id}`} />
				<DeleteDialog
					kind="album"
					name={album.title}
					onClick={() => mutation.mutate(album.id)}
				/>
			</div>,
		);
	});

	return <div className="album-list">{albumLines}</div>;
}
