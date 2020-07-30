let db = require("../utils/db");
let corresponder =require("../utils/correspond");
module.exports = {
    async getQuestionList(request, response, configs, form) {
        console.log("--------------------请求问题列表------------------")
        let mysql = new db.MySql(configs.mysql.my);
        try {
            let questionList = await mysql.asyncExec("select * from qa", []);
            console.log("获取成功，数据库中保存的问题列表为：", questionList)
            corresponder.correspond(response,200,questionList)
        } catch (error) {
            console.log(error)
        }
    }
}