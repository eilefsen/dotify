import {ReactNode} from "react";
import {CoverImg} from "../player";
import {albums} from "@/testData";

export default function Albums() {
    const albumCards: ReactNode[] = [];
    albums.forEach((albumSong) => {
        const album = albumSong[0].album;
        const artist = albumSong[0].artist;
        albumCards.push(<AlbumCard title={album.title} artist={artist} imgSrc={album.imgSrc} />);
    });

    return (
        <>
            <h2 className="text-5xl py-3">Albums</h2>
            <div className="album-gallery">
                {albumCards}
            </div>
        </>
    );
}

interface albumCardProps {
    title: string,
    artist: string,
    imgSrc: string,
}

function AlbumCard({title, artist, imgSrc}: albumCardProps) {
    return (
        <div className="album-card w-64 rounded-2xl bg-white overflow-hidden">
            <CoverImg src={imgSrc} alt={title} />
            <div className="px-6 py-1.5 font-bold">
                <h4 className="text-black text-xl">{title}</h4>
                <h5 className="text-neutral-800 ">{artist}</h5>
            </div>
        </div>
    );

}
