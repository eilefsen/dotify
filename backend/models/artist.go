package models

import (
	"database/sql"
	"fmt"
)

type Artist struct {
	ID   uint32 `json:"id"`
	Name string `json:"name"`
}

func (Artist) query() string {
	query := `
    SELECT artist.id, artist.name FROM artist
    `
	return query
}

func (Artist) All() ([]Artist, error) {
	var artists []Artist

	rows, err := db.Query(Artist{}.query())
	if err != nil {
		return nil, fmt.Errorf("AllArtists: %v", err)
	}
	defer rows.Close()
	for rows.Next() {
		var artist Artist
		err := rows.Scan(
			&artist.ID,
			&artist.Name,
		)
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
	row := db.QueryRow(artist.query()+"WHERE artist.id = ?", id)
	err := row.Scan(
		&artist.ID,
		&artist.Name,
	)
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
	row := db.QueryRow(artist.query()+"WHERE artist.name = ?", name)
	err := row.Scan(
		&artist.ID,
		&artist.Name,
	)
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
