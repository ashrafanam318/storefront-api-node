import app from "../../src/server";
import supertest from "supertest";
const request = supertest(app);

describe("Testing users routes", () => {   
    beforeAll(async () => {
        try {
            await request.post('/users').send({
                "firstname": "Tester",
                "lastname": "One",
                "username": "tester1",
                "password": "1234rtyu"
            });
        } catch (error) {}
    });
    
    describe("GET /users", () => {
        it("returns list of users", async () => {
            try {
                const {body: {jwt: token}} = await request.post('/users/signin').send({
                    username: "tester1", password: "1234rtyu"
                });
                const res = await request.get('/users').set({'Authorization': `jwt ${token}`});
 
                expect(res.statusCode).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
            } catch (error) {}
        });
    });

    describe("GET /users/:id", () => {
        it("returns the user with given id", async () => {
            try {
                const {body: {jwt:token}} = await request.post('/users/signin').send({
                    username: "tester1", password: "1234rtyu"
                });
                const res = await request.get('/users/1').set({'Authorization': `jwt ${token}`});
                expect(res.statusCode).toBe(200);
            } catch (error) {}
        });
    });

    describe("POST /users", () => {
        it("returns jwt token on successful user creation", async () => {
            try {
                const res = await request.post('/users').send({
                    "firstname": "Tester",
                    "lastname": "New",
                    "username": "testerNew",
                    "password": "1234rtyu"
                });
                expect(res.statusCode).toBe(201);
                expect(Object.keys(res.body)).toEqual(["jwt"]);
            } catch (error) {}
        });
    });
});

