let db = require("../../utils/db");
let logintoken = require("../token");

module.exports = {
    async login(request, response, configs, form) {
        console.log("----------------开始登录-----------------")
        let { mobile, password, code } = form.fields;
        console.log(`收到的前台数据为：\n 手机号：${mobile},密码：${password},code:${code}`)
        // console.log(mobile, password)
        console.log("config文件里的配置", configs.mysql)
        let mysql = new db.MySql(configs.mysql.my);
        let q = "select * from user where mobile = ?";
        try {
            let results = await mysql.asyncExec(q, [mobile]);
            // console.log(results)
            if (results.length === 0) {
                console.log("没有这个用户");
                response.writeHead(200, { 'content-type': 'application/json' })
                response.write(JSON.stringify({ errCode: -1, errMsg: "没有这个用户" }));
                response.end();
            }

            else {
                if (results[0].password !== password) {
                    console.log("密码错误")
                    response.writeHead(200, { 'content-type': 'application/json' })
                    response.write(JSON.stringify({ errCode: 0, errMsg: "密码错误" }));
                    response.end();
                } else {
                    let o = await logintoken.getSessionKey(configs.miniProgram, code);

                    let token = await logintoken.generate(o.sessionKey, o.openId, configs.crypt);
                    await logintoken.store(results[0].userid, token, o.session_key, o.openid, 60000 * 20, configs.mysql.my);
                    console.log(`用户${results[0].userid}登录, 本次登录token为${token}`);
                    response.writeHead(200, { 'content-type': 'application/json' })
                    response.write(JSON.stringify({ errCode: 1, errMsg: "登陆成功", userid: results[0].userid, token }));
                    response.end();
                }
            }
        } catch{
            err => console.log(err)
        }

    }
}

