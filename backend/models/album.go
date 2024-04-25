package models

import (
	"database/sql"
	"fmt"
	"log/slog"
)

type AlbumNoID struct {
	Title  string `json:"title"`
	ImgSrc string `json:"imgSrc"`
	Artist Artist `json:"artist"`
}

type Album struct {
	AlbumNoID
	ID uint32 `json:"id"`
}
type Albums []Album

type AlbumJSON struct {
	Songs Songs `json:"songs"`
	Album
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

func (Album) New(album AlbumNoID) (Album, error) {
	var a Album
	res, err := db.Exec(
		`INSERT IGNORE INTO album (album.title, album.img_src,
		artist_id
		) VALUES (?, ?, ?)`,
		album.Title,
		album.ImgSrc,
		album.Artist.ID,
	)
	if err != nil {
		return a, err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return a, err
	}
	if id == 0 {
		a, err = Album{}.ByTitle(album.Title)
		if err != nil {
			return a, err
		}
	} else {
		a.ID = uint32(id)
		a.AlbumNoID = album
	}
	slog.Info("models.NewAlbum", "a", a)
	return a, nil
}

func (a Album) Update() error {
	_, err := db.Exec(
		`UPDATE album SET title = ?, artist_id = ? WHERE id = ? `,
		a.Title,
		a.Artist.ID,
		a.ID,
	)
	if err != nil {
		return err
	}
	slog.Info("models.Album.Update", "a", a)
	return nil
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
			ID: alb.ID,
			AlbumNoID: AlbumNoID{
				Title:  alb.Title,
				ImgSrc: alb.ImgSrc,
				Artist: alb.Artist,
			},
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

func (a Album) ByTitle(title string) (Album, error) {
	row := db.QueryRow(a.selectQuery()+"WHERE album.title = ?", title)
	err := a.scan(row)
	if err == sql.ErrNoRows {
		return a, ErrResourceNotFound
	}
	if err != nil {
		return a, fmt.Errorf("Album.ByTitle %q: %v", title, err)
	}
	if err := row.Err(); err != nil {
		return a, fmt.Errorf("Album.ByTitle %q: %v", title, err)
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
		slog.Error("DB Error", "err", err)
		return nil, err
	}
	if len(albums) == 0 {
		return nil, ErrResourceNotFound
	}
	return albums, err
}
