let db = require("../../utils/db");
let crypt = require('../../utils/crypt');
let string = require('../../utils/string');
let corresponder = require("../../utils/correspond");
module.exports = {
    async generateInvoce(request, response, configs, form) {

        //invoce_id,vehicle_num,etc_num,bankcard_num,consignee,mobile,address,invoce_time
        let userid = form.fields.userid;
        let data = form.fields.data;//{name:xxx,age:xx}
        console.log(`-----------------------进行生成账单---------------------`);
        console.log(`接收到的数据为：`, data);
        let mysql = new db.MySql(configs.mysql.my);

        try {
            let invoce_id = await crypt.encrypt('aes-192-cbc', configs.crypt.password, configs.crypt.salt, userid + Date.now().toString());
            let bindingData = (await mysql.asyncExec("select * from binding where vehicle_num=?", [data.vehicle_num]))[0];
            //vehicle_num,etc_num,bankcard_num,owner,mobile_num,id_num,binding_time
            console.log(`根据车牌号查询到的绑定信息为：`, bindingData);
            let res = await mysql.asyncExec("insert into invoce values(?,?,?,?,?,?,?,?,?)",
                [invoce_id, userid, bindingData.vehicle_num, bindingData.etc_num, bindingData.bankcard_num, data.consignee, data.address, data.mobile, string.getTime()])
            console.log(res)
            if (res.affectedRows === 1) {
                console.log("生成账单成功")
                corresponder.correspond(response, 200, { errCode: 1, errMsg: "生成账单成功", invoce_id: invoce_id });
            } else {
                console.log("生成账单失败")
                corresponder.correspond(response, 200, { errCode: 0, errMsg: "生成账单失败" });
            }
        } catch (error) {
            console.log(error)
        }
    },
    getInvoce(request, response, configs, form) {
        console.log("------------------查询账单----------------")
        let userid = form.fields.userid;
        let mysql = new db.MySql(configs.mysql.my);
        mysql.asyncExec("select * from invoce where userid=?", [userid])
            .then(res => {
                if (res.length === 0) {
                    corresponder.correspond(response, 200, { errCode: -1, errMsg: "没有该用户id下的账单" });
                }
                else
                    corresponder.correspond(response, 200, { errCode: 1, errMsg: "查询成功", invoce: res[0] });
            })
    }
}