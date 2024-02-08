import {useParams} from "react-router-dom";
import {SongList} from "../songList";
import {albums} from "@/testData";
import {CoverImg, Song, iconsContext} from "../player";
import {useContext} from "react";
import {IconContext} from "react-icons";
import {Album} from "../player/types";


export default function AlbumContent() {
    const icons = useContext(iconsContext);
    const params = useParams();
    var album: Album = {
        id: 0,
        title: "",
        artist: "",
        imgSrc: "",
        songs: [],
    };
    albums.forEach((a) => {
        if (a.id == parseInt(params.albumId!)) {
            album = a;
        }
    });
    return (
        <div className="w-full rounded-2xl border-white border overflow-hidden py-2">
            <div className="w-64 p-8 flex items-center">
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
            <table className="w-full table-fixed">
                <colgroup>
                    <col className="w-12" />
                    <col />
                    <col className="w-16" />
                </colgroup>
                <thead>
                    <tr className="text-left text-lg h-11 text-neutral-300 border-b border-neutral-600">
                        <th className="pl-5">
                            #
                        </th>
                        <th>
                            Title
                        </th>
                        <th className="pr-5">
                            <IconContext.Provider value={{className: "ml-auto"}}>
                                {icons.timer}
                            </IconContext.Provider>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <SongList songs={album.songs} />
                </tbody>
            </table>
        </div >
    );
}
