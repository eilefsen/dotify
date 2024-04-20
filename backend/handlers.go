package main

import (
	"bytes"
	"dotify/backend/models"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/dhowden/tag"
	"github.com/go-chi/chi/v5"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
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
	id, err := ParseUint32(chi.URLParam(r, "id"))
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
	id, err := ParseUint32(chi.URLParam(r, "id"))
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
	artists, err := models.ArtistsJSON{}.All()
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

func login(w http.ResponseWriter, r *http.Request) {
	var creds models.Credentials

	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		// If the structure of the body is wrong, return an HTTP error
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	u, err := models.GetUserByName(creds.Username)
	if err != nil {
		slog.Error("login: Could not get user", "username", creds.Username)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(creds.Password))
	if err != nil {
		slog.Info("login: Invalid login", "username", creds.Username)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	atExpire := time.Now().Add(5 * time.Minute)
	rtExpire := time.Now().Add(24 * time.Hour)
	atString, err := NewAccessTokenString(u, atExpire)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		slog.Error("login: NewAccessTokenString:", "err", err)
		return
	}
	rtString, err := NewRefreshTokenString(u, rtExpire)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		slog.Error("login: NewRefreshTokenString:", "err", err)
		return
	}
	atCookie := http.Cookie{
		Name:     "access_token",
		Value:    atString,
		HttpOnly: true,
		Path:     "/",
		Expires:  atExpire,
		Secure:   true, // enable for production
		SameSite: http.SameSiteLaxMode,
		Domain:   os.Getenv("DOMAIN"),
	}

	http.SetCookie(w, &atCookie)
	rtCookie := http.Cookie{
		Name:     "refresh_token",
		Value:    rtString,
		HttpOnly: true,
		Path:     "/",
		Expires:  rtExpire,
		Secure:   true, // enable for production
		SameSite: http.SameSiteLaxMode,
		Domain:   os.Getenv("DOMAIN"),
	}

	http.SetCookie(w, &rtCookie)
}

func authRefreshHandler(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("refresh_token")
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	rtString := cookie.Value
	rt, err := jwt.Parse(rtString, func(token *jwt.Token) (any, error) {
		return settings.Key, nil
	})
	if err != nil {
		if err == jwt.ErrTokenInvalidClaims {
			w.WriteHeader(http.StatusUnauthorized)
			slog.Error("TokenAuth:", "err", err)
			return
		}
		if err == jwt.ErrSignatureInvalid {
			w.WriteHeader(http.StatusUnauthorized)
			slog.Error("TokenAuth:", "err", err)
			return
		}
		slog.Error("TokenAuth:", "err", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	if !rt.Valid {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	var subject string
	subject, err = rt.Claims.GetSubject()
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	var userID uint32
	userID, err = ParseUint32(subject)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	u, err := models.GetUser(userID)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	atExpire := time.Now().Add(5 * time.Minute)
	atString, err := NewAccessTokenString(u, atExpire)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		slog.Error("refresh: NewAccessTokenString:", "err", err)
		return
	}
	atCookie := http.Cookie{
		Name:     "access_token",
		Value:    atString,
		HttpOnly: true,
		Path:     "/",
		Expires:  atExpire,
		// Secure:   true, // enable for production
		SameSite: http.SameSiteLaxMode,
		Domain:   os.Getenv("DOMAIN"),
	}

	http.SetCookie(w, &atCookie)
}

func logoutHandler(w http.ResponseWriter, _ *http.Request) {
	c := &http.Cookie{
		Name:     "access_token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Domain:   os.Getenv("DOMAIN"),
	}
	http.SetCookie(w, c)

	c = &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Domain:   os.Getenv("DOMAIN"),
	}
	http.SetCookie(w, c)
}

func authStatusHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}

