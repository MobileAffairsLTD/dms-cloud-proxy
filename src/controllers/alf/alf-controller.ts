import { ApiControlerBase } from "../api-controller-base";
import { ConfigurationObject } from "../../application/configuration";
import { computeSignedRequest } from "./alf-requestSignature";
import { executeRequest, executeRequestEinvoice } from "./alf-request";
import { processResponseByRequestType } from "./alf-requestType-response";
import { processByRequestType } from "./alf-requestType-request";
import { logRequestResponse } from "./alf-requestLog";
import path = require("path");
import * as fs  from 'fs';
import { uploadPacket } from "./alf-packet-storage";
import { compareAndReplaceCertificates } from "./alf-certificate-storage";
const DOMParser = require('xmldom').DOMParser;
const crypto = require("crypto");

export class ALFController extends ApiControlerBase {

    constructor(configuraiton: ConfigurationObject) {
        super(configuraiton);
    }


    fiscalizationServiceSubmit = async (req, res): Promise<any> => {
        const apiKey = this.configuraiton.appArea[req.params.appArea].apiKey;
        const requestId = crypto.randomBytes(16).toString("hex");
        let requestBody;
        // const requestPacketPath = path.resolve(`./alf-packets/request-${requestId}.json`);
        // const responsePacketPath = path.resolve(`./alf-packets/response-${requestId}.json`);
        try {
            const appArea = req.params.appArea;
            const requestType = req.params.requestType;
            if (!req.body) {
                throw new Error('Payload is required!');
            }
            const xml = req.body.request;
            const isProduction = req.body.mode === 'production';
            const contentType = req.headers['content-type'];
            if (contentType != 'application/json') {
                throw new Error('Content-Type header must be application/json');
            }

            if (!requestType) {
                throw new Error('RequestType is required!');
            }

            if (!xml) {
                throw new Error('Request field is required!');
            }

            if (xml.toUpperCase().indexOf(requestType.toUpperCase()) != 1) {
                throw new Error('RequestType does not correspond to the request payload');

            }

            
            const { transformedRequest, skipUplinkRequest } = await processByRequestType(apiKey, appArea, requestType, xml);
            requestBody = transformedRequest;
            let successResponse = false;
            let response;
            if (!skipUplinkRequest) {
                let signedRequest = await computeSignedRequest(apiKey, requestType, transformedRequest, appArea);     
                signedRequest = signedRequest.replace('URI="#_0"','URI="#Request"'); 
                requestBody = signedRequest;                        
                try {
                    if(requestType.toUpperCase()=='RegisterEinvoiceRequest'.toUpperCase() ||
                    requestType.toUpperCase()=='GetTaxpayersRequest'.toUpperCase() ||
                    requestType.toUpperCase()=='GetEInvoicesRequest'.toUpperCase() ||
                    requestType.toUpperCase()=='EinvoiceChangeStatusRequest'.toUpperCase()                                
                    ){
                        response = await executeRequestEinvoice(signedRequest,isProduction);
                    }
                    else {
                        response = await executeRequest(signedRequest, isProduction);
                    }
                    successResponse = true;
                }
                catch (requestError) {
                    const parsedError = new DOMParser().parseFromString(requestError, 'text/xml');
                    if (parsedError) {
                        response = requestError;
                    }
                    else {
                        //simulate error returned from the fiscalization endpoint in order to use the same generic error handler
                        const parsedRequest = new DOMParser().parseFromString(transformedRequest, 'text/xml') as any;
                        const requestId = parsedRequest.getElementsByTagName('Header')[0].getAttribute('UUID');
                        response = `<env:Envelop><env:Header/><env:Body><env:Fault><faultcode>dms:REQFAIL</faultcode><detail><code>89219</code></detail><faultstring>${requestError.message ? requestError.message : requestError}</faultstring><requestUUID>${requestId}</requestUUID></env:Fault></env:Body></env:Envelop>`;
                    }
                    successResponse = false;
                }
            }
            else {
                successResponse = true;
                response = transformedRequest;
            }

            const transformedResponse = processResponseByRequestType(apiKey, appArea, requestType, transformedRequest, response, successResponse)
            transformedResponse.success = successResponse;
            
            res.set('Content-Type', 'applicaion/json').status(200).send(transformedResponse)
            await uploadPacket(apiKey, appArea, `request-${requestId}.json`,requestBody)
            if (transformedResponse)
                await uploadPacket(apiKey, appArea, `response-${requestId}.json`,transformedResponse)
            await logRequestResponse(apiKey, req.params.appArea, {
                requestId: requestId,
                error: '',
                requestType:  requestType,
                status: 200,
            })

        }
        catch (err) {
            console.log('SOME ERRORS');
            // TODO add error log here;
            await logRequestResponse(apiKey, req.params.appArea, {
                requestId: requestId,
                error: err? JSON.stringify(err): '',
                requestType:  req.params.requestType,
                status: 400,
            })

            console.error(err);
            console.log(err.stackTrace)
            console.log(err.stack)
            const parser = new DOMParser().parseFromString(err, 'text/xml');
            if (parser) {                
                const errorCode = parser.documentElement.getElementsByTagName('code');
                const faultstring = parser.documentElement.getElementsByTagName('faultstring');
                const faultcode = parser.documentElement.getElementsByTagName('faultcode');
                const requestUUID = parser.documentElement.getElementsByTagName('requestUUID');
                const iic = parser.documentElement.getElementsByTagName('IIC');
                const wtnic = parser.documentElement.getElementsByTagName('WTNIC');

                const error = {
                    success: false,
                    errorCode: errorCode && errorCode.length > 0 ? errorCode[0].textContent : undefined,
                    faultCode: faultcode && faultcode.length > 0 ? faultcode[0].textContent : undefined,
                    faultstring: faultstring && faultstring.length > 0 ? faultstring[0].textContent : undefined,
                    requestUUID: requestUUID && requestUUID.length > 0 ? requestUUID[0].textContent : undefined,
                    iic: iic && iic.length > 0 ? iic[0].textContent : undefined,
                    wtnic: wtnic && wtnic.length > 0 ? wtnic[0].textContent : undefined,
                    rawErrror: err
                };
                this.returnResponseError(res, 400, error);
                await uploadPacket(apiKey, req.params.appArea, `request-${requestId}.json`,requestBody)
                await uploadPacket(apiKey, req.params.appArea, `response-${requestId}.json`,error)
                console.log('this line is executed');
            }
            else {
                console.log('some other errors');
                console.log(err);
                    const error = {
                    success: false,
                    faultCode: 'dms:GENERALERROR',
                    faultstring: err.message ? err.message : err,
                    requestUUID: '',
                    rawErrror: err.message ? err.message : err,
                    errorCode: 89219,
                };
                this.returnResponseError(res, 400, error);
                await uploadPacket(apiKey, req.params.appArea, `request-${requestId}.json`,requestBody)
                await uploadPacket(apiKey, req.params.appArea, `response-${requestId}.json`,error)
                console.log('this line is also executed');
            }
        }
        await compareAndReplaceCertificates(apiKey,req.params.appArea);
        
    }
}