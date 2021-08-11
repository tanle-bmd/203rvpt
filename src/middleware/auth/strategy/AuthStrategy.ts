import { Request, Response, NextFunction } from "express";

export default interface AuthStrategy {
    auth(req: Request): Promise<any>;
}
