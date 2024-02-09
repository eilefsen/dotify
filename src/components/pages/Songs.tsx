import {SongTable} from "../songList";
import {allSongs} from "@/testData";

export default function Songs() {
    return (
        <>
            <h2 className="text-5xl py-3">Songs</h2>
            <div className="w-full rounded-2xl border-white border overflow-hidden py-2">
                <SongTable songs={allSongs} />
            </div>
        </>
    );
}

