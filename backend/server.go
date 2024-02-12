package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"

	"github.com/go-sql-driver/mysql"
)

type song struct {
	ID       string `json:"id"`
	Title    string `json:"title"`
	Artist   string `json:"artist"`
	Src      string `json:"src"`
	Duration string `json:"duration"`
	AlbumID  string `json:"albumId"`
}

type album struct {
	ID     string `json:"id"`
	Title  string `json:"title"`
	Artist string `json:"artist"`
	ImgSrc string `json:"imgSrc"`
	Songs  []song `json:"songs"`
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
		return
	})
	router.GET("/api/album/:id", func(c *gin.Context) {
		return
	})
	router.GET("/api/songs", func(c *gin.Context) {
		return
	})

	router.Run("localhost:3000")
}
