import {useParams} from "react-router-dom";
import {SongList} from "../songList";
import {albums} from "@/testData";
import {Song} from "../player";


export default function AlbumContent() {
    const params = useParams();
    let songs: Song[] = [];
    albums.forEach((album) => {
        if (album.id == parseInt(params.albumId!)) {
            songs = album.songs;
        }
    });
    return (
        <>
            <SongList songs={songs} />
        </>
    );
}
