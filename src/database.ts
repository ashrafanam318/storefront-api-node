import {Pool} from "pg";
import dotenv from "dotenv";
dotenv.config();

const {
    DB_HOST: host,
    DB_USER: user,
    DB_PASSWORD: password,
    DB: database,
} = process.env;

const client = new Pool({
    host, 
    user,
    password,
    database
});

export {client};