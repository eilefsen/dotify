import {useLoaderData, useParams} from "react-router-dom";
import {SongTable} from "../songList";
import {CoverImg, PlayButton, Song, iconsContext, playerStoreContext} from "../player";
import {useContext} from "react";
import {Album} from "../player/types";
import {observer} from "mobx-react-lite";


export default function AlbumContent() {
    const params = useParams();
    const album = useLoaderData() as Album;
    console.debug("Album:", album);

    return (
        <>
            <h2 className="text-5xl py-3">Album</h2>
            <div className="w-full rounded-2xl border-white border overflow-hidden py-2">
                <div className="w-64 px-8 py-4 flex items-center">
                    <CoverImg src={album.imgSrc} alt={album.title} />
                    <div className="pl-6 h-full">
                        <div className="text-6xl font-bold">
                            {album.title}
                        </div>
                        <div className="pl-1 text-neutral-400 text-2xl font-medium">
                            {album.artist}
                        </div>
                    </div>
                </div>
                <div className="pl-8">
                    <AlbumPlayButton album={album} />
                </div>
                <SongTable songs={album.songs} />
            </div >
        </>
    );
}

interface albumPlayButtonProps {
    album: Album;
}

const AlbumPlayButton = observer(({album}: albumPlayButtonProps) => {
    const player = useContext(playerStoreContext);
    const icons = useContext(iconsContext);

    function toggleIcon() {
        if (player.currentSong == undefined) {
            return icons.play;
        }
        if (player.currentSong.albumId == album.id && player.isPlaying) {
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
                if (player.currentSong == undefined || (player.currentSong.albumId != album.id)) {
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
