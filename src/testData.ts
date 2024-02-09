import {Album, Song} from '@/components/player/types';

export const grasshopper_songs: Song[] = [
    {
        title: "Dogs",
        artist: "City Jeans",
        id: 1,
        album: {
            id: 1,
            title: "Grasshopper",
            imgSrc: "/City_Jeans-Grasshopper/cover.png",
        },
        duration: "0:49",
        src: "/City_Jeans-Grasshopper/01-Dogs.m4a",
    },
    {
        title: "Gas Station",
        artist: "City Jeans",
        id: 2,
        album: {
            id: 1,
            title: "Grasshopper",
            imgSrc: "/City_Jeans-Grasshopper/cover.png",
        },
        duration: "1:28",
        src: "/City_Jeans-Grasshopper/02-Gas_Station.m4a",
    },
    {
        title: "Grasshopper",
        artist: "City Jeans",
        id: 3,
        album: {
            id: 1,
            title: "Grasshopper",
            imgSrc: "/City_Jeans-Grasshopper/cover.png",
        },
        duration: "1:34",
        src: "/City_Jeans-Grasshopper/03-Grasshopper.m4a",
    },
];

export const blue_album_songs: Song[] = [
    {
        title: "My Name Is Jonas",
        artist: "Weezer",
        id: 4,
        album: {
            id: 2,
            title: "Blue Album",
            imgSrc: "/Weezer-Blue_Album/Folder.jpg",
        },
        duration: "3:25",
        src: "/Weezer-Blue_Album/01-My_Name_Is_Jonas.mp3",
    },
    {
        title: "No One Else",
        artist: "Weezer",
        id: 5,
        album: {
            id: 2,
            title: "Blue Album",
            imgSrc: "/Weezer-Blue_Album/Folder.jpg",
        },
        duration: "3:05",
        src: "/Weezer-Blue_Album/02-No_One_Else.mp3",
    },
    {
        title: "The World Has Turned And Left Me Here",
        artist: "Weezer",
        id: 6,
        album: {
            id: 2,
            title: "Blue Album",
            imgSrc: "/Weezer-Blue_Album/Folder.jpg",
        },
        duration: "2:39",
        src: "/Weezer-Blue_Album/03-The_World_Has_Turned_And_Left_Me_Here.mp3",
    },
    {
        title: "Buddy Holly",
        artist: "Weezer",
        id: 7,
        album: {
            id: 2,
            title: "Blue Album",
            imgSrc: "/Weezer-Blue_Album/Folder.jpg",
        },
        duration: "2:39",
        src: "/Weezer-Blue_Album/04-Buddy_Holly.mp3",
    },
    {
        title: "Undone - The Sweater Song",
        artist: "Weezer",
        id: 8,
        album: {
            id: 2,
            title: "Blue Album",
            imgSrc: "/Weezer-Blue_Album/Folder.jpg",
        },
        duration: "5:05",
        src: "/Weezer-Blue_Album/05-Undone-The_Sweater_Song.mp3",
    },
    {
        title: "Surf Wax America",
        artist: "Weezer",
        id: 9,
        album: {
            id: 2,
            title: "Blue Album",
            imgSrc: "/Weezer-Blue_Album/Folder.jpg",
        },
        duration: "3:07",
        src: "/Weezer-Blue_Album/06-Surf_Wax_America.mp3",
    },
    {
        title: "Say It Ain't So",
        artist: "Weezer",
        id: 10,
        album: {
            id: 1,
            title: "Blue Album",
            imgSrc: "/Weezer-Blue_Album/Folder.jpg",
        },
        duration: "4:19",
        src: "/Weezer-Blue_Album/07-Say_It_Ain't_So.mp3",
    },
    {
        title: "In The Garage",
        artist: "Weezer",
        id: 11,
        album: {
            id: 2,
            title: "Blue Album",
            imgSrc: "/Weezer-Blue_Album/Folder.jpg",
        },
        duration: "3:56",
        src: "/Weezer-Blue_Album/08-In_The_Garage.mp3",
    },
    {
        title: "Holiday",
        artist: "Weezer",
        id: 12,
        album: {
            id: 2,
            title: "Blue Album",
            imgSrc: "/Weezer-Blue_Album/Folder.jpg",
        },
        duration: "3:25",
        src: "/Weezer-Blue_Album/09-Holiday.mp3",
    },
    {
        title: "Only In Dreams",
        artist: "Weezer",
        id: 13,
        album: {
            id: 2,
            title: "Blue Album",
            imgSrc: "/Weezer-Blue_Album/Folder.jpg",
        },
        duration: "7:59",
        src: "/Weezer-Blue_Album/10-Only_In_Dreams.mp3",
    },
];

export const albums: Album[] = [
    {
        id: 1,
        title: "Grasshopper",
        artist: "City Jeans",
        imgSrc: "/cover.png",
        songs: grasshopper_songs,
    },
    {
        id: 2,
        title: "Blue Album",
        artist: "Weezer",
        imgSrc: "/Weezer-Blue_Album/Folder.jpg",
        songs: blue_album_songs,
    },
];

export const allSongs = grasshopper_songs.concat(blue_album_songs);
