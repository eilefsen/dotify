import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ListPlus } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Playlist, Song } from "./player/types";

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

	interface MutationData {
		playlist: Playlist;
		song: Song;
	}

	const mutation = useMutation({
		mutationKey: ["addPlaylistSong"],
		mutationFn: async (data: MutationData) => {
			axios.post(
				`/api/playlists/${data.playlist.id}/songs/add/${data.song.id}`,
			);
		},
	});

	const menuItems: React.ReactNode[] = [];
	for (const p of result.data) {
		const el = (
			<DropdownMenuItem
				onClick={() => mutation.mutate({ playlist: p, song: props.song })}
				key={p.id}
			>
				{p.name}
			</DropdownMenuItem>
		);
		menuItems.push(el);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<ListPlus />
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Add to playlist</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{menuItems}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
