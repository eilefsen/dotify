package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func getAlbum(c *gin.Context) {
	id := c.Param("id")

	for _, v := range albums {
		if v.ID == id {
			c.IndentedJSON(http.StatusOK, v)
			return
		}
	}
}

func getSongs(c *gin.Context) {
	var songs []song

	for _, v := range albums {
		songs = append(songs, v.Songs...)
	}

	c.IndentedJSON(http.StatusOK, songs)
}

func main() {
	router := gin.Default()
	router.GET("/api/albums", func(c *gin.Context) {
		c.IndentedJSON(http.StatusOK, albums)
	})
	router.GET("/api/album/:id", getAlbum)
	router.GET("/api/songs", getSongs)

	router.Run("localhost:3000")
}
