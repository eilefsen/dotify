export interface Song {
    title: string;
    artist: string;
    id: number;
    album: {
        id: number;
        title: string;
        imgSrc: string;
    };
    src: string;
    duration: string;
}

export interface Album {
    id: number,
    title: string,
    artist: string;
    imgSrc: string,
    songs: Song[],

}
