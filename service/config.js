let fs = require("fs");
let buffer = require("buffer");

module.exports = {
    getConfig(filepath) {
        return new Promise((resolve, reject) => {
            // console.log("in promise")
            fs.readFile(filepath, { encoding: 'utf8' }, (err, contentStr) => {
                // console.log("in readFile method");
                if (err) reject(err)
                else {
                    let contentObj = JSON.parse(contentStr);
                    resolve(contentObj)
                }
            })
        })
    },
    /**
     * 
     * @param {文件路径} filepath 
     * @param {要配置的key} key 
     * @param {键值} value 
     */
    setCfgThruStream(key, value) {
        return new Promise((resolve, reject) => {
            this.getAllConfigs()
                .then(config => {
                    // console.log(config)
                    config[key] = value;

                    let writeStream = fs.createWriteStream('./config.json')
                    writeStream.write(JSON.stringify(config, null, 2), 'UTF-8');

                    writeStream
                        .on('data', chunk => {
                            console.log(chunk)
                            console.log(chunk.toString())
                        })
                        .on('finish', () => { resolve("success"); })
                        .on('error', err => { reject("写入失败"); })
                    writeStream.end();
                })
        })

    },
    /**
     * 
     * @param {配置文件路径} filepath 
     */
    getCfgThruStream(...keys) {
        return new Promise((resolve, reject) => {
            let bufferList = [];
            fs.createReadStream('./config.json', 'utf8')
                .on('data', chunk => {
                    // console.log("buffer ",count++)
                    bufferList.push(Buffer.from(chunk))
                })
                .on('end', () => {
                    let resObj = JSON.parse(Buffer.concat(bufferList).toString());
                    let res = [...keys].reduce((pre, cur) => {
                        pre[cur] = resObj[cur]
                        return pre;
                    }, {})
                    resolve(res)
                })
                .on('error', err => reject(err))
        })
    },
    getAllConfigs() {
        return new Promise((resolve, reject) => {
            let bufferList = [];
            fs.createReadStream('./config.json', 'utf8')
                .on('data', chunk => {
                    // console.log("buffer ",count++)
                    bufferList.push(Buffer.from(chunk))
                })
                .on('end', () => {
                    let resObj = JSON.parse(Buffer.concat(bufferList).toString());
                    resolve(resObj);
                })
                .on('error', err => reject(err))
        })
    }
}
