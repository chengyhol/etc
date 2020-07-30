let db = require("../../utils/db");
let string = require("../../utils/string");

let corresponder = require("../../utils/correspond");
module.exports = {
    async binding(request, response, configs, form) {
        console.log(`开始申请设备，获取的前台数据为：${form.fields}`);//含有userid，vehicle_num，bankcard_num
        let { userid, info } = form.fields;
        let vhMysql = new db.MySql(configs.mysql.vehicle);
        let myMysql = new db.MySql(configs.mysql.my);
        vhMysql.asyncExec("select * from etc where status=? limit 1", [0])
            .then(res => {
                let etc_num = res[0].etc_num;
                console.log(`选取的ETC号为：${res[0].etc_num}`);
                return myMysql.asyncExec("select * from id where userid=?", [userid])
                    .then(res => {
                        console.log(`用户${userid}对应的身份证号为：${res[0].id},所有人为：${res[0].name}`);
                        let id_num = res[0].id;
                        let owner = res[0].name;
                        return myMysql.asyncExec("insert into binding values(?,?,?,?,?,?,?)",
                            [info.vehicle_num, etc_num, info.bankcard_num, owner, info.mobile, id_num, string.getTime()])
                            .then(res => {
                                return vhMysql.asyncExec("update etc set status=? where etc_num=?", [1, etc_num]);
                            });
                    });
            }).then(res => {
                if (res.affectedRows == 1) {
                    console.log("申请成功");
                    corresponder.correspond(response, 200, { errCode: 1, errMsg: "申请成功" }, 'application/json');
                }
            }).catch(err => {
                console.log("申请失败");
                corresponder.correspond(response, 200, { errCode: 0, errMsg: "申请失败" }, 'application/json');
            })
    }
}


