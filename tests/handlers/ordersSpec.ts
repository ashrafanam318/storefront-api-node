import app from "../../src/server";
import supertest from "supertest";
const request = supertest(app);

describe("Testing users routes", () => {    
    beforeAll(async () => {
        try {
            await request.post('/users').send({
                "firstname": "Tester",
                "lastname": "Three",
                "username": "tester3",
                "password": "1234rtyu"
            });
        } catch (error) {}
    });

    describe("POST /:userId/orders/active", () => {
        it("returns the the current order of the user with the id", async () => {
            try {
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
                const {body: {jwt:token}} = await request.post('/users/signin').send({
                    username: "tester3", password: "1234rtyu"
                });
                const createdProds = [];
                for (var i = 0; i < prods.length; i++) {
                    const {body: newProd} = 
                        await request.post('/products').send(prods[i]).set({'Authorization': `jwt ${token}`});
                    createdProds.push(newProd);
                }

                const {body: {id: orderId}} = 
                    await request
                            .post("/1/orders/")
                            .send(createdProds.map(({id}) => ({product_id: id, quantity: 3})))
                            .set({'Authorization': `jwt ${token}`})
                
                const {statusCode, body: currentOrder} = await request.get("/1/orders/active").set({'Authorization': `jwt ${token}`})
                            
                expect(statusCode).toBe(200);
                expect(currentOrder[`${orderId}`].length).toBe(prods.length);
            } catch (error) {}
        });
    });
});

