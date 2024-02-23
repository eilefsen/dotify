import {observer} from "mobx-react-lite";
import {useContext, useRef, ReactNode, useEffect} from "react";
import {useHoverDirty} from "react-use";
import {secondsToMinutesSeconds} from '@/lib/utils';

import {Song, iconsContext, playerStoreContext} from "./player";
import {icons} from "@/icons";
import {IconContext} from "react-icons";

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

export const SongTable = observer(({songs, albumIndexing}: songTableProps) => {
    const player = useContext(playerStoreContext);
    useEffect(() => {
        if (player.songCount > 100) {
            player.songList.splice(0, (player.songCount - 100));
        }
        player.addSongs(songs);
        console.log(player.songCount);
    }, [songs]);
    return (
        <table className="w-full table-fixed">
            <colgroup>
                <col className="w-12" />
                <col />
                <col className="w-16" />
            </colgroup>
            <thead>
                <tr className="text-left text-lg h-11 text-neutral-300 border-b border-neutral-600">
                    <th className="pl-5">
                        #
                    </th>
                    <th>
                        Title
                    </th>
                    <th className="pr-5">
                        <IconContext.Provider value={{className: "ml-auto"}}>
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
});

const SongEntry = observer(({song, index}: SongEntryProps) => {
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
            className={'hover:text-white text-neutral-400 w-full h-14 border-neutral-800 border-b' + " " + bgColor}
            onClick={() => {
                if (player.currentSong?.id == song.id) {
                    player.togglePlay();
                } else {
                    player.skipToID(song.id);
                    player.play();
                }
            }}
        >
            <td className="pl-5">
                {isHovering ? btnIcon : index}
            </td>
            <td className='pl-2'>
                <div className='text-neutral-300 font-bold text-base'>
                    {song.title}
                </div>
                <div className='text-neutral-400 font-bold text-sm'>
                    {song.artist.name}
                </div>
            </td>
            <td className='pr-5 text-neutral-400 font-bold text-sm text-right'>
                {secondsToMinutesSeconds(song.duration)}
            </td>
        </tr >
    );
});

export const SongList = observer(({songs, albumIndexing}: SongListProps) => {
    const songElements: Array<ReactNode> = [];
    songs.forEach((song, i) => {
        const songElement = <SongEntry key={i} song={song} index={albumIndexing ? song.track : i + 1} />;
        songElements.push(songElement);
    });

    return (
        <>
            {songElements}
        </>
    );
});
