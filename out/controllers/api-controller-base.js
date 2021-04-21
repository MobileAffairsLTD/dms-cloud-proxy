export class ApiControlerBase {
    constructor(configuraiton) {
        this.configuraiton = configuraiton;
    }
    returnResponseSucces(res, obj) {
        res.json(obj);
    }
    returnResponseError(res, httpStatusCode, obj) {
        res.status(httpStatusCode).json(obj);
    }
}
//# sourceMappingURL=api-controller-base.js.map