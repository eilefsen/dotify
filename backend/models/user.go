package models

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
type User struct {
	Credentials
	SuperUser bool   `json:"superuser"`
	ID        uint32 `json:"id"`
}

func GetUser(id uint32) (User, error) {
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
