package models

import (
	"database/sql"
	"fmt"
)

type Artist struct {
	Name string `json:"name"`
	ID   uint32 `json:"id"`
}

type Artists []Artist

type ArtistJSON struct {
	ImgSrc string `json:"imgSrc"`
	Artist
}
type ArtistsJSON []ArtistJSON

func (Artist) selectQuery() string {
	query := `
    SELECT artist.id, artist.name FROM artist
    `
	return query
}

func (Artists) selectQuery() string {
	return Artist{}.selectQuery()
}

func (ArtistJSON) selectQuery() string {
	query := `
    SELECT artist.id, artist.name, album.img_src
    FROM artist
    JOIN album
    ON album.id =
    (
    SELECT  album.id 
    FROM    album
    WHERE   album.artist_id = artist.id
    LIMIT 1
    )
    `
	return query
}

func (ArtistsJSON) selectQuery() string {
	return ArtistJSON{}.selectQuery()
}

func (artist *Artist) scan(r rowScanner) error {
	return r.Scan(
		&artist.ID,
		&artist.Name,
	)
}

func (artist *ArtistJSON) scan(r rowScanner) error {
	return r.Scan(
		&artist.ID,
		&artist.Name,
		&artist.ImgSrc,
	)
}

func (artistsJson ArtistsJSON) All() (ArtistsJSON, error) {
	rows, err := db.Query(artistsJson.selectQuery())
	if err != nil {
		return nil, fmt.Errorf("ArtistsJSON.All: %v", err)
	}
	defer rows.Close()
	for rows.Next() {
		var a ArtistJSON
		err := a.scan(rows)
		if err != nil {
			return nil, fmt.Errorf("ArtistsJSON.All: %v", err)
		}
		artistsJson = append(artistsJson, a)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("ArtistsJSON.All: %v", err)
	}
	if len(artistsJson) == 0 {
		return nil, ErrResourceNotFound
	}
	return artistsJson, nil
}

func (artists Artists) All() (Artists, error) {
	var err error
	artists, err = Artists{}.absSelect(Artist{}.selectQuery())
	if err == ErrResourceNotFound {
		return nil, err
	}
	if err != nil {
		return nil, fmt.Errorf("Artists.All: %v", err)
	}
	return artists, nil
}

func (artist Artist) ByID(id uint32) (Artist, error) {
	row := db.QueryRow(artist.selectQuery()+"WHERE artist.id = ?", id)
	err := artist.scan(row)
	if err == sql.ErrNoRows {
		return artist, ErrResourceNotFound
	}
	if err != nil {
		return artist, fmt.Errorf("Artist.ByID %q: %v", id, err)
	}
	if err := row.Err(); err != nil {
		return artist, fmt.Errorf("Artist.ByID %q: %v", id, err)
	}
	return artist, nil
}

func (artist Artist) ByName(name string) (Artist, error) {
	row := db.QueryRow(artist.selectQuery()+"WHERE artist.name = ?", name)
	err := artist.scan(row)
	if err == sql.ErrNoRows {
		return artist, ErrResourceNotFound
	}
	if err != nil {
		return artist, fmt.Errorf("Artist.ByName %q: %v", name, err)
	}
	if err := row.Err(); err != nil {
		return artist, fmt.Errorf("Artist.ByName %q: %v", name, err)
	}
	return artist, nil
}

func (artists Artists) absSelect(query string, args ...any) (Artists, error) {
	rows, err := db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var a Artist
		err := a.scan(rows)
		if err != nil {
			return nil, err
		}
		artists = append(artists, a)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	if len(artists) == 0 {
		return nil, ErrResourceNotFound
	}
	return artists, err
}
