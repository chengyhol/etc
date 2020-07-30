let login = require("./service/userService/login");
let register = require("./service/userService/register");
let getvcode = require("./service/getVcode");
let test = require("./test");
let uploader = require("./utils/upload");
let downloader = require("./utils/download");
let getAccessToken = require("./service/getAccessToken");
let ocr = require("./utils/ocr");
let id = require("./service/userService/id");
let vehicle = require("./service/vehicleService/vehicle");
let bankcard = require("./service/bankcardService/bankcard");
let binder = require("./service/vehicleService/binding");
let invoce = require("./service/vehicleService/invoce");
let questions = require("./service/questions");
let infomation = require("./service/infomation");
let retriever = require("./service/userService/retrievePassword");
let admin = require("./admin/admin");
module.exports = {
    start(request, response) {
        response.writeHead(200, { "content-type": "text/html" });
        response.write("Hello Start.");
        response.end();
    },
    login(request, response, configs, form) {
        login.login(request, response, configs, form);
    },
    register(request, response, configs, form) {
        register.register(request, response, configs, form);
    },
    findUser(request, response, configs, form) {
        retriever.findUser(request, response, configs, form);
    },
    updatePassword(request, response, configs, form) {
        retriever.updatePassword(request, response, configs, form);
    },
    getvcode(request, response, configs, form) {
        getvcode.getvcode(request, response, configs, form)
    },
    upload(request, response, configs, form) {
        uploader.upload(form).then(res => console.log(res), err => console.log(err))
    },
    download(request, response, configs, form) {
        downloader.download(request, response, configs, form);
    },
    getAccessToken(request, response, configs) {
        getAccessToken.getAccessToken(configs).then(res => {
            console.log(res);
            response.writeHead(200, { 'content-type': 'application/json' });
            response.write(JSON.stringify({ errCode: 1, token: res.access_token }));
            response.end();
        }, err => console.log(err))
    },
    ocr(request, response, configs, form) {
        ocr.ocr(request, response, configs, form);
    },
    idCheck(request, response, configs, form) {
        id.check(request, response, configs, form);
    },
    idAuth(request, response, configs, form) {
        id.auth(request, response, configs, form);
    },
    getVehicleList(request, response, configs, form) {
        vehicle.getVehicleList(request, response, configs, form);
    },
    vehicleConfirm(request, response, configs, form) {
        vehicle.vehicleConfirm(request, response, configs, form);
    },
    bankcardConfirm(request, response, configs, form) {
        bankcard.bankcardConfirm(request, response, configs, form);
    },
    binding(request, response, configs, form) {
        binder.binding(request, response, configs, form);
    },
    invoce(request, response, configs, form) {
        invoce.generateInvoce(request, response, configs, form);
    },
    getInvoce(request, response, configs, form) {
        invoce.getInvoce(request, response, configs, form);
    },
    getQuestionList(request, response, configs, form) {
        questions.getQuestionList(request, response, configs, form);
    },
    getInfomationList(request, response, configs, form) {
        infomation.getInfomationList(request, response, configs, form)
    },
    test(request, response, configs, form) {
        test.test(request, response, configs, form);
    },
    // ----------------------------------------------------------------------
    adminLogin(request, response, configs, form) {
        admin.login(request, response, configs, form);
    },
    getUserList(request, response, configs, form) {
        admin.getUserList(request, response, configs, form);
    },
    getETCList(request, response, configs, form) {
        admin.getETCList(request, response, configs, form);
    },
    getInvoceList(request, response, configs, form) {
        admin.getInvoceList(request, response, configs, form);
    },
    freezeUser(request, response, configs, form) {
        admin.freezeUser(request, response, configs, form);
    },
}