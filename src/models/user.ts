import {client} from "../database";
import bcrypt from "bcrypt";

export type User = {
    id?: number,
    firstname: string,
    lastname: string,
    username: string,
    password?: string
};

class UserStore {
    pepper: string = process.env.BYCRYPT_PASSWORD as string;
    saltRounds: number = Number(process.env.SALT_ROUNDS);

    index = async (): Promise<User[]>  => {
        try {
            const conn = await client.connect();
            const res = await conn.query(`SELECT id, firstname, lastname, username FROM users;`);
            conn.release();
            if (res.rowCount === 0) return [];
            return res.rows;
        } catch (error) {
            throw new Error("Could not get users " + error);
        }
    }
    
    show = async (id: number): Promise<User|null> => {
        try {
            const conn = await client.connect();
            const res = await conn.query(`SELECT id, firstname, lastname, username FROM users WHERE id=${id};`);
            conn.release();
            if (res.rowCount < 1) return null;
            else return res.rows[0];
        } catch (error) {
            throw new Error(`could not get user by id ${id} ${error}`)
        }
    }

    create = async (user: User): Promise<User> => {
        try {
            const conn = await client.connect();
            
            const {rowCount} = await conn.query(`SELECT * FROM users WHERE username='${user.username}'`);
            if (rowCount > 0) {
                conn.release();
                throw new Error("user Already Exists!");
            }

            const password_hash = bcrypt.hashSync(user.password + this.pepper, this.saltRounds);
            const res = await conn.query(`
                INSERT INTO users(firstname, lastname, username, password_hash) 
                    VALUES('${user.firstname}', '${user.lastname}', '${user.username}', '${password_hash}') RETURNING id, username, firstname, lastname;`);
            conn.release();

            return res.rows[0];
        } catch (error) {
            throw error;
        }
    }

    delete = async (id: number): Promise<User> => {
        try {
            const conn = await client.connect();
            const res = await conn.query(`DELETE FROM users WHERE id=${id} RETURNING id, username, firstname, lastname;`);
            conn.release();

            return res.rows[0];
        } catch (error) {
            throw new Error (`Could not delete user with id ${id} ${error}`);
        }
    }

    verifyUser = async (creds: {username: string, password: string}): Promise<User> => {
        try {
            const conn = await client.connect();
            const res = await conn.query(`SELECT * FROM users WHERE username='${creds.username}';`);
            conn.release();
            
            if (res.rowCount === 0) {
                throw new Error("User Doesn't Exist!");
            }

            const {password_hash, ...user} = res.rows[0];

            const passwordValid = bcrypt.compareSync(creds.password + this.pepper, password_hash);

            if (passwordValid) return user;
            else throw new Error("Invalid Password!");
        } catch (error) {
            throw error;
        }
    }
}

export default UserStore;