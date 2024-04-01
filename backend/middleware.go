package main

import (
	"log/slog"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

func SuperUserAuth(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString, err := getTokenStringFromRequest(r)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			slog.Error("TokenAuth r.Cookie():", "err", err)
			return
		}

		claims := &CustomClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (any, error) {
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
		if !token.Valid {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		if !claims.SuperUser {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func getTokenStringFromRequest(r *http.Request) (string, error) {
	tokenString := r.Header.Get("Authorization")
	if tokenString == "" || tokenString == "Bearer" {
		cookie, err := r.Cookie("access_token")
		tokenString = cookie.Value
		if err != nil {
			return "", err
		}
	}
	tokenString = strings.ReplaceAll(tokenString, "Bearer ", "")
	return tokenString, nil
}
