import { observer } from "mobx-react-lite";
import { useContext, useRef, ReactNode, useEffect } from "react";
import { useHoverDirty } from "react-use";
import { getRandomInt, secondsToMinutesSeconds } from "@/lib/utils";

import { Song, iconsContext, playerStoreContext } from "./player";
import { icons } from "@/icons";
import { IconContext } from "react-icons";
import { Skeleton } from "./ui/skeleton";

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
		<table className="w-full table-fixed">
			<colgroup>
				<col className="w-12" />
				<col />
				<col className="w-16" />
			</colgroup>
			<thead>
				<tr className="h-11 border-b border-neutral-600 text-left text-lg text-neutral-300">
					<th className="pl-5">#</th>
					<th>Title</th>
					<th className="pr-5">
						<IconContext.Provider value={{ className: "ml-auto" }}>
							{icons.timer}
						</IconContext.Provider>
					</th>
				</tr>
			</thead>
			<tbody>
				<PendingSongList />
			</tbody>
		</table>
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
		<tr className="h-14 w-full  border-b border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white">
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
	return (
		<table className="w-full table-fixed">
			<colgroup>
				<col className="w-12" />
				<col />
				<col className="w-16" />
			</colgroup>
			<thead>
				<tr className="h-11 border-b border-neutral-600 text-left text-lg text-neutral-300">
					<th className="pl-5">#</th>
					<th>Title</th>
					<th className="pr-5">
						<IconContext.Provider value={{ className: "ml-auto" }}>
							{icons.timer}
						</IconContext.Provider>
					</th>
				</tr>
			</thead>
			<tbody>
				<SongList songs={songs} albumIndexing={albumIndexing} />
			</tbody>
		</table>
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

	var bgColor = "bg-neutral-950";
	if (song.id == player.currentSong?.id) {
		bgColor = "bg-neutral-900";
	}

	const hoverRef = useRef(null);
	const isHovering = useHoverDirty(hoverRef);
	const btnIcon = toggleIcon();

	return (
		<tr
			ref={hoverRef}
			className={
				"h-14 w-full  border-b border-neutral-800 text-neutral-400 hover:text-white" +
				" " +
				bgColor
			}
			onClick={() => {
				if (player.currentSong?.id == song.id) {
					player.togglePlay();
				} else {
					player.skipToID(song.id);
					player.play();
				}
			}}
		>
			<td className="pl-5">{isHovering ? btnIcon : index}</td>
			<td className="pl-2">
				<div className="text-base font-bold text-neutral-300">{song.title}</div>
				<div className="text-sm font-bold text-neutral-400">
					{song.artist.name}
				</div>
			</td>
			<td className="pr-5 text-right text-sm font-bold text-neutral-400">
				{secondsToMinutesSeconds(song.duration)}
			</td>
		</tr>
	);
});

export const SongList = observer(({ songs, albumIndexing }: SongListProps) => {
	const songElements: Array<ReactNode> = [];
	const player = useContext(playerStoreContext);
	useEffect(() => {
		// TODO: add a less wasteful way of storing songs.
		// Perhaps, with react query, an array of song IDs
		// and a hashmap keyed to the database id of the songs
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
