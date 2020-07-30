let fs = require('fs');
let querystring = require('querystring')
module.exports = {
    async download(request, response, configs, form) {
        let params = request.url.substr(request.url.indexOf('?') + 1);
        console.log("字段为：", querystring.parse(params))
        let path = querystring.parse(params).path;
        
        response.writeHead(200, { 'content-type': 'image/jpeg' });
        fs.readFile(path, (err, data) => {
            if (err) { console.log(err) }
            response.write(data);
            response.end();
        })

    }
}