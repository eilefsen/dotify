import { observer } from "mobx-react-lite";
import { useContext, useRef, ReactNode, useEffect } from "react";
import { useHoverDirty } from "react-use";
import { cn, getRandomInt, secondsToMinutesSeconds } from "@/lib/utils";

import { Song, iconsContext, playerStoreContext } from "./player";
import { icons } from "@/icons";
import { Skeleton } from "./ui/skeleton";
import { PlaylistMenu } from "./playlistMenu";
import { useQuery } from "@tanstack/react-query";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";

interface SongListProps {
	songs: Array<Song>;
	albumIndexing: boolean;
}

interface SongEntryProps {
	song: Song;
	index: number;
}

interface songTableProps {
	songs: Song[];
	albumIndexing: boolean;
}

export function PendingSongTable() {
	return (
		<Table>
			<TableHeader>
				<TableHead>#</TableHead>
				<TableHead>Title</TableHead>
				<TableHead>{icons.timer}</TableHead>
			</TableHeader>
			<TableBody>
				<PendingSongList />
			</TableBody>
		</Table>
	);
}
export function PendingSongList() {
	const songElements: Array<ReactNode> = [];

	for (let i = 0; i < 10; i++) {
		const songElement = <PendingSongEntry index={i} key={i} />;
		songElements.push(songElement);
	}

	return <>{songElements}</>;
}

interface PendingSongEntryProps {
	index: number;
}

function PendingSongEntry(props: PendingSongEntryProps) {
	const duration = getRandomInt(80, 300);
	return (
		<tr className="h-14 w-full border-b border-secondary bg-background text-muted-foreground">
			<td className="pl-5">{props.index + 1}</td>
			<td className="pl-2">
				<Skeleton className="my-2 h-4 w-40" />
				<Skeleton className="my-2 h-3 w-20" />
			</td>
			<td className="pr-5 text-right text-sm font-bold text-neutral-400">
				{secondsToMinutesSeconds(duration)}
			</td>
		</tr>
	);
}

export function SongTable({ songs, albumIndexing }: songTableProps) {
	if (!songs) {
		return;
	}

	return (
		<Table>
			<TableHeader>
				<TableRow className="text-lg">
					<TableHead className="w-12 text-foreground">#</TableHead>
					<TableHead className="text-foreground">Title</TableHead>
					<TableHead className="w-16 text-foreground">
						<div className="flex justify-end pr-1">{icons.timer}</div>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<SongList songs={songs} albumIndexing={albumIndexing} />
			</TableBody>
		</Table>
	);
}

const SongEntry = observer(({ song, index }: SongEntryProps) => {
	const icons = useContext(iconsContext);
	const player = useContext(playerStoreContext);
	function toggleIcon() {
		if (player.currentSong?.id == song.id && player.isPlaying) {
			return icons.pauseSmall;
		} else {
			return icons.playSmall;
		}
	}

	const loginResult = useQuery({
		queryKey: ["loginStatus"],
		enabled: false,
		initialData: false,
	});

	var bgColor = "bg-background";
	if (song.id == player.currentSong?.id) {
		bgColor = "bg-hover";
	}

	const hoverRef = useRef(null);
	const isHovering = useHoverDirty(hoverRef);
	const btnIcon = toggleIcon();

	function toggle() {
		if (player.currentSong?.id == song.id) {
			player.togglePlay();
		} else {
			player.skipToID(song.id);
			player.play();
		}
	}

	return (
		<TableRow
			ref={hoverRef}
			className={cn(
				"w-full border-secondary text-foreground/70 hover:text-foreground",
				bgColor,
			)}
		>
			<TableCell className="py-2 text-center" onClick={toggle}>
				{isHovering ? btnIcon : index}
			</TableCell>
			<TableCell className="py-2">
				<div className="flex justify-between gap-2">
					<div className="h-full w-full min-w-0" onClick={toggle}>
						<div className="overflow-x-hidden overflow-ellipsis whitespace-nowrap text-base font-bold text-foreground">
							{song.title}
						</div>
						<div className="text-sm font-bold text-foreground/70">
							{song.artist.name}
						</div>
					</div>
					{loginResult.data && <PlaylistMenu song={song} />}
				</div>
			</TableCell>
			<TableCell className="py-2 text-right text-sm font-bold">
				{secondsToMinutesSeconds(song.duration)}
			</TableCell>
		</TableRow>
	);
});

export const SongList = observer(({ songs, albumIndexing }: SongListProps) => {
	const songElements: Array<ReactNode> = [];
	const player = useContext(playerStoreContext);
	useEffect(() => {
		// TODO: add a less wasteful way of storing songs.
		player.addSongs(songs);
		console.debug(player.songCount);
	}, [songs]);

	songs.forEach((song, i) => {
		const songElement = (
			<SongEntry
				key={i}
				song={song}
				index={albumIndexing ? song.track : i + 1}
			/>
		);
		songElements.push(songElement);
	});

	return <>{songElements}</>;
});
