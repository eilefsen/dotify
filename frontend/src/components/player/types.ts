export interface Song {
    title: string;
    artist: string;
    id: string;
    albumId: string;
    duration: string;
    src: string;
    imgSrc: string;
}

export interface Album {
    id: string,
    title: string,
    artist: string;
    imgSrc: string,
    songs: Song[],
}
