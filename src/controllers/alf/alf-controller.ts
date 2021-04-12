import { ApiControlerBase } from "../api-controller-base";
import { ConfigurationObject } from "../../application/configuration";
import { computeSignedRequest } from "./alf-requestSignature";
import * as path from 'path'
import { executeRequest } from "./alf-request";
import { processResponseByRequestType } from "./alf-requestType-response";
import { processByRequestType } from "./alf-requestType-request";
const DOMParser = require('xmldom').DOMParser;


export class ALFController extends ApiControlerBase {

    constructor(configuraiton: ConfigurationObject) {
        super(configuraiton);
    }


    fiscalizationServiceSubmit = async (req, res): Promise<any> => {

         try {

            const requestType = req.params.requestType;
            if(!req.body){
                throw new Error('Payload is required!');
            }
            const xml = req.body.request;
            const contentType = req.headers['content-type'];
            if(contentType!='application/json'){
                throw new Error('Content-Type header must be application/json');
            }            

            if(!requestType){
                throw new Error('RequestType is required!');
            }

            if(!xml){
                throw new Error('Request field is required!');
            }

            if(xml.indexOf(requestType)!=1){
                throw new Error('RequestType does not correspond to the request payload');
                
            }

            //     var xml = `<RegisterTCRRequest xmlns="https://eFiskalizimi.tatime.gov.al/FiscalizationService/schema" xmlns:ns2="http://www.w3.org/2000/09/xmldsig#" Id="Request" Version="3">
            //     <Header SendDateTime="2021-04-10T02:43:00+02:00" UUID="e2caa8bc-91bf-429c-8919-e833367784c0" />
            //     <TCR BusinUnitCode="ge484ak993" IssuerNUIS="L01714012M" MaintainerCode="zk772ct263" SoftCode="cc476bs902" TCRIntID="1" ValidFrom="2021-04-10" Type="REGULAR" />
            //   </RegisterTCRRequest>`
            const transformedXml = processByRequestType(requestType,xml);

            const certificatePath = path.resolve("./ISA.pem");
            const publicKeyPath = path.resolve("./ISA-public.pem");
            const signedRequest = computeSignedRequest(requestType, transformedXml, certificatePath, publicKeyPath);

            const response = await executeRequest(signedRequest);
            const transformedResponse = processResponseByRequestType(requestType,response)
            res.set('Content-Type', 'appplicaion/json').status(200).send(transformedResponse)

        }
        catch (err) {
            const parser = new DOMParser().parseFromString(err, 'text/xml');
            if (parser) {
                const faultstring = parser.documentElement.getElementsByTagName('faultstring');
                const faultcode = parser.documentElement.getElementsByTagName('faultcode');
                const requestUUID = parser.documentElement.getElementsByTagName('requestUUID');
                this.returnResponseError(res, 400, {
                    faultCode: faultcode && faultcode.length>0 ? faultcode[0].textContent : '',
                    faultstring: faultstring && faultstring.length>0? faultstring[0].textContent : '',
                    requestUUID: requestUUID && requestUUID.length>0? requestUUID[0].textContent : '',
                    rawErrror: err
                })
            }
                else {
                    this.returnResponseError(res, 400, {
                        faultCode: '89219',
                        faultstring: err.message?err.message:err,
                        requestUUID: '',
                        rawErrror: err.message?err.message:err
                    })
                }
        }

    }
}