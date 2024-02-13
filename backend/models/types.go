package models

type Song struct {
	ID       uint32 `json:"id"`
	Title    string `json:"title"`
	Artist   string `json:"artist"`
	Src      string `json:"src"`
	Duration uint32 `json:"duration"`
	AlbumID  uint32 `json:"albumId"`
}

type Album struct {
	ID     uint32 `json:"id"`
	Title  string `json:"title"`
	Artist string `json:"artist"`
	ImgSrc string `json:"imgSrc"`
}

type AlbumJSON struct {
	Album
	Songs []SongJSON `json:"songs"`
}
type SongJSON struct {
	Song
	ImgSrc string `json:"imgSrc"`
}
