package main

import (
	"eilefsen/dotify-backend/models"
	"eilefsen/dotify-backend/utils"
	"encoding/json"
	"log/slog"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func FetchAllAlbums(w http.ResponseWriter, r *http.Request) {
	albums, err := models.Albums{}.All()
	if err == models.ErrResourceNotFound {
		slog.Error("FetchAllAlbums: No albums found", "error", err)
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if err != nil {
		slog.Error(err.Error())
	}
	slog.Debug("FetchAllAlbums", "albums", albums)

	responseJSON, err := json.Marshal(albums)
	if err != nil {
		slog.Error(err.Error())
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseJSON)
}

func FetchAlbumByID(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ParseUint32(chi.URLParam(r, "id"))
	if err != nil {
		slog.Error(err.Error())
		// An error here means that the id argument is not parseable as uint32.
		// Which is incorrect syntax, and therefore a Bad Request.
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	album, err := models.AlbumJSON{}.ByID(uint32(id))
	if err != nil {
		slog.Error("FetchAlbumByID: No album found", "id", id, "error", err)
		w.WriteHeader(http.StatusNotFound)
		return
	}
	slog.Debug("FetchAlbumByID:", "album", album)

	responseJSON, err := json.Marshal(album)
	if err != nil {
		slog.Error(err.Error())
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseJSON)
}

func FetchAlbumsByArtist(w http.ResponseWriter, r *http.Request) {
	id, err := utils.ParseUint32(chi.URLParam(r, "id"))
	if err != nil {
		slog.Error(err.Error())
		// An error here means that the id argument is not parseable as uint32.
		// Which is incorrect syntax, and therefore a Bad Request.
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	artist, err := models.Artist{}.ByID(id)
	if err == models.ErrResourceNotFound {
		slog.Error("FetchAlbumsByArtist: No artist found", "artist", artist, "error", err)
		w.WriteHeader(http.StatusNotFound)
		return
	}

	albums, err := models.Albums{}.ByArtist(artist.ID)
	if err == models.ErrResourceNotFound {
		slog.Error("FetchAlbumsByArtist: No album found", "artist", artist, "error", err)
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if err != nil {
		slog.Error("FetchAlbumsByArtist:", "error", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	slog.Debug("FetchAlbumByArtist:", "album", albums, "artist", artist)

	responseJSON, err := json.Marshal(albums)
	if err != nil {
		slog.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseJSON)
}

func FetchAllSongs(w http.ResponseWriter, r *http.Request) {
	songs, err := models.Songs{}.All()
	if err == models.ErrResourceNotFound {
		slog.Error("FetchAllSongs: No songs found", "error", err)
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if err != nil {
		slog.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	slog.Debug("FetchAllSongs", "songs", songs)

	responseJSON, err := json.Marshal(songs)
	if err != nil {
		slog.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseJSON)
}

func FetchAllArtists(w http.ResponseWriter, r *http.Request) {
	artists, err := models.Artists{}.All()
	if err == models.ErrResourceNotFound {
		slog.Error("FetchAllArtists: No artists found", "error", err)
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if err != nil {
		slog.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	slog.Debug("FetchAllArtists", "artists", artists)

	responseJSON, err := json.Marshal(artists)
	if err != nil {
		slog.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseJSON)
}
