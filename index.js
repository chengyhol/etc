let server = require("./server");
let requestHandler = require("./requestHandler");
let handle = {};

handle['/'] = requestHandler.start;
handle['/start'] = requestHandler.start;
handle['/upload'] = requestHandler.upload;
handle['/login'] = requestHandler.login;
handle['/register'] = requestHandler.register;
handle['/user/findUser'] = requestHandler.findUser;
handle['/user/updatePassword'] = requestHandler.updatePassword;
handle['/getvcode'] = requestHandler.getvcode;
handle['/upload'] = requestHandler.upload;
handle['/getAccessToken'] = requestHandler.getAccessToken;
handle['/ocr'] = requestHandler.ocr;
handle['/id/check'] = requestHandler.idCheck;
handle['/id/auth'] = requestHandler.idAuth;
handle['/vehicle/getVehicleList'] = requestHandler.getVehicleList;
handle['/vehicle/vehicleConfirm'] = requestHandler.vehicleConfirm;
handle['/bankcard/bankcardConfirm'] = requestHandler.bankcardConfirm;
handle['/binding'] = requestHandler.binding;
handle['/invoce'] = requestHandler.invoce;
handle['/getInvoce'] = requestHandler.getInvoce;
handle['/getQuestionList'] = requestHandler.getQuestionList;
handle['/getInfomationList'] = requestHandler.getInfomationList;
handle[`/download`] = requestHandler.download;
handle['/test'] = requestHandler.test;
handle['/test2'] = requestHandler.test2;


handle['/admin/login'] = requestHandler.adminLogin;
handle['/admin/getUserList'] = requestHandler.getUserList;
handle['/admin/getETCList'] = requestHandler.getETCList;
handle['/admin/getInvoceList'] = requestHandler.getInvoceList;
handle['/admin/freezeUser'] = requestHandler.freezeUser;
server.start(handle);