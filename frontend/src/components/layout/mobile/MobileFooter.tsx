import {CoverImg, NextSongButton, PlayButton, PrevSongButton, ProgressBar, playerStoreContext} from "@/components/player";
import {SongTitle} from "@/components/player/status";
import {observer} from "mobx-react-lite";
import {useContext} from "react";

interface BaseFooterProps {
    content: React.ReactNode;
}
export function BaseFooter({content}: BaseFooterProps) {
    return (
        <div className="z-20 h-20 fixed bottom-0 left-0 right-0 bg-black flex" >
            <div className="absolute top-0 left-0 right-0 h-1">
                <ProgressBar
                    className='[&_.slider-track]:rounded-none [&_.slider-thumb]:hidden'
                />
            </div>
            <div className="footer-content px-3 pt-1 flex w-full h-full">
                {content}
            </div >
        </div>
    );
}

export function PlayerFooter() {
    const el = <Transport />;
    return (
        <BaseFooter content={el} />
    );
}

export function LibraryFooter() {
    const el = (
        <>
            <SongInfo />
            <div className="justify-self-end self-center">
                <PlayButton />
            </div>
        </>
    );
    return (
        <BaseFooter content={el} />
    );
}

function Transport() {
    return (
        <span className="transport-controls flex align-middle mx-auto justify-center gap-4 px-5">
            <PrevSongButton />
            <PlayButton />
            <NextSongButton />
        </span>
    );
}

const SongInfo = observer(function () {
    const player = useContext(playerStoreContext);
    return (
        <div className="song-info w-full h-full flex items-center gap-2">
            {player.currentSong && <>
                <div className="w-16">
                    < CoverImg
                        src={player.currentSong.album.imgSrc}
                        alt={`${player.currentSong.album.artist} - ${player.currentSong.album.title}`}
                    />
                </div>
                <div className="w-full min-h-20 flex items-center">
                    <SongTitle
                        title={player.currentSong.title}
                        artist={player.currentSong.artist.name}
                    />
                </div>
            </>
            }
        </div>
    );
});
