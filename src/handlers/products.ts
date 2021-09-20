import express from "express";
import ProductStore from "../models/product";
import type {Product} from "../models/product";
import { authenticate } from "../middlewares/auth";

const store = new ProductStore();

const index = async (_: express.Request, res: express.Response) => {
    try {
        const result = await store.index();
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json(error);
    }
};

const show = async (req: express.Request, res: express.Response) => {
    try {
        const result = await store.show(req.params.id as unknown as number);
        if (result === null) {
            res.status(404).json("Product Not Found");
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        res.status(400).json(error);
    }
}

const create = async (req: express.Request, res: express.Response) => {
    try {
        const product = req.body as Product;
        const result = await store.create(product);

        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        res.status(401).json(error);
    }
}

export default (app: express.Application) => {
    app.get("/products", index);
    app.get("/products/:id", show);
    app.post("/products", authenticate, create);
};