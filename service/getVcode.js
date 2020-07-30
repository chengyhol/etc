let redis = require("../utils/redis");

module.exports = {
    test(request, response, configs, form) {


        console.log('获取到的post数据为:', form.fields)
        let currentTimeStr = new Date().getTime().toString();
        //截取当前unix时间戳后六位作为验证码
        let vcode = currentTimeStr.substr(-6, currentTimeStr.length)
        response.writeHead(200, { 'content-type': 'application/json' });
        response.write(JSON.stringify({
            errCode: 1,
            vcode: vcode
        }));
        let time = Date.now();
        map.set(form.fields.mobile, { vcode: { value: vcode, expires: 60000, time: time } })
        console.log(map)
        response.end();


        // response.writeHead(300, { 'content-type': 'application/json' });
        // response.write(JSON.stringify({
        //     errCode: 0,
        //     errMsg: "获取验证码失败"
        // }));
        // response.end();

    },
    getvcode(request, response, configs, form) {
        const client = new redis.Redis(configs.redis);
        console.log(`---------------------获取验证码---------------------`);
        console.log(`收到的前台数据为：${form.fields}`);
        let mobile = form.fields.mobile;
        let currentTimeStr = new Date().getTime().toString();
        let vcode = currentTimeStr.substr(-6, currentTimeStr.length);
        client.set(mobile, vcode, { expire: 60 })
            .then(res => {
                console.log(res);
                response.writeHead(200, { 'content-type': 'application/json' });
                response.write(JSON.stringify({
                    errCode: 1,
                    vcode: vcode
                }));
                response.end();
                
            })


    }
}