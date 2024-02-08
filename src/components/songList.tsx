import {observer} from "mobx-react-lite";
import {useContext, useRef, ReactNode} from "react";
import {useHoverDirty} from "react-use";
import {VscBlank} from "react-icons/vsc";

import {Song, iconsContext, playerStoreContext} from "./player";

interface SongListProps {
    songs: Array<Song>;
}

interface SongEntryProps {
    song: Song;
    index: number;
}

const SongEntry = observer(({song, index}: SongEntryProps) => {
    const icons = useContext(iconsContext);
    const store = useContext(playerStoreContext);
    function toggleIcon() {
        if (store.currentSong == song && store.isPlaying) {
            return icons.pauseSmall;
        } else {
            return icons.playSmall;
        }
    }
    function hoverIcon(isHovering: boolean) {
        if (isHovering) {
            if (store.currentSong == song) {
                return toggleIcon();
            }
            return icons.playSmall;
        }
        return <VscBlank size={icons.iconSize} />;
    }


    const hoverRef = useRef(null);
    const isHovering = useHoverDirty(hoverRef);
    const btnIcon = hoverIcon(isHovering);


    return (
        <tr ref={hoverRef} className='w-full h-14 bg-neutral-950 hover:bg-neutral-900 border-neutral-800 border-b'>
            <td className="pl-5">
                <button
                    className={"w-3 hover:text-white text-neutral-400"}
                    onClick={() => {
                        if (store.currentSong != song) {
                            store.loadSong(song);
                            store.play();
                        } else {
                            store.togglePlay();
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
