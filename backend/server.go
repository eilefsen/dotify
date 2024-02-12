package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/go-sql-driver/mysql"
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

func main() {
	cfg := mysql.Config{
		User:   os.Getenv("DBUSER"),
		Passwd: os.Getenv("DBPASS"),
		Net:    "tcp",
		Addr:   "127.0.0.1:3306",
		DBName: "dotify",
	}

	var err error
	db, err = sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		log.Fatal(err)
	}

	pingErr := db.Ping()
	if pingErr != nil {
		log.Fatal(pingErr)
	}
	fmt.Println("DB Connected.")

	router := gin.Default()
	router.GET("/api/albums", func(c *gin.Context) {
		albums, err := allAlbums()
		if err != nil {
			log.Fatal(err)
		}
		c.IndentedJSON(http.StatusOK, albums)
	})
	router.GET("/api/album/:albumId", func(c *gin.Context) {
		albumId, err := GetPathInt(c, "albumId")
		if err != nil {
			log.Fatal(err)
		}
		songs, err := songsByAlbum(albumId)
		if err != nil {
			log.Fatal(err)
		}
		alb, err := albumById(albumId)
		if err != nil {
			log.Fatal(err)
		}
		var songsJson []SongJSON
		for _, v := range songs {
			s := SongJSON{
				Song:   v,
				ImgSrc: alb.ImgSrc,
			}
			songsJson = append(songsJson, s)
		}
		album := AlbumJSON{
			Album: alb,
			Songs: songsJson,
		}

		c.IndentedJSON(http.StatusOK, album)
	})
	router.GET("/api/artist/:artist", func(c *gin.Context) {
		albums, err := albumsByArtist(c.Param("artist"))
		if err != nil {
			log.Fatal(err)
		}
		c.IndentedJSON(http.StatusOK, albums)
	})
	router.GET("/api/songs", func(c *gin.Context) {
		songs, err := allSongs()
		if err != nil {
			log.Fatal(err)
		}
		c.IndentedJSON(http.StatusOK, songs)
	})

	router.Run("localhost:3000")
}

func allAlbums() ([]Album, error) {
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

func allSongs() ([]SongJSON, error) {
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

func albumsByArtist(name string) ([]Album, error) {
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

func albumById(id uint32) (Album, error) {
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

func songsByAlbum(albumId uint32) ([]Song, error) {
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
