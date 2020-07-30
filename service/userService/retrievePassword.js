let db = require("../../utils/db");
let corresponder = require("../../utils/correspond");
let redis = require("../../utils/redis");
module.exports = {
    async findUser(request, response, configs, form) {
        console.log("------------------查找用户-----------------");
        let { mobile, vcode } = form.fields;
        console.log(`接收到的注册数据为：\n手机号：${mobile},验证码：${vcode}`)
        let client = new redis.Redis(configs.redis);

        let rvcode = await client.get(mobile);
        if (rvcode == null) {
            console.log("验证码已过期");
            corresponder.correspond(response, 200, { errCode: 0, errMsg: "验证码已过期" });
        }
        else {
            if (rvcode != vcode) {
                console.log("验证码不一致");
                corresponder.correspond(response, 200, { errCode: 0, errMsg: "验证码不一致" });
            }
            else {
                console.log("验证码一致");
                let mysql = new db.MySql(configs.mysql.my);
                let user = await mysql.asyncExec("select * from user where mobile=?", [mobile]);
                if (user.length == 1) {
                    console.log("查找用户成功");
                    corresponder.correspond(response, 200, { errCode: 1, errMsg: "查找用户成功" });
                }
                else if (user.length == 0) {
                    console.log(用户不存在);
                    corresponder.correspond(response, 200, { errCode: 0, errMsg: "用户不存在" });
                }
                else corresponder.correspond(response, 200, { errCode: -1, errMsg: "查找失败" });
            }
        }
    },
    async updatePassword(request, response, configs, form) {
        console.log("------------------修改密码-----------------");
        let { mobile, vcode, password } = form.fields;
        console.log(`收到的数据为：手机号：${mobile},新密码：${password}`);
        let mysql = new db.MySql(configs.mysql.my);
        let res = await mysql.asyncExec("update user set password=? where mobile=?", [password, mobile]);
        if (res.affectedRows === 1) {
            console.log("修改成功");
            corresponder.correspond(response, 200, { errCode: 1, errMsg: "修改成功" });
        }
        else {
            console.log("修改失败");
            corresponder.correspond(response, 200, { errCode: 0, errMsg: "修改失败" });
        }
    }
}