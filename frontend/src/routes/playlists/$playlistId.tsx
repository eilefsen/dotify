import {
	createFileRoute,
	useLoaderData,
	useRouter,
} from "@tanstack/react-router";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Playlist, Song } from "@/components/player/types";
import { PendingSongTable, SongTable } from "@/components/songList";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { LoginForm } from "../login";

interface PlaylistWithSongs {
	playlist: Playlist;
	songs: Song[];
}

export const Route = createFileRoute("/playlists/$playlistId")({
	component: PlaylistContent,
	loader: async (params): Promise<PlaylistWithSongs> => {
		const playlistRes = await axios.get(`/api/${params.location.pathname}`, {
			validateStatus: function (status) {
				return status < 500; // Resolve only if the status code is less than 500
			},
		});
		const songsRes = await axios.get(
			`/api/playlists/${params.params.playlistId}/songs`,
			{
				validateStatus: function (status) {
					return status < 500; // Resolve only if the status code is less than 500
				},
			},
		);
		return { playlist: playlistRes.data, songs: songsRes.data };
	},
	pendingComponent: PendingPlaylistContent,
	pendingMs: 100,
	pendingMinMs: 200,
});

function PendingPlaylistContent() {
	return (
		<div className="w-full overflow-hidden py-2">
			<div className="flex items-center px-4">
				<div className="h-full w-full px-4">
					<Skeleton className="mb-1.5 mt-3 h-7 w-44" />
				</div>
			</div>
			<PendingSongTable />
		</div>
	);
}

export function PlaylistContent() {
	const loginResult = useQuery({
		queryKey: ["loginStatus"],
		enabled: false,
		initialData: false,
	});

	const router = useRouter();

	useEffect(() => {
		router.invalidate();
	}, [loginResult.data]);

	const data = useLoaderData({ strict: true, from: "/playlists/$playlistId" });

	if (!loginResult.data) {
		return <LoginForm />;
	}

	return (
		<div className="w-full overflow-hidden py-2">
			<div className="flex items-center px-4">
				<div className="h-full w-full pl-4">
					<div className="text-3xl font-bold">{data.playlist.name}</div>
				</div>
			</div>
			<SongTable songs={data.songs} albumIndexing={false} />
		</div>
	);
}
