import UserStore from "../../src/models/user";

const user = new UserStore();

describe("Product Model", () => {
    describe("create", () => {
        it("has create function", () => {
            expect(typeof user.create).toBe("function")
        });

        it("creates a new user", async () => {    
            const res = await user.create({
                firstname: "XX", 
                lastname: "YY", 
                username: "xxyy", 
                password: "xxyyXXYY"
            });

            expect(res.username).toBe("xxyy");
        });
    })
    
    describe("index", () => {
        it("has index function", () => {
            expect(typeof user.index).toBe("function")
        });

        it("returns a list of products", async () => {
            const res = await user.index();
            expect(Array.isArray(res)).toBe(true);
        })
    });

    describe("show", () => {
        it("has show function", () => {
            expect(typeof user.show).toBe("function")
        });


        it("returns the user with the id", async() => {
            const {id} = await user.create({
                firstname: "XY", 
                lastname: "YX", 
                username: "xyxy", 
                password: "xxyyXXYY"
            });

            const res = await user.show(id as number);

            expect(res?.username).toBe("xyxy");
        });
    })
});