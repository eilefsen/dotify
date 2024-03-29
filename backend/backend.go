package main

import (
	"dotify/backend/models"
	"log/slog"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/httprate"

	"github.com/go-sql-driver/mysql"
	"github.com/lmittmann/tint"
)

func main() {
	slog.SetDefault(slog.New(
		tint.NewHandler(os.Stdout, &tint.Options{
			Level: slog.LevelDebug,
		}),
	))
	dbcfg := mysql.Config{
		User:                 os.Getenv("DBUSER"),
		Passwd:               os.Getenv("DBPASS"),
		Net:                  "tcp",
		Addr:                 "127.0.0.1:3306",
		DBName:               os.Getenv("DBNAME"),
		AllowNativePasswords: true,
	}
	err := models.InitDB(dbcfg.FormatDSN())
	if err != nil {
		slog.Error(err.Error())
		os.Exit(1)
	}
	slog.Info("DB connected.", "Addr", dbcfg.Addr, "DBName", dbcfg.DBName)

	rt := chi.NewRouter()
	rt.Use(middleware.Logger)
	rt.Use(httprate.Limit(
		20,            // requests
		5*time.Second, // per duration
		httprate.WithLimitHandler(func(w http.ResponseWriter, r *http.Request) {
			http.Error(w, "You've been rate limited", http.StatusTooManyRequests)
		}),
	))
	rt.Get("/api/albums", FetchAllAlbums)
	rt.Get("/api/album/{id}", FetchAlbumByID)
	rt.Get("/api/artists", FetchAllArtists)
	rt.Get("/api/albums/artist/{id}", FetchAlbumsByArtist)
	rt.Get("/api/songs", FetchAllSongs)
	http.ListenAndServe(":"+os.Getenv("BACKEND_PORT"), rt)
}
