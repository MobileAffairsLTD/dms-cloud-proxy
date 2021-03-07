import { Configuration, ConfigurationObject } from "../application/configuration"

interface ApiResponse {
    json(response: any): ApiResponse;
    status(status: number): ApiResponse;
}


export class ApiControlerBase {

  
    constructor(protected configuraiton: ConfigurationObject){

    }

    protected returnResponseSucces(res, obj: any){
        res.json(obj)  
    }

    protected returnResponseError(res,httpStatusCode: number, obj: any){
        res.status(httpStatusCode).json(obj)  
    }
}