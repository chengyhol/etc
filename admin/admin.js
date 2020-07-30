let db = require("../utils/db");
let correspond = require("../utils/correspond");
module.exports = {
    configCORS(response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", "*");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type,admin");
        response.setHeader("Access-Control-Expose-Headers", "*");
    },
    login(request, response, configs, form) {
        console.log("------------------------管理员登陆--------------------")
        let { username, password } = form.fields;
        console.log(`管理员：${username},密码：${password}`)
        this.configCORS(response);
        let mysql = new db.MySql(configs.mysql.my);
        mysql.asyncExec('select * from admin where username=?', [username])
            .then(admin => {
                if (admin.length !== 1) {
                    correspond.correspond(response, 200, { 'errCode': -1, 'errMsg': '未找到此管理员' })
                }
                else {
                    if (admin[0].password !== password) {
                        console.log("密码错误")
                        correspond.correspond(response, 200, { 'errCode': 0, 'errMsg': '密码错误' })
                    }
                    else {
                        console.log("登陆成功")
                        correspond.correspond(response, 200, { 'errCode': 1, 'errMsg': '登陆成功' })
                    }
                }
            })
    },
    getUserList(request, response, configs, form) {
        console.log("---------------------获取用户列表-------------------");
        let mysql = new db.MySql(configs.mysql.my);
        this.configCORS(response);
        console.log(form)
        mysql.asyncExec("select * from user", [])
            .then(userList => {
                console.log(userList)
                if (userList.length == 0) {
                    correspond.correspond(response, 200, { errCode: 0, errMsg: "用户列表为空", userList });
                }
                else {
                    console.log("获取成功")
                    correspond.correspond(response, 200, { errCode: 1, errMsg: "获取成功", userList });
                }
            })
    },
    getETCList(request, response, configs, form) {
        console.log("---------------------获取用户列表-------------------");
        let mysql = new db.MySql(configs.mysql.vehicle);
        this.configCORS(response);
        mysql.asyncExec("select * from etc", [])
            .then(ETCList => {
                console.log(ETCList)
                if (ETCList.length == 0) {
                    correspond.correspond(response, 200, { errCode: 0, errMsg: "ETC列表为空", ETCList });
                }
                else {
                    console.log("获取成功")
                    correspond.correspond(response, 200, { errCode: 1, errMsg: "获取成功", ETCList });
                }
            })
    },
    getInvoceList(request, response, configs, form) {
        console.log("-----------------------获取订单列表-----------------------")
        let mysql = new db.MySql(configs.mysql.my);
        this.configCORS(response);
        mysql.asyncExec("select * from invoce", [])
            .then(invoceList => {
                console.log(invoceList)
                if (invoceList.length == 0) {
                    correspond.correspond(response, 200, { errCode: 0, errMsg: "订单列表为空", invoceList });
                }
                else {
                    console.log("获取成功")
                    correspond.correspond(response, 200, { errCode: 1, errMsg: "获取成功", invoceList });
                }
            })
    },
    freezeUser(request, response, configs, form) {
        console.log("---------------------冻结用户------------------------");
        let userid = form.fields.userid;
        let mysql = new db.MySql(configs.mysql.my);
        console.log(`您要冻结用户：${userid}`);
        console.log(form)
        // TODO 支持跨域访问
        this.configCORS(response);
        // mysql.asyncExec("update user set frozentime=?, frozenexpires=? where userid=?", [Date.now(), 2 * 24 * 60 * 60 * 1000, userid])
        //     .then(res => {
        //         console.log(res)
        // if (res.affectedRows === 1) {
        //     console.log("冻结成功")
        //     correspond.correspond(response, 200, { errCode: 1, errMsg: "冻结成功" });
        // }
        // else {
        //     console.log("冻结失败")
        //     correspond.correspond(response, 200, { errCode: 0, errMsg: "冻结失败" });
        // }
        // })
    }
}