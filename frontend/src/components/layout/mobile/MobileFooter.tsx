import {PlayButton, ProgressBar, playerStoreContext} from "@/components/player";
import {SongTitle} from "@/components/player/status";
import {observer} from "mobx-react-lite";
import {useContext} from "react";

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
                        <button disabled={player.isEmpty} onClick={onClick} className="w-full text-left" >
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
