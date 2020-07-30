let token = require("../service/getAccessToken")
let request = require('D:/Programming/js/nodejs/node_global/node_modules/request');
let uploader = require("./upload");
let fs = require('fs')
let util = require('util');
// let ocrData = require("../tmp/js/ocrData");
let corresponder = require("../utils/correspond");

module.exports = {
    ocr(req, response, configs, form) {
        // console.log(request)
        // console.log(configs)
        let userid = form.fields.userid;
        let type = form.fields.type;
        let path = form.files.uploadImage.path;
        let p1 = token.getAccessToken(configs);//读取或重新请求access_token
        let mini = configs.miniProgram;//读取配置，获取小程序配置信息
        let p2 = uploader.upload(userid, type, path);//上传图片
        Promise.all([p1, p2])
            .then(res => {
                // console.log(res[1])
                let imgPath = res[1].path;
                let type = res[1].info.type;
                let access_token = res[0].access_token;
                let api = mini.api;
                let url = util.format(api.ocr, api.domain, type, access_token);
                const image = fs.createReadStream(imgPath);

                let formData = { image };

                request.post({ url: url, formData: formData }, (err, res, body) => {
                    if (err) {
                        return console.error('upload failed:', err);
                    }
                    // console.log(typeof body, body)
                    if (JSON.parse(body).errcode == "45002") {
                        console.log("图片大小超过了限制");
                        corresponder.correspond(response, 200, body);
                    }
                    console.log("识别结果：", JSON.parse(body));
                    corresponder.correspond(response, 200, body);
                })
            })
            .catch(err => {
                console.log(err);
                response.writeHead(200, { 'content-type': 'application/json' });
                response.write(JSON.stringify({ errCode: 0, errMsg: 'fail' }));
                response.end();
            })
    }
}

// curl -F 'img=@C:/Users/Cheng/Desktop/my/uploads/11111111we5f4wew54wef87we/1586913787514.jpg;type=image/jpg' -F 'ratios=1,2.35' "http://api.weixin.qq.com/cv/img/aicrop?access_token=32_WQ6m642o2b4_WvH8HgRycGcP4JN7X67QIN1jjJmrbDjOaX_Kg0nX7RIehgWYQ0CFDMgbTd1Yf4Eo82Ps_vDPpPl8jYcP3g0X81zRAXUMRG8K74JLJH2JSCBNMgpPeox0Rp7KbOK4g2J9dmPsIQAhAHAPXH"
