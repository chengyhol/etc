let axios = require('C:/Users/Cheng/AppData/Roaming/npm/node_modules/axios');
let config = require('./service/config');
let fs = require('fs');
let util = require('util');
// let token = require('./service/getAccessToken');
let formdata = require('D:/Programming/js/nodejs/node_global/node_modules/form-data');
let http = require('./utils/http');
let request = require('D:/Programming/js/nodejs/node_global/node_modules/request');
let uploader = require('./utils/upload');
let db = require("./utils/db");
// https://api.weixin.qq.com/cv/ocr/bankcard?type=MODE&img_url=ENCODE_URL&access_token=ACCESS_TOCKEN
let correspond = require('./utils/correspond')
// let map = require('./tmp/js/vcode');
let logintoken = require("./service/token");
let redis = require("./utils/redis");
let corr = require("./utils/correspond");
let token = require("./service/token")
// let mysql = new db.MySql({
//     "host": "127.0.0.1",
//     "user": "root",
//     "password": "197922",
//     "port": 3308
// },'node')

// let my2 = new db.MySql({
//     "host": "127.0.0.1",
//     "user": "root",
//     "password": "197922",
//     "database": "test",
//     "port": 3308
// },'test')

// mysql.asyncExec("select * from id", [])
//     .then(res => {
//         console.log(res);
//         my2.asyncExec("select * from user", [])
//             .then(res => console.log(res))
//     })
module.exports = {
    test(request, response, configs, form) {
        let code = form.fields.code;
        token.getSessionKey(configs.miniProgram, code)
            .then(res => {
                console.log(res)
            })
    }
}