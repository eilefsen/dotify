package models

import "log/slog"

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
type User struct {
	Credentials
	SuperUser bool   `json:"superuser"`
	ID        uint64 `json:"id"`
}

func (u User) New() (User, error) {
	res, err := db.Exec(
		`INSERT INTO user 
		(user.username, user.password, user.superuser)
		VALUES (?, ?, ?)`,
		u.Username,
		u.Password,
		u.SuperUser,
	)
	if err != nil {
		return u, err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return u, err
	}

	u.ID = uint64(id)
	slog.Info("models.User.New: success!")
	return u, nil
}

func GetUser(id uint64) (User, error) {
	var u User
	row := db.QueryRow("select * from user where user.id = ?", id)
	err := row.Scan(
		&u.ID,
		&u.Username,
		&u.Password,
		&u.SuperUser,
	)
	if err != nil {
		return User{}, err
	}
	return u, err
}

func GetUserByName(name string) (User, error) {
	var u User
	row := db.QueryRow("select * from user where user.username = ?", name)
	err := row.Scan(
		&u.ID,
		&u.Username,
		&u.Password,
		&u.SuperUser,
	)
	if err != nil {
		return User{}, err
	}
	return u, err
}
