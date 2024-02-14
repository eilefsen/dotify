package models

import (
	"database/sql"
	"errors"
	"fmt"
)

// Returned when no resources matching a query exist.
// Similar to database/sql.ErrNoRows
var ErrResourceNotFound = errors.New("models: could not find resources")

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

func SongsByAlbum(albumId uint32) ([]Song, error) {
	var songs []Song

	rows, err := db.Query("SELECT * FROM song WHERE album_id = ?", albumId)
	if err != nil {
		return nil, fmt.Errorf("SongsByAlbum %q: %v", albumId, err)
	}
	defer rows.Close()
	for rows.Next() {
		var song Song
		err := rows.Scan(
			&song.ID,
			&song.Title,
			&song.Artist,
			&song.Src,
			&song.Duration,
			&song.AlbumID,
		)
		if err != nil {
			return nil, fmt.Errorf("SongsByAlbum %q: %v", albumId, err)
		}
		songs = append(songs, song)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("SongsByAlbum %q: %v", albumId, err)
	}
	if len(songs) == 0 {
		return nil, ErrResourceNotFound
	}
	return songs, nil
}
