export interface Song {
	title: string;
	track: number;
	artist: Artist;
	id: string;
	album: {
		id: string;
		title: string;
		artist: Artist;
		imgSrc: string;
	};
	duration: number;
	src: string;
	imgSrc: string;
}

export interface Album {
	id: string;
	title: string;
	artist: Artist;
	imgSrc: string;
}
export interface AlbumWithSongs extends Album {
	songs: Song[];
}

export interface ArtistNoID {
	name: string;
	website: string;
	imgSrc: string;
}
export interface Artist extends ArtistNoID {
	id: string;
}

export interface Playlist {
	id: number;
	name: string;
}
