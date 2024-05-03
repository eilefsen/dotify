import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ListPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Playlist } from "./player/types";

export function PlaylistMenu() {
	const result = useQuery({
		queryKey: ["playlists"],
		queryFn: async (): Promise<Playlist[]> => {
			const res = await axios.get("/api/playlists");
			return res.data;
		},
		initialData: [],
	});

	const menuItems: React.ReactNode[] = [];

	for (const p of result.data) {
		const el = <DropdownMenuItem key={p.id}>{p.name}</DropdownMenuItem>;
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
