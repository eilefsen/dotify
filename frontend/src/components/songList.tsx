import {observer} from "mobx-react-lite";
import {useContext, useRef, ReactNode} from "react";
import {useHoverDirty} from "react-use";
import {VscBlank} from "react-icons/vsc";

import {Song, iconsContext, playerStoreContext} from "./player";
import {icons} from "@/icons";
import {IconContext} from "react-icons";

interface SongListProps {
    songs: Array<Song>;
}

interface SongEntryProps {
    song: Song;
    index: number;
}

interface songTableProps {
    songs: Song[];
}

export function SongTable({songs}: songTableProps) {
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
                <SongList songs={songs} />
            </tbody>
        </table>
    );
}

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

    const hoverRef = useRef(null);
    const isHovering = useHoverDirty(hoverRef);
    const btnIcon = toggleIcon();

    return (
        <tr ref={hoverRef} className='w-full h-14 bg-neutral-950 hover:bg-neutral-900 border-neutral-800 border-b'>
            <td className="pl-5">
                <button
                    className={"w-3 hover:text-white text-neutral-400"}
                    onClick={() => {
                        if (player.currentSong?.id != song.id) {
                            player.loadSong(song);
                            player.play();
                        } else {
                            player.togglePlay();
                        }
                    }}
                >
                    {isHovering ? btnIcon : index + 1}
                </button>
            </td>
            <td className='pl-2'>
                <div className='text-neutral-300 font-bold text-base'>
                    {song.title}
                </div>
                <div className='text-neutral-400 font-bold text-sm'>
                    {song.artist}
                </div>
            </td>
            <td className='pr-5 text-neutral-400 font-bold text-sm text-right'>
                {song.duration}
            </td>
        </tr >
    );
});

export const SongList = observer(({songs}: SongListProps) => {
    const songElements: Array<ReactNode> = [];
    songs.forEach((song, i) => {
        const songElement = <SongEntry key={i} song={song} index={i} />;
        songElements.push(songElement);
    });

    return (
        <>
            {songElements}
        </>
    );
});
