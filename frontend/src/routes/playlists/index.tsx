import {
	Link,
	ReactNode,
	createFileRoute,
	useLoaderData,
} from "@tanstack/react-router";
import axios from "axios";

interface Playlist {
	id: number;
	name: string;
}

export const Route = createFileRoute("/playlists/")({
	component: Playlists,
	loader: async (params) => {
		const res = await axios.get(`/api/${params.location.pathname}`);
		return res.data;
	},
});

export default function Playlists() {
	const playlists = useLoaderData({ strict: true, from: "/playlists/" });

	const playlistLines: ReactNode[] = [];
	for (const p of playlists) {
		playlistLines.push(
			<div key={p.id} className="border-b border-secondary">
				<PlaylistLine playlist={p} to={`/albums/${p.id}`} />
			</div>,
		);
	}

	return (
		<>
			<div className="playlist-list">{playlistLines}</div>
		</>
	);
}

interface PlaylistLineProps {
	playlist: Playlist;
	to: string;
}

export function PlaylistLine(props: PlaylistLineProps) {
	return (
		<Link
			to={props.to}
			className="album-line flex h-20 w-full items-center p-2 active:bg-secondary"
		>
			<div className="pl-2">
				<p className="text-base font-bold text-foreground">
					{props.playlist.name}
				</p>
			</div>
		</Link>
	);
}
