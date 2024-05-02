package models

import "log/slog"

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

func (p Playlist) AddSong(s Song) (Playlist, error) {
	_, err := db.Exec(
		`INSERT INTO playlist_song 
		(song_id, playlist_id)
		VALUES (?, ?)`,
		s.ID,
		p.ID,
	)
	if err != nil {
		slog.Error("models.Playlist.AddSong:", "playlist", p, "song", s)
		return p, err
	}
	slog.Info("models.Playlist.New", "playlist", p)
	return p, nil
}
