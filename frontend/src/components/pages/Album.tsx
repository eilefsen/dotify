import {useLoaderData} from "react-router-dom";
import {SongTable} from "../songList";
import {iconsContext, playerStoreContext} from "../player";
import {useContext} from "react";
import {AlbumWithSongs} from "../player/types";
import {observer} from "mobx-react-lite";


export default function AlbumContent() {
    const album = useLoaderData() as AlbumWithSongs;
    console.debug("Album:", album);

    return (
        <div className="w-full overflow-hidden py-2">
            <div className="px-4 flex items-center">
                <AlbumPlayButton album={album} />
                <div className="flex items-center">
                    <div className="pl-4 h-full w-full">
                        <div className="text-3xl font-bold">
                            {album.title}
                        </div>
                        <div className="pl-1 text-neutral-400 text-2xl font-medium">
                            {album.artist.name}
                        </div>
                    </div>
                </div>
            </div>
            <SongTable songs={album.songs} albumIndexing={true} />
        </div >
    );
}

interface albumPlayButtonProps {
    album: AlbumWithSongs;
}

const AlbumPlayButton = observer(({album}: albumPlayButtonProps) => {
    const player = useContext(playerStoreContext);
    const icons = useContext(iconsContext);

    function toggleIcon() {
        if (player.currentSong == undefined) {
            return icons.playOutline;
        }
        if (player.currentSong.album.id == album.id && player.isPlaying) {
            return icons.pauseOutline;
        } else {
            return icons.playOutline;
        }
    }
    const btnIcon = toggleIcon();

    return (
        <div className="w-48 grid relative justify-items-center items-center rounded-lg overflow-hidden">
            <img
                className='aspect-square w-full h-full col-start-1 row-start-1 brightness-95'
                src={album.imgSrc}
                alt={album.title}
            />
            <button
                className={"w-full h-full col-start-1 row-start-1 drop-shadow-lg flex justify-center items-center active:backdrop-brightness-95 hover:backdrop-brightness-95 [&>svg]:hover:text-current active:text-white hover:text-white text-neutral-100"}
                onClick={() => {
                    if (player.currentSong == undefined || (player.currentSong.album.id != album.id)) {
                        player.clearSongs();
                        player.loadSongs(album.songs);
                        player.skipToIndex(0);
                        player.play();
                    } else {
                        player.togglePlay();
                    }
                }}
            >
                {btnIcon}
            </button>
        </div>
    );
});
