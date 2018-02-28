
/** 加载自定义的模块 */
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");


var handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;


// router.route 是一个函数定义
server.start(router.route, handle);