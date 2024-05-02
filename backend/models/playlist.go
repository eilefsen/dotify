package models

import "log/slog"

type Playlist struct {
	ID     uint32 `json:"id"`
	Name   string `json:"name"`
	UserID uint32 `json:"artist"`
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
