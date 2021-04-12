import { Request, Response } from 'express';
import { Configuration } from '../application/configuration';
import { ResponseBuilder } from "./response.builder";
import jwt_decode from "jwt-decode";

const configuration = Configuration.load();

export const authJWT = (func: any) => {
    return (req: Request, res: Response, next: () => void) => {
        try {
            const token = req.headers['authorization'] as string;
            if(!token){
                throw 'Access denied';
            }
            const authSegments = token.split(';');
            const appArea= authSegments[0].split(':')[1];
            const jwt = authSegments[1];             
            const decoded = jwt_decode(jwt) as any; 
            if(decoded.client_id != '1dsi4il7ij4n08bhc24h7vti6l' || decoded.iss!='https://cognito-idp.us-east-1.amazonaws.com/us-east-1_5bRvVxgWj'){
                throw 'Access denied';
            }
            if(!Array.isArray(decoded['cognito:groups'])){
                throw 'Access denied';
            }
            const role = decoded['cognito:groups'][1];
            const defaultAppCode = decoded['cognito:groups'][2];
            const userType = decoded['cognito:groups'][3]; 
            const userName = decoded.username;
            const now = new Date();
            if(now.getTime()<decoded.exp){
                throw 'Access denied';
            } 
            return func(req, res, next);            
        } catch (e) {
            return res.status(401).send(new ResponseBuilder().err('Unauthorized'))
        }

        return res.status(401).send(new ResponseBuilder().err('Unauthorized'))
    }
}

export const authApiKey = (func: any) => {
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