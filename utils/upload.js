let fs = require('fs');
let formidable = require('D:/Programming/js/nodejs/node_global/node_modules/formidable');

module.exports = {
    upload(userid, type, path) {
        return new Promise((resolve, reject) => {
            resolve({ userid, type, path });

        }).then(
            res => {
                return new Promise((resolve, reject) => {
                    // console.log(res)
                    fs.access(`./uploads/${res.userid}`, fs.constants.F_OK, err => {
                        err ? reject(res) : resolve(res)
                    })
                })
            }
        ).then(
            res => { return Promise.resolve(res); },
            res => {
                return new Promise((resolve, reject) => {
                    // console.log(res)
                    fs.mkdir(`./uploads/${res.userid}`, err =>
                        err ? reject("创建文件夹失败！") : resolve(res)
                    )
                })
            }
        ).then(
            res => {
                return new Promise((resolve, reject) => {
                    let fileExt = res.path.slice(res.path.lastIndexOf('.'))//获取文件扩展名
                    let newPath = `./uploads/${res.userid}/${new Date().getTime().toString()}${fileExt}`;
                    fs.rename(res.path, newPath, err =>
                        err ? reject("上传失败") : resolve({ msg: "上传成功！", 
                        info: { userid: res.userid, type: res.type }, path: newPath, time: new Date().toString })
                    )
                })
            }
        )
    }
}