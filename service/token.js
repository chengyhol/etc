let crypt = require("../utils/crypt");
let db = require("../utils/db");
let util = require('util')
let axios = require('C:/Users/Cheng/AppData/Roaming/npm/node_modules/axios');
module.exports = {
    /**
     * 
     * @param {用户id} userid 
     */
    generate(sessionKey, openId, cryptConfig) {
        console.log(crypt.encrypt('aes-192-cbc', cryptConfig.password, cryptConfig.salt, `{sessionKey:${sessionKey},openId:${openId}}`))
        return crypt.encrypt('aes-192-cbc', cryptConfig.password, cryptConfig.salt, `{sessionKey:${sessionKey},openId:${openId}}`);
    },
    store(userid, token, sessionKey, openId, expires, mysqlConfig) {
        let mysql = new db.MySql(mysqlConfig);
        let currentTime = Date.now();
        console.log(userid, token, sessionKey, openId, expires, mysqlConfig)
        return mysql.asyncExec("update user set token=?,sessionKey=?,openId=?,expires=?,lastLoginTime=? where userid=?", [token, sessionKey, openId, expires, currentTime, userid]);
    },
    check(userid, token, mysqlConfig) {

        // console.log(config)
        let mysql = new db.MySql(mysqlConfig);
        let sql = "select * from user where userid=?";
        return mysql.asyncExec(sql, [userid])
            .then(res => {
                console.log(res[0])
                console.log(Date.now() - parseInt(res[0].lastLoginTime))
                if (Date.now() - res[0].lastLoginTime > res[0].expires) {
                    return Promise.resolve({ errCode: -100, errMsg: "已过期" })
                }
                else {
                    return res[0].token === token ? Promise.resolve({ errCode: 1, errMsg: "一致" }) : Promise.resolve({ errCode: 0, errMsg: "不一致" })
                }
            })
    },
    getSessionKey(miniConfig, code) {
        let url = util.format(miniConfig.api.getSessionKey, miniConfig.api.domain, miniConfig.appid, miniConfig.secret, code);
        console.log(url);
        return axios.get(url).then(res => {
            console.log(res.data)
            return Promise.resolve(res.data)
        })
    }
}
