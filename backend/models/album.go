package models

import (
	"database/sql"
	"fmt"
	"log/slog"
)

type Album struct {
	ID     uint32 `json:"id"`
	Title  string `json:"title"`
	Artist string `json:"artist"`
	ImgSrc string `json:"imgSrc"`
}

type AlbumJSON struct {
	Album
	Songs []SongJSON `json:"songs"`
}

func AllAlbums() ([]Album, error) {
	var albums []Album

	rows, err := db.Query("SELECT * FROM album")
	if err != nil {
		return nil, fmt.Errorf("AllAlbums: %v", err)
	}
	defer rows.Close()
	for rows.Next() {
		var alb Album
		err := rows.Scan(&alb.ID, &alb.Title, &alb.Artist, &alb.ImgSrc)
		if err != nil {
			return nil, fmt.Errorf("AllAlbums: %v", err)
		}
		albums = append(albums, alb)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("AllAlbums: %v", err)
	}
	if len(albums) == 0 {
		return nil, ErrResourceNotFound
	}
	return albums, nil
}

func AlbumsByArtist(name string) ([]Album, error) {
	var albums []Album

	rows, err := db.Query("SELECT * FROM album WHERE artist = ?", name)
	if err != nil {
		return nil, fmt.Errorf("AlbumsByArtist %q: %v", name, err)
	}
	defer rows.Close()
	for rows.Next() {
		var alb Album
		err := rows.Scan(&alb.ID, &alb.Title, &alb.Artist, &alb.ImgSrc)
		if err != nil {
			return nil, fmt.Errorf("AlbumsByArtist %q: %v", name, err)
		}
		albums = append(albums, alb)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("AlbumsByArtist %q: %v", name, err)
	}
	if len(albums) == 0 {
		return nil, ErrResourceNotFound
	}
	return albums, nil
}

func AlbumById(id uint32) (Album, error) {
	var alb Album
	row := db.QueryRow("SELECT * FROM album WHERE id = ?", id)
	err := row.Scan(
		&alb.ID,
		&alb.Title,
		&alb.Artist,
		&alb.ImgSrc,
	)
	if err == sql.ErrNoRows {
		return alb, ErrResourceNotFound
	}
	if err != nil {
		return alb, fmt.Errorf("AlbumById %q: %v", id, err)
	}
	if err := row.Err(); err != nil {
		return alb, fmt.Errorf("AlbumById %q: %v", id, err)
	}
	return alb, nil
}

func AlbumJSONByID(id uint32) (AlbumJSON, error) {
	albumJson := AlbumJSON{
		Songs: []SongJSON{},
	}

	alb, err := AlbumById(id)
	if err != nil {
		return albumJson, fmt.Errorf("AlbumJSONByID: %v", err)
	}
	songs, err := SongsByAlbum(id)
	if err == ErrResourceNotFound {
		slog.Info("AlbumJSONByID: no songs found", "id", id)
	} else if err != nil {
		return albumJson, fmt.Errorf("AlbumJSONByID: %v", err)
	}

	songsJson := []SongJSON{}
	for _, v := range songs {
		s := SongJSON{
			Song:   v,
			ImgSrc: alb.ImgSrc,
		}
		songsJson = append(songsJson, s)
	}
	albumJson = AlbumJSON{
		Album: alb,
		Songs: songsJson,
	}
	return albumJson, nil
}
func AlbumsJSONByArtist(artist string) ([]AlbumJSON, error) {
	albumsJson := []AlbumJSON{
		{
			Songs: []SongJSON{},
		},
	}
	slog.Debug("AlbumsJSONByArtist: ", "albumsJson", albumsJson)

	albums, err := AlbumsByArtist(artist)
	if err != nil {
		return albumsJson, fmt.Errorf("AlbumJSONByID: %v", err)
	}
	for _, a := range albums {
		songs, err := SongsByAlbum(a.ID)
		if err != nil {
			return albumsJson, fmt.Errorf("AlbumJSONByID: %v", err)
		}

		songsJson := []SongJSON{}
		for _, v := range songs {
			s := SongJSON{
				Song:   v,
				ImgSrc: a.ImgSrc,
			}
			songsJson = append(songsJson, s)
		}
		albumsJson = append(albumsJson, AlbumJSON{
			Album: a,
			Songs: songsJson,
		})
	}

	return albumsJson, nil
}
