import express from "express";
import jwt from "jsonwebtoken";

export const authenticate = (req: express.Request, res: express.Response, next: Function) => {
    try {
        const tokenStringArr = req.headers.authorization?.split(" ");
        let token: string = "";
        
        if (tokenStringArr && tokenStringArr[0].toLowerCase() === "jwt") {
            token = tokenStringArr[1];
        }

        if (token === "") {
            res.status(401).json("Unauthorized access! " + (new Error("Empty token")));
            return;
        } else {
            jwt.verify(token, process.env.JWT_TOKEN_SECRET as string);
            next();
        }
    } catch (error) {
        res.status(401).json("Unauthorised Access! " + error)
    }
}