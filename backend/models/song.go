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
type Songs []Song

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

func (Song) selectQuery() string {
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
func (Songs) selectQuery() string {
	return Song{}.selectQuery()
}

func (songs Songs) ByAlbum(id uint32) (Songs, error) {
	var err error
	songs, err = songs.absQuery(songs.selectQuery()+"WHERE song.album_id = ?", id)
	if err == ErrResourceNotFound {
		return nil, err
	}
	if err != nil {
		return nil, fmt.Errorf("Songs.ByAlbum: %v", err)
	}
	return songs, nil
}

func (songs Songs) All() (Songs, error) {
	var err error
	songs, err = songs.absQuery(songs.selectQuery())
	if err == ErrResourceNotFound {
		return nil, err
	}
	if err != nil {
		return nil, fmt.Errorf("Songs.All: %v", err)
	}
	return songs, nil
}

func (songs Songs) absQuery(query string, args ...any) (Songs, error) {
	rows, err := db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var s Song
		err := s.scan(rows)
		if err != nil {
			return nil, err
		}
		songs = append(songs, s)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	if len(songs) == 0 {
		return nil, ErrResourceNotFound
	}
	return songs, nil
}