func uploadAudioFiles(w http.ResponseWriter, r *http.Request) {
	batchID := uuid.New()
	uploadsDir := fmt.Sprintf("/audio/upload/%s/", batchID.String())
	relativePath := "./dist"
	err := os.MkdirAll(relativePath+uploadsDir, os.ModePerm)
	if err != nil {
		slog.Error("uploadAudioFiles: Failed to make directory")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := r.ParseMultipartForm(20 << 20); err != nil {
		slog.Error("uploadAudioFiles", "err", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	audioFH := r.MultipartForm.File["audioFiles[]"]

	var imgsrc string

	{
		f, fh, err := r.FormFile("image")
		if err != nil {
			slog.Error("uploadAudioFiles: Failed to retrieve image from form", "err", err)
			http.Error(w, err.Error(), http.StatusBadRequest)
		}
		defer f.Close()

		fileName := fmt.Sprintf("%s%s", uuid.New().String(), filepath.Ext(fh.Filename))
		imgsrc = uploadsDir + fileName
		fullPath := relativePath + imgsrc

		// write file
		dst, err := os.Create(fullPath)
		if err != nil {
			slog.Error("uploadAudioFiles: Failed to create image file", "filename", fileName)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer dst.Close()

		// Copy the uploaded file to the filesystem
		// at the specified destination
		_, err = io.Copy(dst, f)
		if err != nil {
			slog.Error("uploadAudioFiles: Failed to copy image file to destination")
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	var artist models.Artist
	var album models.Album

	{
		fh := audioFH[0]
		f, err := fh.Open()
		if err != nil {
			slog.Error("uploadAudioFiles: Failed to retrieve files from form", "err", err)
			http.Error(w, err.Error(), http.StatusBadRequest)
		}
		defer f.Close()
		m, err := tag.ReadFrom(f)
		if err != nil {
			slog.Error("uploadAudioFiles: Missing metadata", "Filename", fh.Filename)
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		slog.Debug("uploadAudioFiles", "m", m)
		artist, err = models.Artist{}.New(m.Artist())
		if err != nil {
			slog.Debug("uploadAudioFiles: Failed to insert Artist to database", "err", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		album, err = models.Album{}.New(models.AlbumNoID{Title: m.Album(), Artist: artist, ImgSrc: imgsrc})
		if err != nil {
			slog.Debug("uploadAudioFiles: Failed to insert Album to database", "err", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	for _, fh := range audioFH {
		f, err := fh.Open()
		if err != nil {
			slog.Debug("uploadAudioFiles: Failed to retrieve files from form", "err", err)
			http.Error(w, err.Error(), http.StatusBadRequest)
		}
		defer f.Close()
		fileName := fmt.Sprintf("%s%s", uuid.New().String(), filepath.Ext(fh.Filename))

		src := uploadsDir + fileName
		fullPath := relativePath + src

		m, err := tag.ReadFrom(f)
		if err != nil {
			slog.Debug("uploadAudioFiles: Missing metadata", "Filename", fh.Filename)
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		slog.Debug("uploadAudioFiles", "m", m)

		duration := uint32(0)
		var buf bytes.Buffer
		if m.FileType() == tag.MP3 {
			tee := io.TeeReader(f, &buf)

			duration, err = EstimateMP3Duration(tee)
			if err != nil {
				slog.Debug("uploadAudioFiles: Failed to calculate mp3 length", "Filename", fh.Filename)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}

		trackNumber, _ := m.Track()
		_, err = models.Song{}.New(models.SongNoID{
			Title:    m.Title(),
			Artist:   artist,
			Album:    album,
			Src:      src,
			Track:    uint32(trackNumber),
			Duration: duration,
		})
		if err != nil {
			slog.Debug("uploadAudioFiles: Failed to insert Song to database", "err", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// write file
		dst, err := os.Create(fullPath)
		if err != nil {
			slog.Debug("uploadAudioFiles: Failed to create file", "filename", fileName)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer dst.Close()

		// Copy the uploaded file (buf) to the filesystem
		// at the specified destination
		_, err = io.Copy(dst, &buf)
		if err != nil {
			slog.Debug("uploadAudioFiles: Failed to copy file to destination")
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}
