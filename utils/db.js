let mysql = require("C:/Users/Cheng/AppData/Roaming/npm/node_modules/mysql");
let fs = require('fs');
let config = require('../service/config');

class MySql {
    constructor(config) {
        this.config = config;
        // console.log("实例化时的配置", this.config)
        this.conn = mysql.createConnection(this.config);
        this.conn.connect();
    }

    promiseExec(sql) {
        return new Promise((resolve, reject) => {
            this.conn.query(sql, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        })
    }
    callbackExec(sql, callback) {
        this.conn.query(sql, (err, results) => {
            if (err) console.log("query failed.");
            else callback(results)
        })
    }
    async asyncExec(sql, params) {
        return new Promise((resolve, reject) => {
            this.conn.query(sql, params, (err, results) => {

                if (err) {
                    console.log(`执行sql出错：${err}`)
                    reject("query failed.");
                }
                else {
                    resolve(results);
                }
            })
        })
    }
    close() {
        this.conn.end();
    }
}


module.exports = {
    MySql: MySql
}