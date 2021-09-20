import {Pool} from "pg";
import dotenv from "dotenv";
dotenv.config();

const {
    DB_HOST: host,
    DB_USER: user,
    DB_PASSWORD: password,
    DB: database,
    DB_TEST: db_test,
    ENV: env
} = process.env;

const client = new Pool({
    host, 
    user,
    password,
    database: env === "test" ? db_test : database
});

export {client};