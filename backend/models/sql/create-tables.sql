DROP TABLE IF EXISTS song;

DROP TABLE IF EXISTS album;

DROP TABLE IF EXISTS artist;

CREATE TABLE
  `artist` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `website` VARCHAR(255) DEFAULT "" NOT NULL,
    `img_src` VARCHAR(511) NOT NULL,
	UNIQUE (`name`)
  );

CREATE TABLE
  `album` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `artist_id` INT UNSIGNED NOT NULL,
    `img_src` VARCHAR(511) NOT NULL,
	UNIQUE(`title`, `artist_id`),
    FOREIGN KEY (`artist_id`) REFERENCES `artist` (`id`)
  );


CREATE TABLE
  `song` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `track` INT UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `artist_id` INT UNSIGNED NOT NULL,
    `src` VARCHAR(511) NOT NULL,
    `duration` INT UNSIGNED NOT NULL,
    `album_id` INT UNSIGNED NOT NULL,
    FOREIGN KEY (`album_id`) REFERENCES `album` (`id`),
    FOREIGN KEY (`artist_id`) REFERENCES `artist` (`id`)
  );


CREATE TABLE `user` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL UNIQUE,
    `password` TEXT NOT NULL,
    `superuser` BOOLEAN NOT NULL
);


CREATE TABLE
  `playlist` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
  );

CREATE TABLE
  `playlist_song` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `song_id` INT UNSIGNED NOT NULL,
    `playlist_id` INT UNSIGNED NOT NULL,
    FOREIGN KEY (`song_id`) REFERENCES `song` (`id`),
    FOREIGN KEY (`playlist_id`) REFERENCES `playlist` (`id`) ON DELETE CASCADE
  );
