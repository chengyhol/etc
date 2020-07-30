// let axios = require('axios')
let buffer = require("buffer");

module.exports = {
    // request(url) {
    //     return axios.get(url);
    // },
    getPostData(request) {
        return new Promise((resolve, reject) => {
            let bufferList = [];
            request.on('data', chunk => {
                bufferList.push(Buffer.from(chunk))
            })
            request.on('end', () => {
                // console.log(Buffer.concat(bufferList).toString('utf8'));
                if (!Buffer.concat(bufferList).toString('utf8')) reject("获取post请求数据失败！");
                let data = Buffer.concat(bufferList).toString('utf8');
                if (data.length <= 500) {
                    resolve(JSON.parse(data));
                }
                else resolve(null);

            })
            request.on('error', err => {
                reject("获取post请求数据失败！")
            })
        })
    },
    getHeaders(request) {
        return request.headers;
    }
}

