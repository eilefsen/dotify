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
	// protected routes
	rt.Group(func(rt chi.Router) {
		rt.Post("/api/auth/status", TokenAuth(authStatusHandler))
		rt.Post("/api/auth/adminstatus", SuperUserAuth(authStatusHandler))
		rt.Post("/api/admin/upload", SuperUserAuth(uploadAudioFiles))
		rt.Put("/api/admin/artists/{id}", SuperUserAuth(UpdateArtist))
		rt.Put("/api/admin/albums/{id}", SuperUserAuth(UpdateAlbum))
		rt.Put("/api/admin/songs/{id}", SuperUserAuth(UpdateSong))
		rt.Delete("/api/admin/albums/{id}", SuperUserAuth(DeleteAlbum))
		rt.Delete("/api/admin/artists/{id}", SuperUserAuth(DeleteArtist))
		rt.Post("/api/auth/refresh", authRefreshHandler)
		rt.Get("/api/playlists", TokenAuth(FetchPlaylists))
		rt.Get("/api/playlists/{id}", TokenAuth(FetchPlaylistByID))
		rt.Get("/api/playlists/{id}/songs", TokenAuth(FetchPlaylistSongsByID))
		rt.Post("/api/playlists/{playlistID}/songs/add/{songID}", TokenAuth(AddSongToPlaylist))
		rt.Put("/api/playlists/{id}/edit-name", TokenAuth(EditPlaylistName))
		rt.Delete("/api/playlists/{id}", TokenAuth(DeletePlaylist))
		rt.Post("/api/playlists/new", TokenAuth(NewPlaylist))
	})
	// unprotected routes
	rt.Group(func(rt chi.Router) {
		rt.Post("/api/auth/login", login)
		rt.Post("/api/auth/logout", logoutHandler)
		rt.Get("/api/albums", FetchAllAlbums)
		rt.Get("/api/albums/{id}", FetchAlbumByID)
		rt.Get("/api/artists", FetchAllArtists)
		rt.Get("/api/albums/artist/{id}", FetchAlbumsByArtist)
		rt.Get("/api/artists/{id}", FetchArtist)
		rt.Get("/api/artist_only/{id}", FetchArtist)
		rt.Get("/api/artists_no_img", FetchAllArtists)
		rt.Get("/api/songs", FetchAllSongs)
	})

	http.ListenAndServe(":"+os.Getenv("BACKEND_PORT"), rt)
}
