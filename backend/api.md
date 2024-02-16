# Endpoints

1. /api/songs
    * Type: Songs ([]Song)
    * status codes
        1. 200
        2. 204 (No Content, used instead of empty response)
2. /api/albums
    * Type: Albums ([]Album)
    * status codes
        1. 200
        2. 204 (No Content, used instead of empty response)
3. /api/album/{id: uint32}
    * Type: AlbumJSON
    * status codes
        1. 200
        2. 400 (Bad Request, caused by invalid syntax/type)
        3. 404 (Not Found, caused by no matching album id in database)
4. /api/albums/artist/{name: string}
    * Type: Albums ([]Album)
    * status codes
        1. 200
        2. 204 (No Content, used instead of empty response)
        3. 404 (Not Found, caused by no albums with matching artist name in database)
5. /api/artists
    * Type: ArtistsJSON ([]ArtistJSON)
    * status codes
        1. 200
        2. 204 (No Content, used instead of empty response)
