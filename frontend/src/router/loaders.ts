import {Album, AlbumWithSongs, ArtistWithImg, Song} from "@/components/player/types";

export async function fetchAllAlbums(): Promise<Album[]> {
    const res = await fetch(`/api/albums`);
    if (res.status == 204) {
        throw new Response("No Content", {status: 204});
    }
    if (res.status == 429) {
        throw new Response("You've been rate limited", {status: 429});
    }
    return res.json();
}

export async function fetchAllSongs(): Promise<Song[]> {
    const res = await fetch(`/api/songs`);
    if (res.status == 204) {
        throw new Response("No Content", {status: 204});
    }
    if (res.status == 429) {
        throw new Response("You've been rate limited", {status: 429});
    }
    return res.json();
}

export async function fetchAllArtists(): Promise<ArtistWithImg> {
    const res = await fetch(`/api/artists`);
    if (res.status == 204) {
        throw new Response("No Content", {status: 204});
    }
    if (res.status == 429) {
        throw new Response("You've been rate limited", {status: 429});
    }
    return res.json();
}

export async function fetchAlbumByID(id: number): Promise<AlbumWithSongs> {
    const res = await fetch(`/api/album/${id}`);
    if (res.status == 404) {
        throw new Response("Not Found", {status: 404});
    }
    if (res.status == 400) {
        throw new Response("Bad Request", {status: 400});
    }
    if (res.status == 429) {
        throw new Response("You've been rate limited", {status: 429});
    }
    return res.json();
};

export async function fetchAlbumsByArtist(id: number): Promise<Album[]> {
    const res = await fetch(`/api/albums/artist/${id}`);
    if (res.status == 204) {
        throw new Response("No Content", {status: 204});
    }
    if (res.status == 404) {
        throw new Response("Not Found", {status: 404});
    }
    if (res.status == 400) {
        throw new Response("Bad Request", {status: 400});
    }
    if (res.status == 429) {
        throw new Response("You've been rate limited", {status: 429});
    }
    return res.json();
};
