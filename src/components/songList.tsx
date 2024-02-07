import {observer} from "mobx-react-lite";
import {useContext, useRef, ReactNode} from "react";
import {useHoverDirty} from "react-use";
import {IconContext} from "react-icons";
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
        if (store.songIndex == index && store.isPlaying) {
            return icons.pause;
        } else {
            return icons.play;
        }
    }
    function hoverIcon(isHovering: boolean) {
        if (isHovering) {
            if (store.songIndex == index) {
                return toggleIcon();
            }
            return icons.play;
        } else if (store.songIndex == index) {
            return icons.equalizer;
        }
        return <VscBlank size={icons.iconSize} />;
    }


    const hoverRef = useRef(null);
    const isHovering = useHoverDirty(hoverRef);
    const btnIcon = hoverIcon(isHovering);


    return (
        <button
            ref={hoverRef}
            className={`w-full block`}
            onClick={() => {
                if (store.songIndex != index) {
                    store.skipToIndex(index);
                    store.play();
                } else {
                    store.togglePlay();
                }
            }}
        >
            <div className='flex bg-slate-900 hover:bg-slate-800 border-slate-700 border-b-2 px-4 py-1 text-left'>
                <IconContext.Provider value={isHovering ? {className: "text-slate-500"} : {className: "text-slate-600"}}>
                    {btnIcon}
                </IconContext.Provider>
                <span className=' pl-2 pt-1'>
                    <span className='text-slate-300 font-bold text-base'>
                        {song.title}
                    </span>
                    <span> - </span>
                    <span className='text-slate-400 font-bold text-sm'>
                        {song.artist}
                    </span>
                </span>
            </div >
        </button>
    );
});

export const SongList = observer(({songs}: SongListProps) => {

    const songElements: Array<ReactNode> = [];
    songs.forEach((song, i) => {
        const songElement = <SongEntry key={i} song={song} index={i} />;
        songElements.push(songElement);
    });

    return (
        <div className=' bg-slate-950 min-w-fit'>
            {songElements}
        </div>
    );
});
