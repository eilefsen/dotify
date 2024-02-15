package models

import (
	"database/sql"
	"fmt"
	"log/slog"
)

type Album struct {
	ID     uint32 `json:"id"`
	Title  string `json:"title"`
	ImgSrc string `json:"imgSrc"`
	Artist Artist `json:"artist"`
}

type AlbumJSON struct {
	ID     uint32 `json:"id"`
	Title  string `json:"title"`
	ImgSrc string `json:"imgSrc"`
	Artist Artist `json:"artist"`
	Songs  []Song `json:"songs"`
}

func (album *Album) scan(r rowScanner) error {
	return r.Scan(
		&album.ID,
		&album.Title,
		&album.ImgSrc,
		&album.Artist.ID,
		&album.Artist.Name,
	)
}

func (Album) query() string {
	query := `
    SELECT
    album.id, album.title, album.img_src,
    artist.id, artist.name
    FROM album
    INNER JOIN artist ON artist.id=album.artist_id
    `
	return query
}

func (Album) All() ([]Album, error) {
	var albums []Album
	rows, err := db.Query(Album{}.query())
	if err != nil {
		return nil, fmt.Errorf("Album.All: %v", err)
	}
	defer rows.Close()
	for rows.Next() {
		var a Album
		err := a.scan(rows)
		if err != nil {
			return nil, fmt.Errorf("Album.All: %v", err)
		}
		albums = append(albums, a)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("Album.All: %v", err)
	}
	if len(albums) == 0 {
		return nil, ErrResourceNotFound
	}

	return albums, nil
}

func (a Album) ById(id uint32) (Album, error) {
	row := db.QueryRow(a.query()+"WHERE album.id = ?", id)
	err := a.scan(row)
	if err == sql.ErrNoRows {
		return a, ErrResourceNotFound
	}
	if err != nil {
		return a, fmt.Errorf("AlbumById %q: %v", id, err)
	}
	if err := row.Err(); err != nil {
		return a, fmt.Errorf("AlbumById %q: %v", id, err)
	}
	return a, nil
}

func (Album) ByArtist(id uint32) ([]Album, error) {
	var albums []Album
	rows, err := db.Query(Album{}.query()+"WHERE album.artist_id = ?", id)
	if err != nil {
		return nil, fmt.Errorf("Album.ByArtist: %v", err)
	}
	defer rows.Close()
	for rows.Next() {
		var a Album
		err := a.scan(rows)
		if err != nil {
			return nil, fmt.Errorf("Album.ByArtist: %v", err)
		}
		albums = append(albums, a)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("Album.ByArtist: %v", err)
	}
	if len(albums) == 0 {
		return nil, ErrResourceNotFound
	}

	return albums, nil
}

func (Album) JSONByID(id uint32) (AlbumJSON, error) {
	albumJson := AlbumJSON{
		Songs: []Song{},
	}

	alb, err := Album{}.ById(id)
	if err != nil {
		return albumJson, fmt.Errorf("Album.JSONByID: %v", err)
	}
	songs, err := Song{}.ByAlbum(id)
	if err == ErrResourceNotFound {
		slog.Info("Album.JSONByID: no songs found", "id", id)
	} else if err != nil {
		return albumJson, fmt.Errorf("Album.JSONByID: %v", err)
	}

	albumJson = AlbumJSON{
		ID:     alb.ID,
		Title:  alb.Title,
		ImgSrc: alb.ImgSrc,
		Artist: alb.Artist,
		Songs:  songs,
	}
	return albumJson, nil
}
