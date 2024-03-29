# Storefront Backend Project
### Environment Setup
- git clone this repo
- inside the project directory and create a files named `.env`
- inside the `.env` file, define all the environment variables listed below -
    ```
    POSTGRES_PASSWORD
    DB_USER
    DB
    DB_TEST
    DB_PASSWORD
    DB_HOST
    BYCRYPT_PASSWORD
    SALT_ROUNDS
    JWT_TOKEN_SECRET
    ENV
    ```
  example:
    ```
    POSTGRES_PASSWORD=1234rtyu
    DB_USER=storefront_user
    DB=storefront_db
    DB_TEST=test_db
    DB_PASSWORD=storefront1234rtyu
    DB_HOST=localhost
    BYCRYPT_PASSWORD=shakil@ash
    SALT_ROUNDS=10
    JWT_TOKEN_SECRET=shakil@ash
    ENV=dev
    ```
- Assuming Docker is installed, run `docker-compose up -d` and open the interactive terminal of active postgres container.
  Inide the termal window run the following, 
  - `su postgres`
  - `psql postgres`
  - `CREATE DATABASE <value of DB in .env file>;`
  - `CREATE DATABASE <value of DB_TEST in .env file>;` <- for testing
  - `CREATE USER <value of DB_USER in .env file> WITH PASSWORD '<value of DB_PASSWORD in .env file>';`
  - `GRANT ALL PRIVILEGES ON DATABASE <created database> TO <created user>;`
  - `GRANT ALL PRIVILEGES ON DATABASE <created test database> TO <created user>;`
- run `npm install` to download the node dependencies
- run `npm i db-migrate -g` to gobally install db-migrate
- run `db-migrate up` to create the database schema in the database;

### Run App
 - in the terminal run `npm run watch`
### Run test cases
- in `.env` set `ENV=test`
- in the terminal run `npm test`

### API Endpoints
look in `REQUIREMENTS.md`