import express from "express";
import jwt from "jsonwebtoken";
import UserStore from "../models/user";
import type {User} from "../models/user";
import { authenticate } from "../middlewares/auth";

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
        const token = jwt.sign({user: result}, process.env.JWT_TOKEN_SECRET as string);
        res.status(201).json({jwt: token});
    } catch (error) {
        res.status(400).json(`${error}`);
    }
}

const signIn = async (req: express.Request, res: express.Response) => {
    try {
        const user = await store.verifyUser(req.body as {username: string, password: string});
        const token = jwt.sign({user}, process.env.JWT_TOKEN_SECRET as string);
        res.status(200).json({jwt: token});
    } catch (error) {
        res.status(401).json(`${error}`)
    }
}

export default (app: express.Application) => {
    app.get("/users", authenticate, index);
    app.get("/users/:id", authenticate, show);
    app.post("/users", create);
    app.post("/users/signin", signIn);
};