import { NextFunction, Request, Response } from "express";
import { v4 } from "uuid";

const START_TOKEN = 'testing-token';
let csrf_token = 'testing-token';


function newToken(): string {
    csrf_token = v4();
    return csrf_token;
}


export const csrfMiddleware = (req: Request, res: Response<any, Record<string, any>>, next: NextFunction) => {
    const request_csrf = req.get('x-csrf-token');
    console.log(`Supplied CSRF: '${request_csrf}'`)
    if (request_csrf === csrf_token || request_csrf === START_TOKEN) {
        res.set('x-csrf-token', newToken());
        res.set("Access-Control-Expose-Headers","x-csrf-token")
        return next();
    } else {
        res.status(403).send('Invalid CSRF Token');
    }
}
