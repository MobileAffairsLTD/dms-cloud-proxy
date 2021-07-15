import { ApiControlerBase } from "../api-controller-base";
import { ConfigurationObject } from "../../application/configuration";
import { computeSignedRequest } from "./alf-requestSignature";
import { executeRequest, executeRequestEinvoice } from "./alf-request";
import { processResponseByRequestType } from "./alf-requestType-response";
import { processByRequestType } from "./alf-requestType-request";
import { logRequestResponse } from "./alf-requestLog";
import path = require("path");
import * as fs from 'fs';
import { uploadPacket } from "./alf-packet-storage";
import { compareAndReplaceCertificates } from "./alf-certificate-storage";
const DOMParser = require('xmldom').DOMParser;
const crypto = require("crypto");

export class ALFController extends ApiControlerBase {

    constructor(configuraiton: ConfigurationObject) {
        super(configuraiton);
    }

    async LogRequestAndCheckCert(apiKey: string, requestId: any, status: number, req: { params: { appArea: string; requestType: any; }; }, requestBody: any, requestResponse: any) {
        try {
            await compareAndReplaceCertificates(apiKey, req.params.appArea);
        } catch (error) {
            console.log(`Unable to compare and replace certificates: ${error}`)
        };
        try {
            await logRequestResponse(apiKey, req.params.appArea, {
                requestId: requestId,
                error: (status != 200) ? requestResponse : '',
                requestType: req.params.requestType,
                status: status,
            })  
        } catch (error) {
            console.log(`Unable to log request/response: ${error}`);
        };
        try {
            await uploadPacket(apiKey, req.params.appArea, `request-${requestId}.json`, requestBody);
            await uploadPacket(apiKey, req.params.appArea, `response-${requestId}.json`, requestResponse);
        } catch (error) {
            console.log(`unable to upload request/response packet: ${error}`);
        }
    }

    fiscalizationServiceSubmit = async (req, res): Promise<any> => {
        const apiKey = this.configuraiton.appArea[req.params.appArea].apiKey;
        if (!apiKey) {
            throw new Error('Missing APIKey in configuration.')
        }
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
                let signedRequest = await computeSignedRequest(requestType, transformedRequest, appArea);
                signedRequest = signedRequest.replace('URI="#_0"', 'URI="#Request"');
                requestBody = `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Header/><SOAP-ENV:Body>${signedRequest}</SOAP-ENV:Body></SOAP-ENV:Envelope>`;
                requestBody = signedRequest;
                try {
                    if (requestType.toUpperCase() == 'RegisterEinvoiceRequest'.toUpperCase() ||
                        requestType.toUpperCase() == 'GetTaxpayersRequest'.toUpperCase() ||
                        requestType.toUpperCase() == 'GetEInvoicesRequest'.toUpperCase() ||
                        requestType.toUpperCase() == 'EinvoiceChangeStatusRequest'.toUpperCase()
                    ) {
                        response = await executeRequestEinvoice(signedRequest, isProduction);
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

            res.set('Content-Type', 'applicaion/json').status(200).send(transformedResponse);
            await this.LogRequestAndCheckCert(apiKey, requestId, 200, req, requestBody, transformedResponse ? transformedResponse : '');    

        }
        catch (err) {
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
                await this.LogRequestAndCheckCert(apiKey, requestId, 400, req, requestBody, error);
            }
            else {
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
                await this.LogRequestAndCheckCert(apiKey, requestId, 400, req, requestBody, error);
            }
        }
    }
}