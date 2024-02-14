## Setting up a local dev server
Clone this repository and set up a MySQL Server if you do not already have one.

1. Create a database and write down the name as an environment variable in .env (default is "dotify")
2. Create a new user and grant all permissions on the database you just created.
3. Write down the username and password in backend/.env
4. Run `source backend/.env` to use the variables.
5. In the MySQL cli, source the sql scripts located in backend/models/sql/
  * First run create-tables.sql, then populate-tables.sql
6. Run `cd frontend && npm install` and wait for it to complete.
7. Run `npm run dev` to start the vite dev server.
8. Open your browser and navigate to localhost:5173
