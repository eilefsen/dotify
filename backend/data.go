package main

type song struct {
	Title    string `json:"title"`
	Artist   string `json:"artist"`
	ID       string `json:"id"`
	AlbumID  string `json:"albumId"`
	Duration string `json:"duration"`
	Src      string `json:"src"`
	ImgSrc   string `json:"imgSrc"`
}

type album struct {
	ID     string `json:"id"`
	Title  string `json:"title"`
	Artist string `json:"artist"`
	ImgSrc string `json:"imgSrc"`
	Songs  []song `json:"songs"`
}

var albums = []album{
	{
		ID:     "1",
		Title:  "Grasshopper",
		Artist: "City Jeans",
		ImgSrc: "/audio/City_Jeans-Grasshopper/cover.png",
		Songs: []song{
			{
				Title:    "Dogs",
				Artist:   "City Jeans",
				ID:       "1",
				AlbumID:  "1",
				Duration: "0:49",
				Src:      "/audio/City_Jeans-Grasshopper/01-Dogs.m4a",
				ImgSrc:   "/audio/City_Jeans-Grasshopper/cover.png",
			},
			{
				Title:    "Gas Station",
				Artist:   "City Jeans",
				ID:       "2",
				AlbumID:  "1",
				Duration: "1:28",
				Src:      "/audio/City_Jeans-Grasshopper/02-Gas_Station.m4a",
				ImgSrc:   "/audio/City_Jeans-Grasshopper/cover.png",
			},
			{
				Title:    "Grasshopper",
				Artist:   "City Jeans",
				ID:       "3",
				AlbumID:  "1",
				Duration: "1:34",
				Src:      "/audio/City_Jeans-Grasshopper/03-Grasshopper.m4a",
				ImgSrc:   "/audio/City_Jeans-Grasshopper/cover.png",
			},
		},
	},
	{
		ID:     "2",
		Title:  "Blue Album",
		Artist: "Weezer",
		ImgSrc: "/audio/Weezer-Blue_Album/Folder.jpg",
		Songs: []song{
			{
				Title:    "My Name Is Jonas",
				Artist:   "Weezer",
				ID:       "4",
				AlbumID:  "2",
				Duration: "3:25",
				Src:      "/audio/Weezer-Blue_Album/01-My_Name_Is_Jonas.mp3",
				ImgSrc:   "/audio/Weezer-Blue_Album/Folder.jpg",
			},
			{
				Title:    "No One Else",
				Artist:   "Weezer",
				ID:       "5",
				AlbumID:  "2",
				Duration: "3:05",
				Src:      "/audio/Weezer-Blue_Album/02-No_One_Else.mp3",
				ImgSrc:   "/audio/Weezer-Blue_Album/Folder.jpg",
			},
			{
				Title:    "The World Has Turned And Left Me Here",
				Artist:   "Weezer",
				ID:       "6",
				AlbumID:  "2",
				Duration: "2:39",
				Src:      "/audio/Weezer-Blue_Album/03-The_World_Has_Turned_And_Left_Me_Here.mp3",
				ImgSrc:   "/audio/Weezer-Blue_Album/Folder.jpg",
			},
			{
				Title:    "Buddy Holly",
				Artist:   "Weezer",
				ID:       "7",
				AlbumID:  "2",
				Duration: "2:39",
				Src:      "/audio/Weezer-Blue_Album/04-Buddy_Holly.mp3",
				ImgSrc:   "/audio/Weezer-Blue_Album/Folder.jpg",
			},
			{
				Title:    "Undone - The Sweater Song",
				Artist:   "Weezer",
				ID:       "8",
				AlbumID:  "2",
				Duration: "5:05",
				Src:      "/audio/Weezer-Blue_Album/05-Undone-The_Sweater_Song.mp3",
				ImgSrc:   "/audio/Weezer-Blue_Album/Folder.jpg",
			},
			{
				Title:    "Surf Wax America",
				Artist:   "Weezer",
				ID:       "9",
				AlbumID:  "2",
				Duration: "3:07",
				Src:      "/audio/Weezer-Blue_Album/06-Surf_Wax_America.mp3",
				ImgSrc:   "/audio/Weezer-Blue_Album/Folder.jpg",
			},
			{
				Title:    "Say It Ain't So",
				Artist:   "Weezer",
				ID:       "10",
				AlbumID:  "2",
				Duration: "4:19",
				Src:      "/audio/Weezer-Blue_Album/07-Say_It_Ain't_So.mp3",
				ImgSrc:   "/audio/Weezer-Blue_Album/Folder.jpg",
			},
			{
				Title:    "In The Garage",
				Artist:   "Weezer",
				ID:       "11",
				AlbumID:  "2",
				Duration: "3:56",
				Src:      "/audio/Weezer-Blue_Album/08-In_The_Garage.mp3",
				ImgSrc:   "/audio/Weezer-Blue_Album/Folder.jpg",
			},
			{
				Title:    "Holiday",
				Artist:   "Weezer",
				ID:       "12",
				AlbumID:  "2",
				Duration: "3:25",
				Src:      "/audio/Weezer-Blue_Album/09-Holiday.mp3",
				ImgSrc:   "/audio/Weezer-Blue_Album/Folder.jpg",
			},
			{
				Title:    "Only In Dreams",
				Artist:   "Weezer",
				ID:       "13",
				AlbumID:  "2",
				Duration: "7:59",
				Src:      "/audio/Weezer-Blue_Album/10-Only_In_Dreams.mp3",
				ImgSrc:   "/audio/Weezer-Blue_Album/Folder.jpg",
			},
		},
	},
}
