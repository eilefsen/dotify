package models

import (
	"database/sql"
	"fmt"
	"log/slog"
)

type Playlist struct {
	Name   string `json:"name"`
	UserID uint64 `json:"artist"`
	ID     uint32 `json:"id"`
}

// Junction table
type PlaylistSongJunction struct {
	ID         uint32 `json:"id"`
	PlaylistID uint32 `json:"playlistId"`
	SongID     uint32 `json:"songId"`
}

type PlaylistWithSongs struct {
	Songs Songs `json:"songs"`
	Playlist
}

func (p *Playlist) scan(r rowScanner) error {
	return r.Scan(
		&p.ID,
		&p.Name,
		&p.UserID,
	)
}

func (p Playlist) New() (Playlist, error) {
	res, err := db.Exec(
		`INSERT INTO playlist 
		(playlist.name, playlist.user_id)
		VALUES (?, ?)`,
		p.Name,
		p.UserID,
	)
	if err != nil {
		return p, err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return p, err
	}
	p.ID = uint32(id)
	slog.Info("models.Playlist.New", "playlist", p)
	return p, nil
}

func (p Playlist) AddSong(s Song) error {
	_, err := db.Exec(
		`INSERT INTO playlist_song 
		(song_id, playlist_id)
		VALUES (?, ?)`,
		s.ID,
		p.ID,
	)
	if err != nil {
		slog.Error("models.Playlist.AddSong:", "playlist", p, "song", s)
		return err
	}
	slog.Info("models.Playlist.New", "playlist", p)
	return nil
}

func (p Playlist) AddSongs(songs Songs) error {
	for i, s := range songs {
		err := p.AddSong(s)
		if err != nil {
			slog.Error("models.Playlist.AddSongs", "failed_iteration", i, "song", s, "songs", songs, "playlist", p, "error", err)
			return err
		}
	}
	return nil
}

func (Playlist) ByID(id uint32) (Playlist, error) {
	row := db.QueryRow("SELECT * FROM playlist WHERE id = ?", id)
	var p Playlist
	err := p.scan(row)
	if err == sql.ErrNoRows {
		slog.Info("models.Playlist.ByID: No playlist found", "id", id, "error", err)
		return p, ErrResourceNotFound
	} else if err != nil {
		slog.Error("models.Playlist.ByID", "id", id, "error", err)
		return p, fmt.Errorf("Song.ById %q: %v", id, err)
	}
	return p, nil
}

func (Playlist) All() ([]Playlist, error) {
	var playlists []Playlist
	rows, err := db.Query("SELECT * FROM playlist")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var p Playlist
		err := p.scan(rows)
		if err != nil {
			return nil, err
		}
		playlists = append(playlists, p)
	}
	if err := rows.Err(); err != nil {
		slog.Error("DB Error", "err", err)
		return nil, err
	}
	if len(playlists) == 0 {
		return nil, ErrResourceNotFound
	}
	return playlists, nil
}

func (Playlist) ByUser(id uint64) ([]Playlist, error) {
	var playlists []Playlist
	rows, err := db.Query("SELECT * FROM playlist WHERE playlist.user_id = ?", id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var p Playlist
		err := p.scan(rows)
		if err != nil {
			return nil, err
		}
		playlists = append(playlists, p)
	}
	if err := rows.Err(); err != nil {
		slog.Error("DB Error", "err", err)
		return nil, err
	}
	if len(playlists) == 0 {
		return nil, ErrResourceNotFound
	}
	return playlists, nil
}
