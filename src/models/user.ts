import {client} from "../database";

export type User = {
    id?: number,
    firstname: string,
    lastname: string,
    password_hash: string
};

class UserStore {
    index = async (): Promise<User[]>  => {
        try {
            const conn = await client.connect();
            const res = await conn.query(`SELECT id, firstname, lastname FROM users;`);
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
            const res = await conn.query(`SELECT id, firstname, lastname FROM users WHERE id=${id};`);
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
            const res = await conn.query(`
                INSERT INTO users(firstname, lastname, password_hash) 
                    VALUES('${user.firstname}', '${user.lastname}', '${"dummy_password_hash"}') RETURNING id, firstname, lastname;`);
            conn.release();

            return res.rows[0];
        } catch (error) {
            throw new Error(`could not create user ${error}`)
        }
    }

    delete = async (id: number): Promise<User> => {
        try {
            const conn = await client.connect();
            const res = await conn.query(`DELETE FROM users WHERE id=${id} RETURNING id, firstname, lastname;`);
            conn.release();

            return res.rows[0];
        } catch (error) {
            throw new Error (`Could not delete user with id ${id} ${error}`);
        }
    }
}

export default UserStore;