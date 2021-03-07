import { Request, Response } from 'express';
import { Configuration } from '../application/configuration';
import { ResponseBuilder } from "./response.builder";

const configuration = Configuration.load();

export const auth = (func: any) => {
    return (req: Request, res: Response, next: () => void) => {
        try {
            if (req.headers['dms-api-key'] === configuration.apiKey) {
                return func(req, res, next)
            }
        } catch (e) {
            return res.status(401).send(new ResponseBuilder().err('Unauthorized'))
        }

        return res.status(401).send(new ResponseBuilder().err('Unauthorized'))
    }
}