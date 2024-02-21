import {Link, useLoaderData} from "react-router-dom";
import {CoverImg, playerStoreContext} from "../player";
import {ReactNode, useContext} from "react";
import {Artist, ArtistWithImg} from "../player/types";
import {observer} from "mobx-react-lite";

export default function Artists() {
    const artistLines: ReactNode[] = [];
    const artists = useLoaderData() as ArtistWithImg[];
    console.debug(artists);
    artists.forEach((artist) => {
        artistLines.push(<ArtistLine key={artist.id} artist={artist} to={`/albums/artist/${artist.id}`} />);
    });

    return (
        <div className="album-list">
            {artistLines}
        </div>
    );
}

interface ArtistLineProps {
    artist: ArtistWithImg,
    to: string,
}

const ArtistLine = observer(({artist, to}: ArtistLineProps) => {
    const player = useContext(playerStoreContext);
    var bgColor = "bg-neutral-950";
    if (artist.id == player.currentSong?.artist.id) {
        bgColor = "bg-neutral-900";
    }

    return (
        <Link to={to} className={"album-line p-1 h-16 w-full border-b border-neutral-900 flex items-center active:bg-neutral-800" + " " + bgColor}>
            <img
                className='aspect-square h-full rounded-full border-neutral-300 border'
                src={artist.imgSrc}
                alt={artist.name}
            />
            <div className="pl-2">
                <p className='text-neutral-50 font-bold text-base'>
                    {artist.name}
                </p>
                <p className='text-neutral-400 font-normal text-sm'>
                    Artist
                </p>
            </div>
        </Link>
    );
});

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
