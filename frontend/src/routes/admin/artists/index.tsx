import {
	ReactNode,
	createFileRoute,
	useLoaderData,
	useRouter,
} from "@tanstack/react-router";
import axios from "axios";
import { ArtistLine } from "../../artists";
import { Artist } from "@/components/player/types";
import { useMutation } from "@tanstack/react-query";
import { DeleteDialog } from "@/components/deleteDialog";

export const Route = createFileRoute("/admin/artists/")({
	component: ArtistAdmin,
	loader: async () => {
		const res = await axios.get(`/api/artists`);
		return res.data;
	},
});

function ArtistAdmin() {
	const artists: Artist[] = useLoaderData({ from: "/admin/artists/" });
	return (
		<div className="pt-2">
			<ArtistsList artists={artists} />
		</div>
	);
}

interface ArtistsListProps {
	artists: Artist[];
}

function ArtistsList(props: ArtistsListProps) {
	const artistLines: ReactNode[] = [];

	const router = useRouter();

	const mutation = useMutation({
		mutationKey: ["deleteArtist"],
		mutationFn: async (id: string) => {
			const res = await axios.delete(`/api/admin/artists/${id}`);
			return res;
		},
		onSuccess: () => {
			router.invalidate();
		},
	});

	props.artists.forEach((artist) => {
		artistLines.push(
			<div className="flex items-center gap-2" key={artist.id}>
				<ArtistLine artist={artist} to={`/admin/artists/${artist.id}`} />
				<DeleteDialog
					kind="artist"
					name={artist.name}
					onClick={() => mutation.mutate(artist.id)}
				/>
			</div>,
		);
	});

	return <div className="album-list">{artistLines}</div>;
}
