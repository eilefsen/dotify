package main

import (
	"eilefsen/dotify-backend/models"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"

	"github.com/go-sql-driver/mysql"
)

func main() {
	cfg := mysql.Config{
		User:   os.Getenv("DBUSER"),
		Passwd: os.Getenv("DBPASS"),
		Net:    "tcp",
		Addr:   "127.0.0.1:3306",
		DBName: "dotify",
	}
	err := models.InitDB(cfg.FormatDSN())
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("DB Connected.")

	router := gin.Default()
	router.GET("/api/albums", func(c *gin.Context) {
		albums, err := models.AllAlbums()
		if err != nil {
			log.Fatal(err)
		}
		c.IndentedJSON(http.StatusOK, albums)
	})
	router.GET("/api/album/:albumId", func(c *gin.Context) {
		albumId, err := models.GetPathInt(c, "albumId")
		if err != nil {
			log.Fatal(err)
		}
		album, err := models.AlbumJSONByID(albumId)
		if err != nil {
			log.Fatal(err)
		}
		c.IndentedJSON(http.StatusOK, album)
	})
	router.GET("/api/artist/:artist", func(c *gin.Context) {
		albums, err := models.AlbumsByArtist(c.Param("artist"))
		if err != nil {
			log.Fatal(err)
		}
		c.IndentedJSON(http.StatusOK, albums)
	})
	router.GET("/api/songs", func(c *gin.Context) {
		songs, err := models.AllSongs()
		if err != nil {
			log.Fatal(err)
		}
		c.IndentedJSON(http.StatusOK, songs)
	})
	router.Run("localhost:3000")
}
