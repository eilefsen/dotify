package models

import (
	"database/sql"
	"fmt"
)

type Artist struct {
	ID   uint32 `json:"id"`
	Name string `json:"name"`
}
type Artists []Artist

func (Artist) selectQuery() string {
	query := `
    SELECT artist.id, artist.name FROM artist
    `
	return query
}
func (Artists) selectQuery() string {
	return Artist{}.selectQuery()
}

func (artist *Artist) scan(r rowScanner) error {
	return r.Scan(
		&artist.ID,
		&artist.Name,
	)
}

func (artists Artists) All() (Artists, error) {
	rows, err := db.Query(Artist{}.selectQuery())
	if err != nil {
		return nil, fmt.Errorf("AllArtists: %v", err)
	}
	defer rows.Close()
	for rows.Next() {
		var artist Artist
		err := artist.scan(rows)
		if err != nil {
			return nil, fmt.Errorf("AllArtists: %v", err)
		}
		artists = append(artists, artist)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("AllArtists: %v", err)
	}
	if len(artists) == 0 {
		return nil, ErrResourceNotFound
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
		return artist, fmt.Errorf("ArtistById %q: %v", id, err)
	}
	if err := row.Err(); err != nil {
		return artist, fmt.Errorf("ArtistById %q: %v", id, err)
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
		return artist, fmt.Errorf("ArtistByName %q: %v", name, err)
	}
	if err := row.Err(); err != nil {
		return artist, fmt.Errorf("ArtistByName %q: %v", name, err)
	}
	return artist, nil
}
