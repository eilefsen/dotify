import {Album, Song} from "@/components/player/types";
import {Params} from "react-router-dom";

export async function fetchAllAlbums(): Promise<Album[]> {
    const res = await fetch(`/api/albums`);
    if (res.status == 204) {
        throw new Response("No Content", {status: 204});
    }
    return res.json();
}

export async function fetchAllSongs(): Promise<Song[]> {
    const res = await fetch(`/api/songs`);
    if (res.status == 204) {
        throw new Response("No Content", {status: 204});
    }
    return res.json();
}

export async function fetchAlbumByID(id: number): Promise<Album> {
    const res = await fetch(`/api/album/${id}`);
    if (res.status == 404) {
        throw new Response("Not Found", {status: 404});
    }
    if (res.status == 400) {
        throw new Response("Bad Request", {status: 400});
    }
    return res.json();
};

export async function fetchAlbumsByArtist(name: string): Promise<Album[]> {
    const res = await fetch(`/api/artist/${name}`);
    if (res.status == 404) {
        throw new Response("No Content", {status: 404});
    }
    return res.json();
};
