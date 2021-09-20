import express from "express";
import OrderStore from "../models/order";
import type {Order, OrderItem} from "../models/order";
import { authenticate } from "../middlewares/auth";

const store = new OrderStore();

const showCurrentOrderByUser = async (req: express.Request, res: express.Response) => {
    try {
        const userId = req.params.user_id as unknown as number;
        const result = await store.showCurrent(userId);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

const create = async (req: express.Request, res: express.Response) => {
    try {
        const userId = req.params.user_id as unknown as number;
        const orderItems: OrderItem[] = req.body;
        const result = await store.create(userId, orderItems);
        res.status(201).json(result);
    } catch (error) {
        res.status(401).json(error);
    }
}

const completeOrder = async(req: express.Request, res: express.Response) => {
    try {
        const orderId = req.params.order_id as unknown as number;
        const result = await store.complete(orderId);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(401).json(error);
    }
}

export default (app: express.Application) => {
    app.get("/:user_id/orders/active", authenticate, showCurrentOrderByUser);
    app.post("/:user_id/orders", authenticate, create);
    app.put('/orders/:order_id/complete', authenticate, completeOrder);
};