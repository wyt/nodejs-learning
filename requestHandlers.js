/**
 * 请求处理器.
 */
 
// 引入child_process模块，通过exec()实现非阻塞操作
var exec = require("child_process").exec;

var querystring = require("querystring");

var fs = require("fs");

var formidable = require("formidable");

/** 模拟阻塞带来的问题. */
function startBlock() {
	console.log("Request handler 'start' was called.");
	
	function sleep(milliSeconds) {
		var startTime = new Date().getTime();
		while (new Date().getTime() < startTime + milliSeconds);
	}

	// wait 10s,会阻塞所有的其他处理
	sleep(10000);
	return "Hello Start";
}

/** 返回empty，exec()异步 */
function startProblem() {
	console.log("Request handler 'start' was called.");
	
	var content = "empty";
	exec("ls -lah", function (error, stdout, stderr) {
		content = stdout;
	});
	
	return content;
}

function startExec(response) {
	console.log("Request handler 'start' was called.");
	
	// exec完成后调用回调函数输出结果
	exec("ls -lah", function (error, stdout, stderr) {
		response.writeHead(200, {"Content-Type": "text/plain;charset=UTF-8"});
		response.write(stdout);
		response.end();
	});
}

function start(response, request) {
  console.log("Request handler 'start' was called.");

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" '+
    'content="text/html; charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" '+
    'method="post">'+
    '<input type="file" name="upload">'+
    '<input type="submit" value="Upload file" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}


function upload(response, request) {
	console.log("Request handler 'upload' was called.");
	
	var form = new formidable.IncomingForm();
	form.uploadDir='tmp';

	console.log("about to parse");
	form.parse(request, function(error, fields, files) {
		console.log("parsing done");
		fs.renameSync(files.upload.path, "./tmp/test.png");
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write("received image:<br/>");
		response.write("<img src='/show' />");
		response.end();
	});
}

function show(response, request) {
	console.log("Request handler 'show' was called.");
	fs.readFile("./tmp/test.png", "binary", function(error, file) {
		if(error) {
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {"Content-Type": "image/png"});
			response.write(file, "binary");
			response.end();
		}
	});
}

exports.start = start;
exports.upload = upload;
exports.show = show;