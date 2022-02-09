import { NextFunction, Request, Response } from "express";
import { v4 } from "uuid";

let CSRF_TOKEN = 'testing-token';


function newToken(): string {
    CSRF_TOKEN = v4();
    return CSRF_TOKEN;
}


export const csrfMiddleware = (req: Request, res: Response<any, Record<string, any>>, next: NextFunction) => {
    // if (req.body?.csrf !== CSRF_TOKEN) {
    //     res.status(403).send('Invalid CSRF Token');
    // } else {
    //     return next();
    // }
    res.set('X-CSRF-Token', newToken());
    return next();
}