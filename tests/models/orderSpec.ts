import OrderStore, { OrderItem } from "../../src/models/order";
import ProductStore, {Product} from "../../src/models/product";
import UserStore from "../../src/models/user";

const order = new OrderStore();
const user = new UserStore();
const product = new ProductStore();

describe("Order Model", () => {
    describe("create", () => {
        it("has create function", () => {
            expect(typeof order.create).toBe("function")
        });

        it("creates a new order for the user given a product list", async () => {
            await user.create({firstname: "AA", lastname: "BB", username: "aabb", password: "aabbAABB"})
            
            const prods = [
                {
                    "name": "Coca Cola 1 Litre",
                    "price": "50",
                    "category": "Soft Drink"
                },
                {
                    "name": "BudLight",
                    "price": "500",
                    "category": "Drink"
                },
                {
                    "name": "Pepsi 1 Litre",
                    "price": "50",
                    "category": "Soft Drink"
                }
            ];
            const createdProds: Product[] = [];
            for (var i = 0; i < prods.length; i++) {
                const newProd = await product.create(prods[i]);
                createdProds.push(newProd);
            }

            const orderItems: OrderItem[] = createdProds.map(p => ({product_id: p.id as number, quantity: 3}))

            const res = await order.create(1, orderItems);
            expect(res.status).toBe("active");
        });
    })

    describe("showCurrent", () => {
        it("has showCurrent function", () => {
            expect(typeof order.showCurrent).toBe("function")
        });

        it("retuns the acitve orders of the user", async() => {
            await user.create({firstname: "AB", lastname: "BA", username: "abab", password: "aabbAABB"})
            
            const prods = [
                {
                    "name": "Coca Cola 1 Litre",
                    "price": "50",
                    "category": "Soft Drink"
                },
                {
                    "name": "BudLight",
                    "price": "500",
                    "category": "Drink"
                }
            ];
            const createdProds: Product[] = [];
            for (var i = 0; i < prods.length; i++) {
                const newProd = await product.create(prods[i]);
                createdProds.push(newProd);
            }

            const orderItems: OrderItem[] = createdProds.map(p => ({product_id: p.id as number, quantity: 3}))

            const {id:orderId} = await order.create(1, orderItems);
            
            const res = await order.showCurrent(1);
            expect(Object.keys(res).includes(`${orderId}`)).toBe(true);
        });
    })
});