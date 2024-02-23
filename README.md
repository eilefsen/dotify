## Setting up a local dev server
Clone this repository and set up a MySQL Server if you do not already have one.

### Database
1. Create a database and write down the name as an environment variable in .env (default is "dotify")
2. Create a new user and grant all permissions on the database you just created.
3. Write down the username and password in `/scripts/.env`
4. Run `source scripts/.env` to use the variables.
5. In the MySQL cli, source the sql scripts located in `/scripts/`
6. Copy your music albums as their own folders inside `/frontend/public/audio/`
    * Make sure your files and directories have no spaces or otherwise problematic characters (you can use the cli program `detox` for this)
8. Navigate to `/frontend/public/` and use the included shell function `addalbums audio/` (sourced by .env)
   * This builds an sql script at `/scripts/generated.sql` which inserts all songs (sourced recursively below the specified directory) into the database
   * It is important that you run the function from the html root directory (`/frontend/public/` in the case of the dev server). The script depends on this to enter the correct path of each song into the database.
10. Navigate to `/scripts/` (note the newly generated `/scripts/generated.sql` file)
    * Launch the mysql shell as the appropriate user at the appropriate database
    * `source generated.sql` (This will insert every song into the database)
### Backend
1. Build the binary with `go build .`
2. Make sure you sourced `/scripts/.env`
3. Run the built binary.

## Frontend
1. Navigate to `/frontend/`
2. Run npm install` and wait for it to complete.

3. Navigate to `/frontend/` and run `npm run dev` to start the vite dev server.
4. Open your browser and navigate to localhost:5173

## build for production

1. Set up the Database like in the section above.
2. Set up the Backend like above.
3. Set up the frontend like above.
4. In the frontend directory, run `npx vite build`.
   * This builds a production ready build in `/frontend/dist/`, which you simply put inside `/var/www/html/` (or another directory used by your web server)
