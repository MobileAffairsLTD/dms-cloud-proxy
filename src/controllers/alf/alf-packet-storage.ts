import * as path  from 'path';
import * as fs  from 'fs';
import { CloudAdapter } from '../../adapters/cloud-adapter';

export async function uploadPacket(apiKey: string, appArea: string, fileName: string, fileContent: any): Promise<any> {
    try {
        const cloudAdapter = new CloudAdapter(appArea, apiKey);
        await cloudAdapter.uploadALFPacket(fileName,  fileContent);
    } catch (err) {
        console.log(err);
    }
}