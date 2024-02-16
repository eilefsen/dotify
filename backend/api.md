# Endpoints

1. /api/songs
    * status codes
        1. 200
        2. 204 (No Content, used instead of empty response)
2. /api/albums
    * status codes
        1. 200
        2. 204 (No Content, used instead of empty response)
3. /api/album/{id: uint32}
    * status codes
        1. 200
        2. 400 (Bad Request, caused by invalid syntax/type)
        3. 404 (Not Found, caused by no matching album id in database)
4. /api/artists
    * status codes
        1. 200
        2. 204 (No Content, used instead of empty response)
5. /api/artist/{name: string}
    * status codes
        1. 200
        2. 204 (No Content, used instead of empty response)
        3. 404 (Not Found, caused by no albums with matching artist name in database)
