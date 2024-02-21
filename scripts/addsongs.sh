#!/bin/bash

addalbums () {
	echo "" > "$DOTIFY_SCRIPT_DIR/generated.sql"
	for d in $1/*/ ; do
		echo $(addsongs $d) >> "$DOTIFY_SCRIPT_DIR/generated.sql"
	done
}

addsongs () {
    json=$(exiftool $1 -j -q -track -title -artist -album '-duration#' | jq '.')

    songs=$(echo $json | jq -r '[.[] | select(.SourceFile | endswith("mp3") or endswith("m4a") or endswith("flac"))]')
    artist_name=$(echo $songs | jq '[.[].Artist | select(. != null)].[0]')
    album_title=$(echo $songs | jq '[.[].Album | select(. != null)].[0]')
    album_img_src="\"/$(echo $json | jq -r '[.[].SourceFile | select(. | endswith("png") or endswith("jpg"))].[0]')\""

    # artist query works
    query_artist="
    INSERT INTO
      artist (name)
    SELECT ${artist_name}
    WHERE NOT EXISTS
        (
        SELECT name
        FROM artist
	WHERE UPPER(name) LIKE UPPER(${artist_name})
        );
    "
    echo $query_artist

    query_album="
    INSERT INTO
      album (title, artist_id, img_src)
    SELECT
      $album_title,
      (
        SELECT
          id
        FROM
          artist
        WHERE
	  UPPER(name) LIKE UPPER($artist_name)
      ),
      $album_img_src
    WHERE
      NOT EXISTS (
        SELECT
          title,
          artist_id,
          artist.id as joined_id
        FROM
          album
          INNER JOIN artist ON artist.id = artist_id
        WHERE
	UPPER(title) LIKE UPPER($album_title)
          AND artist_id = artist.id
      );
    "
    echo $query_album

    echo $songs | jq -c '.[]' | while read song; do
    song_track=$(echo $song | jq '.Track' | cut -f1 -d'/' | cut -f2 -d'"')
        song_title=$(echo $song | jq '.Title')
        song_src="\"/$(echo $song | jq -r '.SourceFile')\""
        song_duration=$(echo $song | jq '.Duration')
        printf -v song_duration "%.0f" $song_duration

        query_song="
        INSERT INTO
          song (song.track, song.title, song.artist_id, song.src, song.duration, song.album_id)
        SELECT
          $song_track,
          $song_title,
          (
            SELECT
              id
            FROM
              artist
            WHERE
              UPPER(name) LIKE UPPER($artist_name)
          ),
          $song_src,
          $song_duration,
          (
            SELECT
              id
            FROM
              album
            WHERE
              album.title = $album_title
          )
        WHERE
          NOT EXISTS (
            SELECT
              song.title,
              song.artist_id,
              artist.id as joined_id,
              album.id as joined_id2
            FROM
              song
              INNER JOIN artist ON artist.id = song.artist_id
              INNER JOIN album ON album.id = song.artist_id
            WHERE
	      UPPER(song.title) LIKE UPPER($song_title)
              AND song.artist_id = artist.id
              AND song.album_id = album.id
          );
        "
        echo $query_song
    done
}
