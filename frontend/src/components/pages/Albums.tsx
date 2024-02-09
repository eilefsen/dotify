import {ReactNode} from "react";
import {CoverImg} from "../player";
import {albums} from "@/testData";
import {Link} from "react-router-dom";

export default function Albums() {
    const albumCards: ReactNode[] = [];
    albums.forEach((album) => {
        albumCards.push(<AlbumCard key={album.id} title={album.title} artist={album.artist} imgSrc={album.imgSrc} to={`/album/${album.id}`} />);
    });

    return (
        <>
            <h2 className="text-5xl py-3">Albums</h2>
            <div className="album-gallery flex gap-8">
                {albumCards}
            </div>
        </>
    );
}

interface albumCardProps {
    title: string,
    artist: string,
    imgSrc: string,
    to: string,
}

function AlbumCard({title, artist, imgSrc, to}: albumCardProps) {
    return (
        <Link to={to} className="album-card w-64 rounded-2xl bg-white overflow-hidden">
            <CoverImg src={imgSrc} alt={title} />
            <div className="px-6 py-1.5 font-bold">
                <h4 className="text-black text-xl">{title}</h4>
                <h5 className="text-neutral-800 ">{artist}</h5>
            </div>
        </Link>
    );

}
