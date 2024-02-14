package models

import (
	"fmt"
	"log/slog"
)

func AlbumJSONByID(id uint32) (AlbumJSON, error) {
	albumJson := AlbumJSON{
		Songs: []SongJSON{},
	}

	alb, err := AlbumById(id)
	if err != nil {
		return albumJson, fmt.Errorf("AlbumJSONByID: %v", err)
	}
	songs, err := SongsByAlbum(id)
	if err == ErrResourceNotFound {
		slog.Info("AlbumJSONByID: no songs found", "album", alb)
	} else if err != nil {
		return albumJson, fmt.Errorf("AlbumJSONByID: %v", err)
	}

	songsJson := []SongJSON{}
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
func AlbumsJSONByArtist(artist string) ([]AlbumJSON, error) {
	albumsJson := []AlbumJSON{
		{
			Songs: []SongJSON{},
		},
	}
	slog.Debug("AlbumsJSONByArtist: ", "albumsJson", albumsJson)

	albums, err := AlbumsByArtist(artist)
	if err != nil {
		return albumsJson, fmt.Errorf("AlbumJSONByID: %v", err)
	}
	for _, a := range albums {
		songs, err := SongsByAlbum(a.ID)
		if err != nil {
			return albumsJson, fmt.Errorf("AlbumJSONByID: %v", err)
		}

		songsJson := []SongJSON{}
		for _, v := range songs {
			s := SongJSON{
				Song:   v,
				ImgSrc: a.ImgSrc,
			}
			songsJson = append(songsJson, s)
		}
		albumsJson = append(albumsJson, AlbumJSON{
			Album: a,
			Songs: songsJson,
		})
	}

	return albumsJson, nil
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
