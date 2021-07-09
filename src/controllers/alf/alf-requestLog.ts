import path = require("path");
import { CloudAdapter } from "../../adapters/cloud-adapter";
import * as fs  from 'fs';

export async function logRequestResponse(apiKey: string, appArea: string, data: any): Promise<any> {
    try {
        const cloudAdapter = new CloudAdapter(appArea, apiKey);
        await cloudAdapter.logRequest(data);
    } catch (err) {
        console.log(err);
    }
}