package models

import (
	"fmt"
)

type Song struct {
	ID       uint32 `json:"id"`
	Title    string `json:"title"`
	Src      string `json:"src"`
	Duration uint32 `json:"duration"`
	Artist   Artist `json:"artist"`
	Album    Album  `json:"album"`
}

func (song *Song) scan(r rowScanner) error {
	return r.Scan(
		&song.ID,
		&song.Title,
		&song.Src,
		&song.Duration,
		&song.Album.ID,
		&song.Album.Title,
		&song.Album.ImgSrc,
		&song.Artist.ID,
		&song.Artist.Name,
	)
}

func (Song) query() string {
	query := `
    SELECT
    song.id, song.title, song.src, song.duration,
    album.id, album.title, album.img_src, artist.*
    FROM song
    INNER JOIN album ON album.id=song.album_id
    INNER JOIN artist ON artist.id=song.artist_id
    `
	return query
}

func (Song) All() ([]Song, error) {
	var songs []Song

	rows, err := db.Query(Song{}.query())
	if err != nil {
		return nil, fmt.Errorf("Song.All: %v", err)
	}
	defer rows.Close()
	for rows.Next() {
		var s Song
		err := s.scan(rows)
		if err != nil {
			return nil, fmt.Errorf("Song.All: %v", err)
		}
		songs = append(songs, s)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("Song.All: %v", err)
	}
	if len(songs) == 0 {
		return nil, ErrResourceNotFound
	}

	return songs, nil
}
func (Song) ByAlbum(id uint32) ([]Song, error) {
	var songs []Song

	rows, err := db.Query(Song{}.query()+"WHERE song.album_id = ?", id)
	if err != nil {
		return nil, fmt.Errorf("Song.ByAlbum: %v", err)
	}
	defer rows.Close()
	for rows.Next() {
		var s Song
		err := s.scan(rows)
		if err != nil {
			return nil, fmt.Errorf("Song.ByAlbum: %v", err)
		}
		songs = append(songs, s)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("Song.ByAlbum: %v", err)
	}
	if len(songs) == 0 {
		return nil, ErrResourceNotFound
	}

	return songs, nil
}
