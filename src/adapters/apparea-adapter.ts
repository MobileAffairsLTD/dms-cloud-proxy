var https = require('https');

export class AppAreaAdapter {

    static async createRequest(options: {host: string; path: string; port?:number; headers?:Record<string, string>}): Promise<string> {

      
        return new Promise<any>((resolve, reject) => {
            const callback = function (response) {
                var str = ''
                response.on('data', function (chunk) {                                                           
                    str += chunk;                    
                });

           

                response.on('end', function (err) {
                    if(this.statusCode!=200){
                        if(str)
                            reject(str)
                        else 
                            reject(this.statusMessage)                            
                    }
                    else {
                        resolve(str);
                    }
                });
            }

            const req = https.request(options, callback);
            
            req.on('error', function (err) {
                reject(err)
            });

            req.end();
        });
    }

}


