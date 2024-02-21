import {useLoaderData} from "react-router-dom";
import {SongTable} from "../songList";
import {CoverImg, iconsContext, playerStoreContext} from "../player";
import {useContext} from "react";
import {AlbumWithSongs} from "../player/types";
import {observer} from "mobx-react-lite";


export default function AlbumContent() {
    const album = useLoaderData() as AlbumWithSongs;
    console.debug("Album:", album);

    return (
        <div className="w-full overflow-hidden py-2">
            <div className="px-4">
                <div className="flex items-center">
                    <div className="w-48">
                        <CoverImg src={album.imgSrc} alt={album.title} />
                    </div>
                    <div className="pl-4 h-full w-4/5">
                        <div className="text-3xl font-bold">
                            {album.title}
                        </div>
                        <div className="pl-1 text-neutral-400 text-2xl font-medium">
                            {album.artist.name}
                        </div>
                    </div>
                </div>
                <div className="w-fit mx-auto">
                    <AlbumPlayButton album={album} />
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
            return icons.play;
        }
        if (player.currentSong.album.id == album.id && player.isPlaying) {
            return icons.pause;
        } else {
            return icons.play;
        }
    }
    const btnIcon = toggleIcon();

    return (
        <button
            className={"w-3 hover:text-white text-neutral-400"}
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
    );
});
