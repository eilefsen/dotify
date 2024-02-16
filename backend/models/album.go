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
type Albums []Album

type AlbumJSON struct {
	Album
	Songs Songs `json:"songs"`
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

func (Album) selectQuery() string {
	query := `
    SELECT
    album.id, album.title, album.img_src,
    artist.id, artist.name
    FROM album
    INNER JOIN artist ON artist.id=album.artist_id
    `
	return query
}
func (Albums) selectQuery() string {
	return Album{}.selectQuery()
}

func (AlbumJSON) ByID(id uint32) (AlbumJSON, error) {
	albumJson := AlbumJSON{
		Songs: Songs{},
	}

	alb, err := Album{}.ById(id)
	if err != nil {
		return albumJson, fmt.Errorf("AlbumJSON.ByID: %v", err)
	}
	songs, err := Songs{}.ByAlbum(id)
	if err == ErrResourceNotFound {
		slog.Info("AlbumJSON.ByID: no songs found", "id", id)
	} else if err != nil {
		return albumJson, fmt.Errorf("AlbumJSON.ByID: %v", err)
	}

	albumJson = AlbumJSON{
		Album: Album{
			ID:     alb.ID,
			Title:  alb.Title,
			ImgSrc: alb.ImgSrc,
			Artist: alb.Artist,
		},
		Songs: songs,
	}
	return albumJson, nil
}

func (a Album) ById(id uint32) (Album, error) {
	row := db.QueryRow(a.selectQuery()+"WHERE album.id = ?", id)
	err := a.scan(row)
	if err == sql.ErrNoRows {
		return a, ErrResourceNotFound
	}
	if err != nil {
		return a, fmt.Errorf("Album.ById %q: %v", id, err)
	}
	if err := row.Err(); err != nil {
		return a, fmt.Errorf("Album.ById %q: %v", id, err)
	}
	return a, nil
}

func (albums Albums) All() (Albums, error) {
	var err error
	albums, err = albums.absSelect(albums.selectQuery())
	if err == ErrResourceNotFound {
		return nil, err
	}
	if err != nil {
		return nil, fmt.Errorf("Album.All: %v", err)
	}
	return albums, nil
}

func (albums Albums) ByArtist(id uint32) (Albums, error) {
	var err error
	albums, err = albums.absSelect(albums.selectQuery()+"WHERE album.artist_id = ?", id)
	if err == ErrResourceNotFound {
		return nil, err
	}
	if err != nil {
		return nil, fmt.Errorf("Album.ByArtist: %v", err)
	}
	return albums, nil
}

func (albums Albums) absSelect(query string, args ...any) (Albums, error) {
	rows, err := db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var a Album
		err := a.scan(rows)
		if err != nil {
			return nil, err
		}
		albums = append(albums, a)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	if len(albums) == 0 {
		return nil, ErrResourceNotFound
	}
	return albums, err
}
