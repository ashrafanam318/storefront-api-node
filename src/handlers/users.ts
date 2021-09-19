import express from "express";
import UserStore from "../models/user";
import type {User} from "../models/user";

const store = new UserStore();

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
            res.status(404).json("User Not Found");
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        res.status(400).json(error);
    }
}

const create = async (req: express.Request, res: express.Response) => {
    try {
        const user = req.body as User;
        const result = await store.create(user);

        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        res.status(401).json(error);
    }
}

export default (app: express.Application) => {
    app.get("/users", index);
    app.get("/users/:id", show);
    app.post("/users", create);
};