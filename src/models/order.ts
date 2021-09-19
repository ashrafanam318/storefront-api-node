import {client} from "../database";
import type { Product } from "./product";

export type Order = {
    id?: number,
    user_id: number,
    status?: string
};

export type OrderItem = {
    product_id: number, 
    quantity: number
};

 type OrderResponse = {
    [order_id: string] : {
        quantity: number,
        product: Product
    }[]
};

class OrderStore {
    showCurrent = async (user_id: number): Promise<OrderResponse> => {
        try {
            const conn = await client.connect();
            const sql = `
                SELECT orders.id as order_id, op.quantity, products.* FROM 
                orders INNER JOIN order_products AS op ON orders.id=op.order_id 
                INNER JOIN products ON op.product_id=products.id
                WHERE orders.user_id=${user_id} AND status='active';
            `;
            const res = await conn.query(sql);
            conn.release();
            const ordersObj: OrderResponse = res.rows.reduce(
                (acc, {order_id, quantity, ...product}) => ({
                        ...acc,
                        [order_id.toString()]: [
                            ...(acc[order_id.toString()] || []), 
                            {quantity: quantity, product}
                        ]
                    }),
                {}
            );
            return ordersObj;
        } catch (error) {
            throw new Error(`could not get order for the user id ${user_id} ${error}`)
        }
    }

    create = async (user_id: number, items: OrderItem[]): Promise<Order> => {
        try {
            const conn = await client.connect();
            const res = await conn.query(`
                INSERT INTO orders(user_id, status) 
                    VALUES('${user_id}', '${"active"}') RETURNING *;`);

            const order_id = res.rows[0].id;

            const orderProductQuery = `${items.reduce(
                (vString, {product_id, quantity}, index) => 
                    `${vString}${index === 0 ? " " : ", "}(${order_id}, ${product_id}, ${quantity})`,
                "INSERT INTO order_products(order_id, product_id, quantity) VALUES"
            )};`
            await conn.query(orderProductQuery);
            
            conn.release();
            return res.rows[0];
        } catch (error) {
            throw new Error(`could not create order ${error}`)
        }
    }

    complete = async (order_id: number): Promise<Order> => {
        try {
            const conn = await client.connect();
            const res = await conn.query(`UPDATE orders SET status='complete' WHERE id=${order_id} RETURNING *;`);
            conn.release();
            return res.rows[0];
        } catch (error) {
            throw new Error(`could not complete order with id ${order_id} ${error}`)
        }
    }

    delete = async (order_id: number): Promise<Order> => {
        try {
            const conn = await client.connect();
            const res = await conn.query(`DELETE FROM orders WHERE id=${order_id} RETURNING *;`);
            conn.release();

            return res.rows[0];
        } catch (error) {
            throw new Error (`Could not delete order with id ${order_id} ${error}`);
        }
    }
}

export default OrderStore;