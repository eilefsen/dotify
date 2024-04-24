import { Song } from "@/components/player";
import { SongTable } from "@/components/songList";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import axios from "axios";

export const Route = createFileRoute("/songs")({
	component: () => <Songs />,
	loader: async (params) => {
		const res = await axios.get(`/api/${params.location.pathname}`);
		return res.data;
	},
});

export default function Songs() {
	const songs: Song[] = useLoaderData({ from: "/songs", strict: true });
	console.debug(songs);
	return <SongTable songs={songs} albumIndexing={false} />;
}

