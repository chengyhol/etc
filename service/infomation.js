let db = require("../utils/db");
let corresponder = require("../utils/correspond");
module.exports = {
    async getInfomationList(request, response, configs, form) {
        console.log("-------------------获取资讯列表----------------------");
        let mysql = new db.MySql(configs.mysql.my);
        try {
            let infomationList = await mysql.asyncExec("select * from infomation", []);
            console.log("获取成功，资讯列表为：", infomationList);
            corresponder.correspond(response, 200, infomationList)
        } catch (error) {
            console.log(error)
        }

    }
}