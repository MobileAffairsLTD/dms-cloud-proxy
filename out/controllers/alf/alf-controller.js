var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiControlerBase } from "../api-controller-base";
import { computeSignedRequest } from "./alf-requestSignature";
import { executeRequest } from "./alf-request";
import { processResponseByRequestType } from "./alf-requestType-response";
import { processByRequestType } from "./alf-requestType-request";
const DOMParser = require('xmldom').DOMParser;
export class ALFController extends ApiControlerBase {
    constructor(configuraiton) {
        super(configuraiton);
        this.fiscalizationServiceSubmit = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const appArea = req.params.appArea;
                const requestType = req.params.requestType;
                if (!req.body) {
                    throw new Error('Payload is required!');
                }
                const xml = req.body.request;
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
                if (xml.indexOf(requestType) != 1) {
                    throw new Error('RequestType does not correspond to the request payload');
                }
                const { transformedRequest, skipUplinkRequest } = processByRequestType(appArea, requestType, xml);
                let successResponse = false;
                let response;
                if (!skipUplinkRequest) {
                    const signedRequest = computeSignedRequest(requestType, transformedRequest, appArea);
                    try {
                        response = yield executeRequest(signedRequest);
                        successResponse = true;
                    }
                    catch (requestError) {
                        const parsedError = new DOMParser().parseFromString(requestError, 'text/xml');
                        if (parsedError) {
                            response = requestError;
                        }
                        else {
                            //simulate error returned from the fiscalization endpoint in order to use the same generic error handler
                            const parsedRequest = new DOMParser().parseFromString(transformedRequest, 'text/xml');
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
                const transformedResponse = processResponseByRequestType(appArea, requestType, transformedRequest, response, successResponse);
                transformedResponse.success = successResponse;
                res.set('Content-Type', 'appplicaion/json').status(200).send(transformedResponse);
            }
            catch (err) {
                const parser = new DOMParser().parseFromString(err, 'text/xml');
                if (parser) {
                    const errorCode = parser.documentElement.getElementsByTagName('code');
                    const faultstring = parser.documentElement.getElementsByTagName('faultstring');
                    const faultcode = parser.documentElement.getElementsByTagName('faultcode');
                    const requestUUID = parser.documentElement.getElementsByTagName('requestUUID');
                    const iic = parser.documentElement.getElementsByTagName('IIC');
                    const wtnic = parser.documentElement.getElementsByTagName('WTNIC');
                    this.returnResponseError(res, 400, {
                        success: false,
                        errorCode: errorCode && errorCode.length > 0 ? errorCode[0].textContent : undefined,
                        faultCode: faultcode && faultcode.length > 0 ? faultcode[0].textContent : undefined,
                        faultstring: faultstring && faultstring.length > 0 ? faultstring[0].textContent : undefined,
                        requestUUID: requestUUID && requestUUID.length > 0 ? requestUUID[0].textContent : undefined,
                        iic: iic && iic.length > 0 ? iic[0].textContent : undefined,
                        wtnic: wtnic && wtnic.length > 0 ? wtnic[0].textContent : undefined,
                        rawErrror: err
                    });
                }
                else {
                    this.returnResponseError(res, 400, {
                        success: false,
                        faultCode: 'dms:GENERALERROR',
                        faultstring: err.message ? err.message : err,
                        requestUUID: '',
                        rawErrror: err.message ? err.message : err,
                        errorCode: 89219,
                    });
                }
            }
        });
    }
}
//# sourceMappingURL=alf-controller.js.map