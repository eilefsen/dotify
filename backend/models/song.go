package models

import "fmt"

type Song struct {
	ID       uint32 `json:"id"`
	Title    string `json:"title"`
	Artist   string `json:"artist"`
	Src      string `json:"src"`
	Duration uint32 `json:"duration"`
	AlbumID  uint32 `json:"albumId"`
}

type SongJSON struct {
	Song
	ImgSrc string `json:"imgSrc"`
}

func SongsByAlbum(albumId uint32) ([]Song, error) {
	var songs []Song

	rows, err := db.Query("SELECT * FROM song WHERE album_id = ?", albumId)
	if err != nil {
		return nil, fmt.Errorf("SongsByAlbum %q: %v", albumId, err)
	}
	defer rows.Close()
	for rows.Next() {
		var song Song
		err := rows.Scan(
			&song.ID,
			&song.Title,
			&song.Artist,
			&song.Src,
			&song.Duration,
			&song.AlbumID,
		)
		if err != nil {
			return nil, fmt.Errorf("SongsByAlbum %q: %v", albumId, err)
		}
		songs = append(songs, song)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("SongsByAlbum %q: %v", albumId, err)
	}
	if len(songs) == 0 {
		return nil, ErrResourceNotFound
	}
	return songs, nil
}

func AllSongsJSON() ([]SongJSON, error) {
	var songs []SongJSON

	query := `
    SELECT song.*, album.img_src FROM song
    INNER JOIN album ON album_id=album.id
    `

	rows, err := db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("AllSongs: %v", err)
	}
	defer rows.Close()
	for rows.Next() {
		var song SongJSON
		err := rows.Scan(
			&song.ID,
			&song.Title,
			&song.Artist,
			&song.Src,
			&song.Duration,
			&song.AlbumID,
			&song.ImgSrc,
		)
		if err != nil {
			return nil, fmt.Errorf("AllSongs: %v", err)
		}
		songs = append(songs, song)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("AllSongs: %v", err)
	}
	return songs, nil
}

func SongsJSONByAlbum(albumId uint32) ([]SongJSON, error) {
	var songs []SongJSON

	query := `
    SELECT song.* album.img_src FROM song
    WHERE album_id = ? INNER JOIN album ON album.id=song.album_id
    `

	rows, err := db.Query(query, albumId)
	if err != nil {
		return nil, fmt.Errorf("SongsJSONByAlbum %q: %v", albumId, err)
	}
	defer rows.Close()
	for rows.Next() {
		var song SongJSON
		err := rows.Scan(
			&song.ID,
			&song.Title,
			&song.Artist,
			&song.Src,
			&song.Duration,
			&song.AlbumID,
			&song.ImgSrc,
		)
		if err != nil {
			return nil, fmt.Errorf("SongsJSONByAlbum %q: %v", albumId, err)
		}
		songs = append(songs, song)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("SongsJSONByAlbum %q: %v", albumId, err)
	}
	return songs, nil
}
