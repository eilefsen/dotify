package models

import (
	"errors"
)

// Returned when no resources matching a query exist.
// Similar to database/sql.ErrNoRows
var ErrResourceNotFound = errors.New("models: could not find resources")
