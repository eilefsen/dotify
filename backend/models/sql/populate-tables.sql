INSERT INTO
  artist (name)
VALUES
  ("City Jeans"),
  ("Weezer");

INSERT INTO
  album (title, artist_id, img_src)
VALUES
  (
    'Grasshopper',
    1,
    '/audio/City_Jeans-Grasshopper/cover.png'
  ),
  (
    'Blue Album',
    2,
    '/audio/Weezer-Blue_Album/Folder.jpg'
  );

INSERT INTO
  song (title, artist_id, src, duration, album_id)
VALUES
  (
    'Dogs',
    1,
    '/audio/City_Jeans-Grasshopper/01-Dogs.m4a',
    49,
    1
  ),
  (
    'Gas Station',
    1,
    '/audio/City_Jeans-Grasshopper/02-Gas_Station.m4a',
    88,
    1
  ),
  (
    'Grasshopper',
    1,
    '/audio/City_Jeans-Grasshopper/03-Grasshopper.m4a',
    94,
    1
  ),
  (
    "My Name Is Jonas",
    2,
    "/audio/Weezer-Blue_Album/01-My_Name_Is_Jonas.mp3",
    205,
    2
  ),
  (
    "No One Else",
    2,
    "/audio/Weezer-Blue_Album/02-No_One_Else.mp3",
    185,
    2
  ),
  (
    "The World Has Turned And Left Me Here",
    2,
    "/audio/Weezer-Blue_Album/03-The_World_Has_Turned_And_Left_Me_Here.mp3",
    159,
    2
  ),
  (
    "Buddy Holly",
    2,
    "/audio/Weezer-Blue_Album/04-Buddy_Holly.mp3",
    159,
    2
  ),
  (
    "Undone - The Sweater Song",
    2,
    "/audio/Weezer-Blue_Album/05-Undone-The_Sweater_Song.mp3",
    310,
    2
  ),
  (
    "Surf Wax America",
    2,
    "/audio/Weezer-Blue_Album/06-Surf_Wax_America.mp3",
    187,
    2
  ),
  (
    "Say It Ain't So",
    2,
    "/audio/Weezer-Blue_Album/07-Say_It_Ain't_So.mp3",
    259,
    2
  ),
  (
    "In The Garage",
    2,
    "/audio/Weezer-Blue_Album/08-In_The_Garage.mp3",
    236,
    2
  ),
  (
    "Holiday",
    2,
    "/audio/Weezer-Blue_Album/09-Holiday.mp3",
    205,
    2
  ),
  (
    "Only In Dreams",
    2,
    "/audio/Weezer-Blue_Album/10-Only_In_Dreams.mp3",
    479,
    2
  );
