export interface Song {
    title: string;
    artist: Artist;
    id: string;
    album: {
        id: string,
        title: string,
        artist: Artist;
        imgSrc: string,
    };
    duration: string;
    src: string;
    imgSrc: string;
}

export interface Album {
    id: string,
    title: string,
    artist: Artist;
    imgSrc: string,
    songs: Song[],
}

export interface Artist {
    id: string,
    name: string,
}
