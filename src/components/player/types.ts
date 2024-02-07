export interface Song {
    title: string;
    artist: string;
    album: {
        title: string;
        imgSrc: string;
    };
    src: string;
    length?: number;
}
