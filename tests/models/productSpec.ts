import ProductStore, {Product} from "../../src/models/product";

const product = new ProductStore();

describe("Product Model", () => {
    describe("create", () => {
        it("has create function", () => {
            expect(typeof product.create).toBe("function")
        });

        it("creates a new product", async () => {    
            const res = await product.create({
                "name": "Pepsi 1 Litre",
                "price": "50",
                "category": "Soft Drink"
            });

            expect(res.name).toBe("Pepsi 1 Litre");
        });
    })
    
    describe("index", () => {
        it("has index function", () => {
            expect(typeof product.index).toBe("function")
        });

        it("returns a list of products", async () => {
            const res = await product.index();
            expect(Array.isArray(res)).toBe(true);
        })
    });

    describe("show", () => {
        it("has show function", () => {
            expect(typeof product.show).toBe("function")
        });


        it("returns the product with the id", async() => {
            const {id: newId} = await product.create({
                "name": "Pepsi 1 Litre",
                "price": "50",
                "category": "Soft Drink"
            });

            const res = await product.show(newId as number);

            expect(res?.id).toBe(newId);
        });
    })
});