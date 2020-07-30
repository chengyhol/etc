let http = require("http");
let url = require("url");
let router = require("./router");
let fs = require('fs');
let config = require('./service/config');
let event = require('events');
let getRequest = require('./utils/http');
let tokenn = require("./service/token");
let db = require("./utils/db");
let formidable = require('D:/Programming/js/nodejs/node_global/node_modules/formidable');
let corresponder = require("./utils/correspond");

module.exports = {
    config: {
        port: 8888,
        host: '127.0.0.1'
    },
    async start(handle) {
        this.init().then(//解析配置文件
            configs => {
                let server = http.createServer(async (request, response) => {
                    let pathname = url.parse(request.url).pathname;
                    console.log(`Request for ${pathname} received.`);
                    let form = new formidable.IncomingForm();
                    form.uploadDir = "./uploads/tmp";//上传路径
                    form.encoding = "utf-8";
                    form.type = "multiple";
                    form.keepExtensions = true;
                    form.parse(request, (err, fields, files) => {
                        console.log(`请求头为：`)
                        console.log(request.headers)
                        if (err) console.log(err);
                        //检查token是否过期

                        if (request.headers.token === undefined) {//不含token的请求（注册/获取资讯···）
                            router.route(pathname, handle, request, response, configs, { fields, files });
                        }
                        else {
                            let token = request.headers.token;
                            console.log(`接收到的登录token为：${token}`);
                            tokenn.check(fields.userid, token, configs.mysql.my)
                                .then(res => {
                                    if (res.errCode === 1) {
                                        console.log(`登录token有效`);
                                        router.route(pathname, handle, request, response, configs, { fields, files });
                                    }
                                    else if (res.errCode === -100) {
                                        console.log(`登录token已过期`);
                                        corresponder.correspond(response, 200, { errCode: -100, errMsg: "登录态过期，请重新登录" })
                                    }
                                })
                        }
                    })
                });
                server.addListener('close', () => {
                    console.log("服务关闭")
                })
                server.listen(this.config.port, this.config.host,
                    () => {
                        console.log(`Server running at http://${this.config.host}:${this.config.port}`);
                    }
                )
            }
        )
            .catch(err => {
                throw Error("读取配置文件失败")
            })
    },
    init(filepath = './config.json') {
        return config.getAllConfigs()
            .then(configs => {
                return Promise.resolve(configs)
            })
            .catch(err => console.log(err))
    },
    checkToken(request, response) {
        let tokenListener = new event();
        tokenListener.on('token_out_of_date', () => {

        })
    }

}
