package models

import (
	"fmt"
)

type Song struct {
	Title    string `json:"title"`
	Src      string `json:"src"`
	Artist   Artist `json:"artist"`
	Album    Album  `json:"album"`
	ID       uint32 `json:"id"`
	Track    uint32 `json:"track"`
	Duration uint32 `json:"duration"`
}
type Songs []Song

func (song *Song) scan(r rowScanner) error {
	return r.Scan(
		&song.Title,
		&song.Src,
		&song.Album.ID,
		&song.Album.Title,
		&song.Album.ImgSrc,
		&song.Artist.ID,
		&song.Artist.Name,
		&song.ID,
		&song.Track,
		&song.Duration,
	)
}

func (Song) selectQuery() string {
	query := `
    SELECT
    song.id, song.track, song.title, song.src, song.duration,
    album.id, album.title, album.img_src,
    artist.id, artist.name
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
	songs, err = songs.absSelect(songs.selectQuery()+"WHERE song.album_id = ? GROUP BY song.id ORDER BY song.track IS NULL, song.track ASC ", id)
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
	songs, err = songs.absSelect(songs.selectQuery())
	if err == ErrResourceNotFound {
		return nil, err
	}
	if err != nil {
		return nil, fmt.Errorf("Songs.All: %v", err)
	}
	return songs, nil
}

func (songs Songs) absSelect(query string, args ...any) (Songs, error) {
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
	return songs, err
}
