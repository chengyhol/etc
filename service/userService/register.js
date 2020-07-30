let db = require("../../utils/db.js");
let crypt = require('../../utils/crypt');
let redis = require("../../utils/redis");
let corresponder = require("../../utils/correspond");
module.exports = {
    async  register(request, response, configs, form) {
        let { mobile, password, vcode } = form.fields;
        console.log("-------------注册账号-------------")
        console.log(`接收到的注册数据为：\n手机号：${mobile},密码：${password},验证码：${vcode}`)
        let client = new redis.Redis(configs.redis);
        client.get(mobile)
            .then(async res => {
                if (res == null) {
                    console.log("验证码已过期");
                    corresponder.correspond(response, 200, { errCode: 0, errMsg: "验证码已过期" });
                }
                else {
                    if (res !== vcode) {
                        console.log("验证码不一致");
                        corresponder.correspond(response, 200, { errCode: 0, errMsg: "验证码不一致" });
                    }
                    else {
                        try {
                            // console.log("不一致但还要执行这里的代码")
                            let mysql = new db.MySql(configs.mysql.my);

                            let qrySql = "select * from user where mobile=?";
                            let qryResult = await mysql.asyncExec(qrySql, [mobile]);
                            if (qryResult.length === 1) {
                                //已存在
                                console.log("已存在此用户");
                                corresponder.correspond(response, 200, { errCode: -1, errMsg: "已存在此用户" });
                            }
                            else {
                                //不存在
                                let userid = await crypt.encrypt('aes-192-cbc', configs.crypt.password, configs.crypt.salt, mobile);
                                let irtSql = "insert into user (userid,mobile,password) values(?,?,?)"
                                let irtResult = await mysql.asyncExec(irtSql, [userid, mobile, password]);
                                // console.log(irtResult)
                                if (irtResult.affectedRows === 1) {
                                    //添加记录成功
                                    console.log("注册成功");
                                    corresponder.correspond(response, 200, { errCode: 1, errMsg: "注册成功" });
                                }
                            }
                        } catch{
                            (err) => {
                                console.log(`注册失败：${err}`)
                            }
                        }
                    }

                }
            })

    }
}

