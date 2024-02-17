import {Link, useLoaderData} from "react-router-dom";
import {CoverImg} from "../player";
import {ReactNode} from "react";
import {ArtistWithImg} from "../player/types";

export default function Artists() {
    const albumCards: ReactNode[] = [];
    const artists = useLoaderData() as ArtistWithImg[];
    console.debug(artists);
    artists.forEach((artist) => {
        albumCards.push(<ArtistCard key={artist.id} name={artist.name} imgSrc={artist.imgSrc} to={`/albums/artist/${artist.id}`} />);
    });

    return (
        <>
            <h2 className="text-5xl py-3">Albums</h2>
            <div className="album-gallery flex flex-wrap gap-5">
                {albumCards}
            </div>
        </>
    );
}

interface artistCardProps {
    name: string,
    imgSrc: string,
    to: string,
}

function ArtistCard({name, imgSrc, to}: artistCardProps) {
    return (
        <Link to={to} className="album-card w-48 rounded-2xl bg-white overflow-hidden">
            <CoverImg src={imgSrc} alt={name} />
            <div className="px-6 py-1.5 font-bold">
                <h4 className="text-black text-xl">{name}</h4>
            </div>
        </Link>
    );
}
