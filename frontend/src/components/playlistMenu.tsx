import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronRightIcon, ListPlus, SquarePlusIcon } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Playlist, Song } from "./player/types";
import { useRouter } from "@tanstack/react-router";

interface PlaylistMenuProps {
	song: Song;
}
export function PlaylistMenu(props: PlaylistMenuProps) {
	const result = useQuery({
		queryKey: ["playlists"],
		queryFn: async (): Promise<Playlist[]> => {
			const res = await axios.get("/api/playlists");
			return res.data;
		},
		initialData: [],
	});

	interface AddSongMutationData {
		playlist: Playlist;
		song: Song;
	}

	const router = useRouter();

	const addSongMutation = useMutation({
		mutationKey: ["addPlaylistSong", props.song],
		mutationFn: async (data: AddSongMutationData) => {
			axios.post(
				`/api/playlists/${data.playlist.id}/songs/add/${data.song.id}`,
			);
		},
		onSuccess: () => {
			router.invalidate();
		},
	});

	interface NewPlaylistMutationData {
		name: string;
		song: Song;
	}

	const newPlaylistMutation = useMutation({
		mutationKey: ["newPlaylist"],
		mutationFn: async (data: NewPlaylistMutationData) => {
			const playlistRes = await axios.post(`/api/playlists/new`, data);
			const playlist: Playlist = playlistRes.data;
			await axios.post(
				`/api/playlists/${playlist.id}/songs/add/${data.song.id}`,
			);
		},
		onSuccess: () => {
			router.invalidate();
		},
	});

	const menuItems: React.ReactNode[] = [];
	for (const p of result.data) {
		const el = (
			<DropdownMenuItem
				className="flex gap-1"
				onClick={() =>
					addSongMutation.mutate({ playlist: p, song: props.song })
				}
				key={p.id}
			>
				<ChevronRightIcon size={16} />
				{p.name}
			</DropdownMenuItem>
		);
		menuItems.push(el);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<ListPlus className="hover:text-primary active:text-primary" />
			</DropdownMenuTrigger>
			<DropdownMenuContent
				side="bottom"
				align="start"
				className="mr-4 max-h-56 max-w-48 overflow-scroll"
			>
				<DropdownMenuLabel>Add to playlist</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="flex gap-1"
					onClick={() =>
						newPlaylistMutation.mutate({
							name: props.song.title,
							song: props.song,
						})
					}
				>
					<SquarePlusIcon size={16} />
					New Playlist
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				{menuItems}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
