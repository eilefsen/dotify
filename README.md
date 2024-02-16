## Setting up a local dev server
Clone this repository and set up a MySQL Server if you do not already have one.

1. Create a database and write down the name as an environment variable in .env (default is "dotify")
2. Create a new user and grant all permissions on the database you just created.
3. Write down the username and password in backend/.env
4. Run `source backend/.env` to use the variables.
5. In the MySQL cli, source the sql scripts located in backend/models/sql/
7. Run `cd frontend && npm install` and wait for it to complete.
6. Copy your music albums as their own folders
    * Refer to my album in `public/audio/City_Jeans-Grasshopper` for an example of how to format your albums
        * (this is basically how all album directories look, so should work out of the box)
    * Make sure your files and directories have no spaces or otherwise problematic characters
        * (you can use the cli program `detox` for this)
8. Run `npm run dev` to start the vite dev server.
9. Open your browser and navigate to localhost:5173
