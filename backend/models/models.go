package models

import (
	"database/sql"
	"log/slog"
)

var db *sql.DB

func InitDB(dataSourceName string) error {
	var err error
	db, err = sql.Open("mysql", dataSourceName)
	if err != nil {
		slog.Error("InitDB", "err", err)
		return err
	}
	return db.Ping()
}

// type which includes both *sql.Row and *sql.Rows
type rowScanner interface {
	Scan(dest ...any) error
	Err() error
}
