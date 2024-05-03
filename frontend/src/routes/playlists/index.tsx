import { Playlist } from "@/components/player/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
	Link,
	ReactNode,
	createFileRoute,
	useLoaderData,
	useRouter,
} from "@tanstack/react-router";
import axios from "axios";
import { ListMusic, TrashIcon } from "lucide-react";
import { LoginForm } from "../login";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/playlists/")({
	component: Playlists,
	loader: async (params) => {
		const res = await axios.get(`/api/${params.location.pathname}`, {
			validateStatus: function (status) {
				return status < 500; // Resolve only if the status code is less than 500
			},
		});
		return res.data;
	},
	pendingComponent: PendingPlaylists,
	pendingMs: 100,
	pendingMinMs: 200,
});

function PendingPlaylists() {
	const playlistLines: ReactNode[] = [];
	for (let i = 0; i < 5; i++) {
		playlistLines.push(
			<div className="skeleton-playlist flex h-20 w-full items-center border-b border-primary p-2">
				<ListMusic />
				<div className="pl-2">
					<Skeleton className="mb-2 h-3.5 w-40" />
					<p className="text-sm font-normal text-muted-foreground">Playlist</p>
				</div>
			</div>,
		);
	}

	return (
		<>
			<div className="playlist-list">{playlistLines}</div>
		</>
	);
}

export default function Playlists() {
	const loginResult = useQuery({
		queryKey: ["loginStatus"],
		enabled: false,
		initialData: false,
	});

	const router = useRouter();

	useEffect(() => {
		router.invalidate();
	}, [loginResult.data]);

	const playlists = useLoaderData({ strict: true, from: "/playlists/" });

	const playlistLines: ReactNode[] = [];
	for (const p of playlists) {
		playlistLines.push(
			<div key={p.id} className="border-b border-secondary">
				<PlaylistLine playlist={p} to={`/playlists/${p.id}`} />
			</div>,
		);
	}

	return (
		<>
			{loginResult.data ? (
				<div className="playlist-list">{playlistLines}</div>
			) : (
				<LoginForm />
			)}
		</>
	);
}

interface PlaylistLineProps {
	playlist: Playlist;
	to: string;
}

export function PlaylistLine(props: PlaylistLineProps) {
	return (
		<div className="flex items-center justify-between px-2">
			<Link
				to={props.to}
				className="playlist-line flex h-20 w-full items-center gap-5 active:bg-secondary"
			>
				<div className="w-0"></div>
				<ListMusic size={32} />
				<div>
					<p className="text-base font-bold text-foreground">
						{props.playlist.name}
					</p>
					<p className="text-sm font-normal text-muted-foreground">Playlist</p>
				</div>
			</Link>
			<Button variant="destructiveHover">
				<TrashIcon />
			</Button>
		</div>
	);
}