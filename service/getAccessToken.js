let config = require("./config");
let util = require('util')
let axios = require('C:/Users/Cheng/AppData/Roaming/npm/node_modules/axios');

module.exports = {
    getAccessToken(configs) {
        return new Promise((resolve, reject) => {
            let time = Date.now().toString();
            // console.log(configs.token)
            if (configs.token == undefined || time.substring(0, time.length - 3) - configs.token.capTime > configs.token.expires_in)
                return resolve({ valid: false, mini: configs.miniProgram })
            return resolve({ valid: true, token: configs.token });
        })
            // return config.getCfgThruStream('token', 'miniProgram')
            //     .then(configs => {
            //         //没有获取到配置文件的token或者token已过期
            //         let time = Date.now().toString();

            //         if (configs.token == undefined || time.substring(0, time.length - 3) - configs.token.capTime > configs.token.expires_in)
            //             return Promise.resolve({ valid: false, mini: configs.miniProgram })
            //         return Promise.resolve({ valid: true, token: configs.token });
            //     })

            .then(res => {
                if (res.valid) { return Promise.resolve(res) }
                let url = util.format(res.mini.api.accessToken, res.mini.api.domain, res.mini.appid, res.mini.secret);
                return axios.get(url);
            })
            .then(
                res => {
                    if (res.valid) { return Promise.resolve(res.token) }
                    let token = res.data;
                    //请求token的时间（秒）
                    let time = Date.now().toString();
                    token.capTime = time.substring(0, time.length - 3);
                    token.expires_in = 60;
                    return config.setCfgThruStream('token', token).then( 
                        () => { console.log(token); return Promise.resolve(token) }
                    )
                }
            )
    }

}
// 1.从config.json中读取token
//     (1)存在则直接返回
//     (2)不存在/已过期则重新获取
// 2.获取后读取文件更新后重新写入