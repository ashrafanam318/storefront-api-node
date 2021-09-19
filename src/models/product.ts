import {client} from "../database";

export type Product = {
    id?: number,
    name: string,
    price: string,
    category: string
};

class ProductStore {
    index = async (): Promise<Product[]>  => {
        try {
            const conn = await client.connect();
            const res = await conn.query(`SELECT * FROM products;`);
            conn.release();
            if (res.rowCount === 0) return [];
            return res.rows;
        } catch (error) {
            throw new Error("Could not get products " + error);
        }
    }
    
    show = async (id: number): Promise<Product|null> => {
        try {
            const conn = await client.connect();
            const res = await conn.query(`SELECT * FROM products WHERE id=${id};`);
            conn.release();
            if (res.rowCount < 1) return null;
            else return res.rows[0];
        } catch (error) {
            throw new Error(`could not get product by id ${id} ${error}`)
        }
    }

    create = async (product: Product): Promise<Product> => {
        try {
            const conn = await client.connect();
            const res = await conn.query(`
                INSERT INTO products(name, price, category) 
                    VALUES('${product.name}', '${product.price}', '${product.category}') RETURNING id, name, price, category;`);
            conn.release();

            return res.rows[0];
        } catch (error) {
            throw new Error(`could not create product ${error}`)
        }
    }

    delete = async (id: number): Promise<Product> => {
        try {
            const conn = await client.connect();
            const res = await conn.query(`DELETE FROM products WHERE id=${id} RETURNING id, name, price, category;`);
            conn.release();

            return res.rows[0];
        } catch (error) {
            throw new Error (`Could not delete product with id ${id} ${error}`);
        }
    }
}

export default ProductStore;