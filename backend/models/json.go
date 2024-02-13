package models

import "fmt"

func AlbumJSONByID(id uint32) (AlbumJSON, error) {
	var albumJson AlbumJSON

	alb, err := AlbumById(id)
	if err != nil {
		return albumJson, fmt.Errorf("AlbumJSONByID: %v", err)
	}
	songs, err := SongsByAlbum(id)
	if err != nil {
		return albumJson, fmt.Errorf("AlbumJSONByID: %v", err)
	}

	var songsJson []SongJSON
	for _, v := range songs {
		s := SongJSON{
			Song:   v,
			ImgSrc: alb.ImgSrc,
		}
		songsJson = append(songsJson, s)
	}
	albumJson = AlbumJSON{
		Album: alb,
		Songs: songsJson,
	}
	return albumJson, nil
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
