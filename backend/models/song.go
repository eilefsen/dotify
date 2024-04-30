package models

import (
	"database/sql"
	"fmt"
	"log/slog"
	"os"
	"path/filepath"
)

type SongNoID struct {
	Title    string `json:"title"`
	Src      string `json:"src"`
	Artist   Artist `json:"artist"`
	Album    Album  `json:"album"`
	Track    uint32 `json:"track,string"`
	Duration uint32 `json:"duration"`
}
type Song struct {
	SongNoID
	ID uint32 `json:"id"`
}
type Songs []Song

func (song *Song) scan(r rowScanner) error {
	return r.Scan(
		&song.ID,
		&song.Track,
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

func (Song) New(song SongNoID) (Song, error) {
	var s Song
	res, err := db.Exec(
		`
		INSERT INTO song (
		song.track, song.title, song.src, song.duration,
		album_id,
		artist_id
		) VALUES ( ?, ?, ?, ?, ?, ?)
		`,
		song.Track,
		song.Title,
		song.Src,
		song.Duration,
		song.Album.ID,
		song.Artist.ID,
	)
	if err != nil {
		return s, err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return s, err
	}
	s.ID = uint32(id)
	s.SongNoID = song
	slog.Info("models.NewSong", "s", s)
	return s, nil
}

func (Song) Delete(id uint32) error {
	s, err := Song{}.ByID(id)
	if err != nil {
		slog.Error("Song.Delete: failed to get song", "id", id, "err", err)
		return err
	}

	// delete from database before file, its better to have an orphan file than a broken song
	_, err = db.Exec("DELETE FROM song WHERE ID = ?", id)
	if err != nil {
		slog.Error("Song.Delete: failed to delete from db", "id", id, "err", err)
		return err
	}

	err = s.DeleteFile()
	if err != nil {
		slog.Error("Song.Delete: failed to delete from file system", "id", id, "err", err)
		return err
	}

	slog.Info("Song.Delete: Deleted song from database", "id", id)
	return nil
}

func (s Song) DeleteFile() error {
	relativePath := os.Getenv("UPLOADS_DIR_PREFIX")
	fullPath := filepath.Join(relativePath, s.Src)
	err := os.Remove(fullPath)
	if err != nil {
		slog.Error("Song.DeleteFile:", "file", fullPath, "relativePath", relativePath, "err", err)
		return err
	}

	return nil
}

func (s Song) Update() error {
	_, err := db.Exec(`
		UPDATE song SET track = ?, title = ?
		WHERE id = ?
		`,
		s.Track,
		s.Title,
		s.ID,
	)
	if err != nil {
		return err
	}
	slog.Debug("models.Song.Update", "s", s)
	return nil
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

func (Song) ByID(id uint32) (Song, error) {
	var s Song
	row := db.QueryRow(s.selectQuery()+"WHERE song.id = ?", id)
	err := s.scan(row)
	if err == sql.ErrNoRows {
		return s, ErrResourceNotFound
	}
	if err != nil {
		return s, fmt.Errorf("Song.ById %q: %v", id, err)
	}
	if err := row.Err(); err != nil {
		return s, fmt.Errorf("Song.ById %q: %v", id, err)
	}
	return s, nil
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
		slog.Error("DB Error", "err", err)
		return nil, err
	}
	if len(songs) == 0 {
		return nil, ErrResourceNotFound
	}
	return songs, err
}
