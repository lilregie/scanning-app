import { NextFunction, Request, Response } from "express";
import { v4 } from "uuid";

const START_TOKEN = 'testing-token';
let csrf_token = 'testing-token';


function newToken(): string {
    csrf_token = v4();
    return csrf_token;
}


export const csrfMiddleware = (req: Request, res: Response<any, Record<string, any>>, next: NextFunction) => {
    const request_csrf = req.get('X-CSRF-Token');
    console.log(`Supplied CSRF: '${request_csrf}'`)
    if (request_csrf === csrf_token || request_csrf === START_TOKEN) {
        res.set('X-CSRF-Token', newToken());
        res.set("Access-Control-Expose-Headers","X-CSRF-Token")
        return next();
    } else {
        res.status(403).send('Invalid CSRF Token');
    }
}
