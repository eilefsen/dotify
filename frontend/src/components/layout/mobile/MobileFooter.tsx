import {NextSongButton, PlayButton, PrevSongButton, ProgressBar, playerStoreContext} from "@/components/player";
import {SongTitle} from "@/components/player/status";
import {observer} from "mobx-react-lite";
import {useContext, useState} from "react";

interface BaseFooterProps {
    content: React.ReactNode;
    className?: string;
}

export function BaseFooter({content, className}: BaseFooterProps) {
    return (
        <div className={"z-20 fixed bottom-0 left-0 right-0 bg-black flex" + " " + className} >
            <div className="footer-content w-full h-full">
                {content}
            </div >
        </div>
    );
}

interface PlayerFooterProps {
    onClick: () => void;
}

export const PlayerFooter = observer(function ({onClick}: PlayerFooterProps) {
    const player = useContext(playerStoreContext);
    const el = (
        <div className="player px-12 w-full h-full text-xl text-center">
            <button onClick={onClick} className="w-64 h-64 py-2 mx-auto">
                <img
                    src={player.currentSong?.album.imgSrc}
                    alt={player.currentSong?.album.title}
                />
            </button>
            <SongTitle title={player.currentSong.title} artist={player.currentSong.artist.name} />

            <Transport />
        </div>
    );
    return (
        <BaseFooter content={el} className="top-14" />
    );
});

function Transport() {
    return (
        <span className="transport-controls flex align-middle mx-auto justify-center gap-4 px-5 pb-2">
            <PrevSongButton />
            <PlayButton />
            <NextSongButton />
        </span>
    );
}

export const LibraryFooter = observer(() => {
    const player = useContext(playerStoreContext);

    function onClick() {
        player.isVisible = !player.isVisible;
    }

    return (
        <>
            {!player.isVisible && (
                <div className="z-20 fixed bottom-0 left-0 right-0 bg-black flex" >
                    <div className="absolute top-0 left-0 right-0 h-1">
                        <ProgressBar
                            className='[&_.slider-track]:rounded-none [&_.slider-thumb]:hidden'
                        />
                    </div>
                    <div className="flex items-center w-full pt-0.5 px-1">
                        <button disabled={player.isEmpty} onClick={onClick} className="w-full" >
                            <SongInfo />
                        </button>
                        <div className="ml-auto">
                            <PlayButton />
                        </div>
                    </div>
                </div >
            )}
        </>
    );
});


const SongInfo = observer(function () {
    const player = useContext(playerStoreContext);
    return (
        <div className="song-info w-full h-full flex items-center pr-2">
            {player.currentSong &&
                <>
                    <img
                        src={player.currentSong.album.imgSrc}
                        alt={`${player.currentSong.album.artist} - ${player.currentSong.album.title}`}
                        className="w-16 h-16 aspect-square"
                    />
                </>
            }
            <div className="w-full h-20 flex items-center pl-2">
                <SongTitle
                    title={player.currentSong?.title}
                    artist={player.currentSong?.artist.name}
                />
            </div>
        </div >
    );
});
