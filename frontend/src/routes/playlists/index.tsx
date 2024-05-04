import { Playlist } from "@/components/player/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
	Link,
	ReactNode,
	createFileRoute,
	useLoaderData,
	useRouter,
} from "@tanstack/react-router";
import axios from "axios";
import { ListMusic } from "lucide-react";
import { useEffect } from "react";
import { DeleteDialog } from "@/components/deleteDialog";
import { OverflowMarquee } from "@/components/overflowMarquee";
import { LoginDialog } from "@/components/loginDialog";

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
			<div className="playlist-list">{playlistLines}</div>
			<LoginDialog open={!loginResult.data} />
		</>
	);
}

interface PlaylistLineProps {
	playlist: Playlist;
	to: string;
}

export function PlaylistLine(props: PlaylistLineProps) {
	const router = useRouter();
	const deleteMutation = useMutation({
		mutationKey: ["deletePlaylist", props.playlist],
		mutationFn: async () => {
			await axios.delete(`/api/playlists/${props.playlist.id}`);
		},
		onSuccess: () => {
			router.invalidate();
		},
	});

	return (
		<div className="flex items-center justify-between px-2">
			<Link
				to={props.to}
				className="playlist-line flex h-20 w-full items-center gap-5 px-5 active:bg-secondary"
			>
				<ListMusic size={32} />
				<div className="flex w-0 min-w-0 flex-1 flex-col">
					<OverflowMarquee>
						<h3 className="contents text-base font-bold text-foreground">
							{props.playlist.name}
						</h3>
					</OverflowMarquee>
					<p className="text-sm font-normal text-muted-foreground">Playlist</p>
				</div>
			</Link>
			<DeleteDialog
				kind="Playlist"
				name={props.playlist.name}
				onClick={() => deleteMutation.mutate()}
			/>
		</div>
	);
}
