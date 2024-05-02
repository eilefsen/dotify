import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Playlist, Song } from "@/components/player/types";
import { PendingSongTable, SongTable } from "@/components/songList";

interface PlaylistWithSongs {
	playlist: Playlist;
	songs: Song[];
}

export const Route = createFileRoute("/playlists/$playlistId")({
	component: PlaylistContent,
	loader: async (params): Promise<PlaylistWithSongs> => {
		const playlistRes = await axios.get(`/api/${params.location.pathname}`, {
			validateStatus: function (status) {
				return status == 200 || status == 401; // Resolve only if the status code is less than 500
			},
		});
		const songsRes = await axios.get(
			`/api/playlists/${params.params.playlistId}/songs`,
			{
				validateStatus: function (status) {
					return status == 200 || status == 401; // Resolve only if the status code is less than 500
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
	const data = useLoaderData({ strict: true, from: "/playlists/$playlistId" });
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
