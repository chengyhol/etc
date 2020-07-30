let redis = require("D:/Programming/js/nodejs/node_global/node_modules/redis");

class Redis {
    constructor(config) {
        this.client = redis.createClient(config.port, config.host, { password: config.password });
        this.client.on('ready', () => {
            console.log("reids123已准备")
        })
        this.client.on('connect', () => {
            console.log("redis123已连接")
        })
        this.client.on('error', () => {
            console.log("redis出错")
        })
        this.client.on('end', () => {
            console.log("redis已退出")
        })
    }
    quit() {
        this.client.quit();
    }
    set(key, value, options = {}) {
        return new Promise((resolve, reject) => {
            this.client.set(key, value, err => {
                if (!err) {
                    if (options.expire) {
                        console.log("超时时间：", options.expire);
                        resolve(options.expire);
                    }
                    else resolve("没有超时时间");
                }
                else reject(err);
            })
        }).then(expire => {
            return new Promise(resolve => {
                console.log("执行设置超时时间")
                this.client.expire(key, expire, err => {
                    // console.log(err)
                    if (!err) resolve(`设置超时时间为：${expire}`)
                })
            })
        })
    }
    get(key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, (err, res) => {
                if (!err) resolve(res)
                else reject(err)
            })
        })
    }
}

module.exports = {
    Redis
}