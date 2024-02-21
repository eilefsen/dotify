import {useLoaderData} from "react-router-dom";
import {SongTable} from "../songList";
import {Song} from "../player";

export default function Songs() {
    const songs = useLoaderData() as Song[];
    console.debug(songs);
    return (
        <SongTable songs={songs} albumIndexing={false} />
    );
}
