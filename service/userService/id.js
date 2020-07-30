let http = require("../../utils/http");
let db = require("../../utils/db");
let string = require("../../utils/string");
let ocr = require("../../utils/ocr");
let corresponder = require("../../utils/correspond");

module.exports = {
    async check(request, response, configs, form) {
        let { userid } = form.fields;
        console.log("进行查询是否已经实名认证的用户为：", userid);
        let mysql = new db.MySql(configs.mysql.my);
        let sql = "select * from id where userid=?";

        let results = await mysql.asyncExec(sql, [userid]);
        console.log("查询结果为：", results);
        if (results.length === 0) {
            console.log("该用户还没有实名认证")
            corresponder.correspond(response, 200, { errCode: 0, errMsg: "没有认证" });
        }
        else {
            console.log("该用户已经实名认证了")
            let id = string.replace(results[0].id, 6, 14, '*');
            let name = string.replace(results[0].name, 2, 5, '*');
            corresponder.correspond(response, 200, { errCode: 1, errMsg: "已经认证了", info: { id, name } });
        }
    },
    async auth(request, response, configs, form) {
        let data = form.fields;
        console.log(`接收到的进行实名认证的数据为：`,data);
        let current_date = string.formatDate('-', new Date())//20200420将日期转化为和身份证格式一致的数字
        if (data.valid_date.substr(-8) > current_date) {
            //如果日期有效
            let mysql = new db.MySql(configs.mysql.my);
            let sql = "insert into id values(?,?,?,?)";
            // console.log(id)
            try {
                let result = await mysql.asyncExec(sql, [data.userid, data.id, data.name, string.getTime(new Date())]);
                console.log("认证成功")
                corresponder.correspond(response, 200, {
                    errCode: 1,
                    errMsg: "认证成功!"
                });

            }
            catch (err) {
                console.log("认证失败")
                response.writeHead(200, { 'content-type': 'application/json' });
                corresponder.correspond(response, 200, {
                    errCode: 0,
                    errMsg: "认证失败!"
                });
            }
        }
    }
}
