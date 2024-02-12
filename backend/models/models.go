package models

import (
	"database/sql"
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Song struct {
	ID       uint32 `json:"id"`
	Title    string `json:"title"`
	Artist   string `json:"artist"`
	Src      string `json:"src"`
	Duration uint32 `json:"duration"`
	AlbumID  uint32 `json:"albumId"`
}

type Album struct {
	ID     uint32 `json:"id"`
	Title  string `json:"title"`
	Artist string `json:"artist"`
	ImgSrc string `json:"imgSrc"`
}

type AlbumJSON struct {
	Album
	Songs []SongJSON `json:"songs"`
}
type SongJSON struct {
	Song
	ImgSrc string `json:"imgSrc"`
}

var db *sql.DB

func InitDB(dataSourceName string) error {
	var err error

	db, err = sql.Open("mysql", dataSourceName)
	if err != nil {
		return err
	}

	return db.Ping()
}

func AllAlbums() ([]Album, error) {
	var albums []Album

	rows, err := db.Query("SELECT * FROM album")
	if err != nil {
		return nil, fmt.Errorf("albumsByArtist: %v", err)
	}
	defer rows.Close()
	for rows.Next() {
		var alb Album
		err := rows.Scan(&alb.ID, &alb.Title, &alb.Artist, &alb.ImgSrc)
		if err != nil {
			return nil, fmt.Errorf("albumsByArtist: %v", err)
		}
		albums = append(albums, alb)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("albumsByArtist: %v", err)
	}
	return albums, nil
}

func AllSongs() ([]SongJSON, error) {
	var songs []SongJSON

	rows, err := db.Query("SELECT song.id, song.title, song.artist, song.src, song.duration, song.album_id, album.img_src FROM song INNER JOIN album ON album_id=album.id")
	if err != nil {
		return nil, fmt.Errorf("allSongs: %v", err)
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
			return nil, fmt.Errorf("allSongs: %v", err)
		}
		songs = append(songs, song)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("allSongs: %v", err)
	}
	return songs, nil
}

func AlbumsByArtist(name string) ([]Album, error) {
	var albums []Album

	rows, err := db.Query("SELECT * FROM album WHERE artist = ?", name)
	if err != nil {
		return nil, fmt.Errorf("albumsByArtist %q: %v", name, err)
	}
	defer rows.Close()
	for rows.Next() {
		var alb Album
		err := rows.Scan(&alb.ID, &alb.Title, &alb.Artist, &alb.ImgSrc)
		if err != nil {
			return nil, fmt.Errorf("albumsByArtist %q: %v", name, err)
		}
		albums = append(albums, alb)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("albumsByArtist %q: %v", name, err)
	}
	return albums, nil
}

func AlbumById(id uint32) (Album, error) {
	var alb Album

	rows, err := db.Query("SELECT * FROM album WHERE id = ?", id)
	if err != nil {
		return alb, fmt.Errorf("albumById %q: %v", id, err)
	}
	defer rows.Close()

	rows.Next()
	if err := rows.Scan(&alb.ID, &alb.Title, &alb.Artist, &alb.ImgSrc); err != nil {
		return alb, fmt.Errorf("albumById %q: %v", id, err)
	}
	if err := rows.Err(); err != nil {
		return alb, fmt.Errorf("albumById %q: %v", id, err)
	}
	return alb, nil
}

func SongsByAlbum(albumId uint32) ([]Song, error) {
	var songs []Song

	rows, err := db.Query("SELECT * FROM song WHERE album_id = ?", albumId)
	if err != nil {
		return nil, fmt.Errorf("albumsByArtist %q: %v", albumId, err)
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
			return nil, fmt.Errorf("albumsByArtist %q: %v", albumId, err)
		}
		songs = append(songs, song)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("albumsByArtist %q: %v", albumId, err)
	}
	return songs, nil
}

func GetPathInt(c *gin.Context, name string) (uint32, error) {
	val := c.Params.ByName(name)
	if val == "" {
		return 0, fmt.Errorf("%q path parameter value is empty or not specified", name)
	}
	number, err := strconv.ParseUint(val, 10, 32)
	if err != nil {
		return 0, fmt.Errorf("GetPathInt %q: %v", name, err)
	}
	return uint32(number), nil

}
