let db = require("../../utils/db");
let corresponder = require("../../utils/correspond");
module.exports = {
    async getVehicleList(request, response, configs, form) {
        console.log(form.fields)
        try {
            let mysql = new db.MySql(configs.mysql.vehicle);
            let sql = "select * from id where userid=?";
            let userid = form.fields.userid;
            let res = await mysql.asyncExec(sql, [userid]);
            let id = res[0].id;
            let q = "select * from vehicle where id_num=?";
            let result = await mysql.asyncExec(q, [id]);
            if (result.length > 0) {
                corresponder.correspond(response, 200, { errCode: 1, errMsg: "查询成功", vehicleList: result });
            }
            else {
                corresponder.correspond(response, 200, { errCode: 0, errMsg: "没有车辆" });
            }
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    },
    async vehicleConfirm(request, response, configs, form) {
        console.log("接收到的post数据为：", form.fields);
        let userid = form.fields.userid;
        let vehicleInfo = form.fields.vehicleInfo;
        let myMysql = new db.MySql(configs.mysql.my);
        let vhMysql = new db.MySql(configs.mysql.vehicle);
        // "select * from id where userid=?"//根据userid查找身份认证表得到身份证号
        // "select * from vehicle where vehicle_num=?";//通过车牌号查询车辆信息
        let flag = await this.check(myMysql, [vehicleInfo.vehicle_num]);
        if (flag) {
            console.log("----------未绑定，开始验证车辆-----------")
            let vehicle = (await vhMysql.asyncExec("select * from vehicle where vehicle_num=?", [vehicleInfo.vehicle_num]))[0];
            let id = (await myMysql.asyncExec("select * from id where userid=?", [userid]))[0];
            if (id.id !== vehicle.id_num) { //两个身份证号是否一致
                console.log(id)
                console.log("身份证号不一致")
                corresponder.correspond(response, 200, { errCode: 0, errMsg: "所有人不一致" }, 'application/json')
            }
            else {
                let valid = Object.keys(vehicleInfo).every(item => {//item=>plate_num,owner,vin,engine_num,record
                    if (vehicleInfo[item] != vehicle[item]) {
                        console.log(`${item}验证失败`)
                        corresponder.correspond(response, 200, { errCode: -1, errMsg: `${item}不一致` });
                    }
                    else {
                        console.log(`${item}验证通过`)
                    }
                    return vehicleInfo[item] == vehicle[item]
                })
                if (valid) {
                    corresponder.correspond(response, 200, { errCode: 1, errMsg: "车辆验证通过" }, 'application/json')
                }
            }
        } else {
            console.log("---------------已绑定设备------------------");
            corresponder.correspond(response, 200, { errCode: -1, errMsg: "车辆已有绑定的ETC" }, 'application/json')
        }

    },
    async check(mysql, vehicle_num) {
        return mysql.asyncExec("select * from binding where vehicle_num=?", [vehicle_num])
            .then(res => {
                console.log(`查询到的binding表数据为：`, res);
                return Promise.resolve(res.length === 0)//length===0=>true:未绑定  false=>已绑定
            })
    }
}