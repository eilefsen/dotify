package models

import (
	"database/sql"
	"fmt"
	"log/slog"
)

type Artist struct {
	Name    string `json:"name"`
	Website string `json:"website"`
	ImgSrc  string `json:"imgSrc"`
	ID      uint32 `json:"id"`
}

type Artists []Artist

// type ArtistJSON struct {
// 	ImgSrc string `json:"imgSrc"`
// 	Artist
// }
// type ArtistsJSON []ArtistJSON

func (Artist) selectQuery() string {
	query := `
	SELECT artist.id, artist.name, artist.website, artist.img_src FROM artist
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
		&artist.Website,
		&artist.ImgSrc,
	)
}

func (Artist) New(name string) (Artist, error) {
	var a Artist
	res, err := db.Exec(
		`INSERT IGNORE INTO artist (artist.name
		) VALUES (?)`,
		name,
	)
	if err != nil {
		return a, err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return a, err
	}
	if id == 0 {
		a, err = Artist{}.ByName(name)
		if err != nil {
			return a, err
		}
	} else {
		a.ID = uint32(id)
		a.Name = name
	}
	slog.Info("models.NewArtist", "a", a)
	return a, nil
}

func (Artist) Delete(id uint32) error {
	albums, err := Albums{}.ByArtist(id)
	if err != nil {
		slog.Error("Artist.Delete: could not get albums", "err", err)
		return err
	}
	for _, a := range albums {
		err := a.Delete(a.ID)
		if err != nil {
			slog.Error("Artist.Delete: failed to delete albums", "err", err, "id", id)
			return err
		}
	}

	_, err = db.Exec(
		`DELETE FROM artist WHERE id = ?`,
		id,
	)
	if err != nil {
		slog.Error("Artist.Delete:", "err", err)
		return err
	}

	slog.Info("Artist.Delete: Successfully deleted artist", "id", id)
	return nil
}

func (a Artist) Update() error {
	_, err := db.Exec(
		`UPDATE artist SET name = ?, website = ?, img_src = ? WHERE id = ?`,
		a.Name,
		a.Website,
		a.ImgSrc,
		a.ID,
	)
	if err != nil {
		return err
	}
	slog.Info("models.NewArtist", "a", a)
	return nil
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
		slog.Error("models.Artist.ByID:", "err", err)
		return artist, ErrResourceNotFound
	}
	if err != nil {
		slog.Error("models.Artist.ByID:", "err", err)
		return artist, fmt.Errorf("Artist.ByID %q: %v", id, err)
	}
	if err := row.Err(); err != nil {
		slog.Error("models.Artist.ByID:", "err", err)
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
		slog.Error("DB Error", "err", err)
		return nil, err
	}
	if len(artists) == 0 {
		return nil, ErrResourceNotFound
	}
	return artists, err
}
