let db = require("../../utils/db");
let redis = require("../../utils/redis");
let corresponder = require("../../utils/correspond");

module.exports = {
    bankcardConfirm(request, response, configs, form) {
        console.log("---------------------验证银行卡--------------------");
        console.log(form.fields)
        const client = new redis.Redis(configs.redis);
        client.get(form.fields.info.mobile).then(async vcode => {
            if (!vcode) {
                console.log("验证码已过期");
                corresponder.correspond(response, 200, { errCode: 0, errMsg: "验证码已过期" });
            }
            else {
                let info = form.fields.info;
                let mysql = new db.MySql(configs.mysql.bank);
                let sql = "select * from bankcard where bankcard_num=?";
                let result = await mysql.asyncExec(sql, [info.bankcard_num]);
                if (info.mobile != result[0].mobile) {
                    console.log("手机号不符");
                    corresponder.correspond(response, 200, { errCode: -1, errMsg: "手机号不符" });
                }
                else {
                    console.log("手机号相符");
                    corresponder.correspond(response, 200, { errCode: 1, errMsg: "认证成功" });
                }
            }
        })
    }
}
