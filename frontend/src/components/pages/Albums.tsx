import {ReactNode} from "react";
import {CoverImg} from "../player";
import {Link, useLoaderData} from "react-router-dom";
import {Album} from "../player/types";

export default function Albums() {
    const albumLines: ReactNode[] = [];
    const albums = useLoaderData() as Album[];
    console.debug(albums);
    albums.forEach((album) => {
        albumLines.push(<AlbumLine key={album.id} title={album.title} artist={album.artist.name} imgSrc={album.imgSrc} to={`/album/${album.id}`} />);
    });

    return (
        <>
            <div className="album-list">
                {albumLines}
            </div>
        </>
    );
}

interface AlbumLineProps {
    title: string,
    artist: string,
    imgSrc: string,
    to: string,
}

function AlbumLine({title, artist, imgSrc, to}: AlbumLineProps) {
    return (
        <Link to={to} className="album-line p-2 h-16 w-full bg-neutral-800 flex items-center">
            <CoverImg src={imgSrc} alt={title} className="w-16 h-16" />
            <div className="pl-2 font-bold">
                <div className='text-neutral-300 font-bold text-base'>
                    {title}
                </div>
                <div className='text-neutral-400 font-bold text-sm'>
                    {artist}
                </div>
            </div>
        </Link>
    );
}

interface AlbumCardProps {
    title: string,
    artist: string,
    imgSrc: string,
    to: string,
}

function AlbumCard({title, artist, imgSrc, to}: AlbumCardProps) {
    return (
        <Link to={to} className="album-card w-48 rounded-2xl bg-white overflow-hidden">
            <CoverImg src={imgSrc} alt={title} />
            <div className="px-6 py-1.5 font-bold">
                <h4 className="text-black text-xl">{title}</h4>
                <h5 className="text-neutral-800 ">{artist}</h5>
            </div>
        </Link>
    );
}
