package main

import (
	"context"
	"dotify/backend/models"
	"fmt"
	"log/slog"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

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

// setUser adds a user to a context, returning
// a new context with the user attached
func setUser(ctx context.Context, u *models.User) context.Context {
	return context.WithValue(ctx, "user", u)
}

// getUser returns an instance of User,
// if set, from the given context
func getUser(ctx context.Context) (*models.User, error) {
	user, ok := ctx.Value("user").(*models.User)

	if !ok {
		return user, fmt.Errorf("getuser: failed to get user, is the user authenticated?")
	}

	return user, nil
}

func TokenAuth(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString, err := getTokenStringFromRequest(r)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			slog.Error("TokenAuth r.Cookie():", "err", err)
			return
		}

		var claims CustomClaims
		token, err := jwt.ParseWithClaims(tokenString, &claims, func(token *jwt.Token) (any, error) {
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
		subject, err := token.Claims.GetSubject()
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			slog.Error("TokenAuth: could not get user id", "err", err)
			return
		}
		userID, err := ParseUint32(subject)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			slog.Error("TokenAuth: could not parse user id as an integer", "err", err)
			return
		}
		ctx := setUser(r.Context(), &models.User{ID: userID})
		newReq := r.WithContext(ctx)
		next.ServeHTTP(w, newReq)
	})
}
