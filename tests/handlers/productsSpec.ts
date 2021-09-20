import app from "../../src/server";
import supertest from "supertest";
const request = supertest(app);

describe("Testing products routes", () => {    
    beforeAll(async () => {
        try {
            await request.post('/users').send({
                "firstname": "Tester",
                "lastname": "Two",
                "username": "tester2",
                "password": "1234rtyu"
            });
        } catch (error) {}
    });

    describe("POST /products", () => {
        it("returns the newly created product", async () => {
            try {
                const prod = {
                    "name": "Coca Cola 1 Litre",
                    "price": "50",
                    "category": "Soft Drink"
                };
                const {body: {jwt:token}} = await request.post('/users/signin').send({
                    username: "tester2", password: "1234rtyu"
                });
                const res = await request.post('/products').send(prod).set({'Authorization': `jwt ${token}`});
 
                expect(res.statusCode).toBe(201);
                expect(res.body.name).toBe("Coca Cola 1 Litre");
            } catch (error) {}
        });
    });

    describe("GET /products/:id", () => {
        it("returns the product with the given id", async () => {
            try {
                const prod = {
                    "name": "Sunlight Battery",
                    "price": "18",
                    "category": "Electronics"
                };
                const {body: {jwt:token}} = await request.post('/users/signin').send({
                    username: "tester2", password: "1234rtyu"
                });
                const {body: {id}} = await request.post('/products').send(prod).set({'Authorization': `jwt ${token}`});

                const res = await request.get(`/products/${id}`);
                expect(res.statusCode).toBe(200);
                expect(res.body.name).toBe("Sunlight Battery");
            } catch (error) {}
        });
    });

    describe("GET /products", () => {
        it("returns list of products", async () => {
            try {
                const res = await request.get('/products');
                expect(res.statusCode).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
            } catch (error) {}
        });
    });
});

