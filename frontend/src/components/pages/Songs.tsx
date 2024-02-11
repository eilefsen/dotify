import {useLoaderData} from "react-router-dom";
import {SongTable} from "../songList";
import {Song} from "../player";

export default function Songs() {
    const songs = useLoaderData() as Song[];
    return (
        <>
            <h2 className="text-5xl py-3">Songs</h2>
            <div className="w-full rounded-2xl border-white border overflow-hidden py-2">
                <SongTable songs={songs} />
            </div>
        </>
    );
}

