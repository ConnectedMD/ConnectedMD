"use strict";

//-- global
var os = require("os");
var http = require("http");
var https = require("https");
var content = require("./presenter.js");
var fs = require("fs");
var cluster = require("cluster");

//-- vars
var startup = process.argv[1];
var exe = process.argv[0];
var siteCache = !cluster.isMaster ? require("./loadCache.js").getCache() : null;
var etagCache = [];
var cacheBuster = true;
var numCPUs = os.cpus().length;
var machineName = os.hostname().toUpperCase();
var port = process.env.PORT !== undefined ? process.env.PORT || 80 : 80;
var apiUrl = process.env.api !== undefined ? process.env.api : "";
var clusterForks = 2;

//-- caching
//if (cluster.isMaster) {
//	if (cacheBuster) {
//		var chokidar = require('chokidar');
//		var watcher = chokidar.watch(["common", "content", "css", "fonts", "login-static", "static-data", "style-guide"], {
//			ignored: /[\/\\]\./,
//			persistent: true
//		}).on('change', function (path, stats) {
//			consoleLog("File Change: " + path);
//			etagCache = [];
//		});
//	}
//}

//-- messaging
var consoleLog = function (message, force) { console.log(message); };

//-- get cmd line overrides
if (process.argv.length > 2) {
    process.argv.forEach(function (val, index, array) {
        if (val.indexOf("=") > 0) {
            var param = val.split("=");
			if (param[0].toLowerCase() === "cluster") { clusterForks = parseInt(param[1]); }
			if (param[0].toLowerCase() === "port") { if (param[1] !== "") { port = parseInt(param[1]); } }
			if (param[0].toLowerCase() === "api") { apiUrl = param[1]; }
        }
    });
}
process._maxListeners = 99;

var serverInfo = function () {
    consoleLog("");
	consoleLog("\x1b[36mMachine " + os.hostname().toUpperCase()  + " with " + numCPUs + " CPUs. In cluster Mode.\x1b[0m", true);
    consoleLog("\n\x1b[1;42m ConnectedMD.node          \x1b[0m");
    consoleLog("\x1b[92m Start Path.......: \x1b[0m" + startup);
    consoleLog("\x1b[92m Execute Path.....: \x1b[0m" + process.cwd());
	consoleLog("\x1b[92m Port.............: \x1b[0m" + port);
	consoleLog("\x1b[92m Debug Port.......: \x1b[0m" + process.debugPort);
    consoleLog("\x1b[92m clusterForks.....: \x1b[0m" + clusterForks);
    consoleLog("\x1b[1;43m node.js/io.js               \x1b[0m");
    consoleLog("\x1b[93m EXE..............: \x1b[0m" + exe);
    consoleLog("\x1b[93m Version..........: \x1b[0m" + process.versions.node);
	consoleLog("\x1b[93m Http Parser......: \x1b[0m" + process.versions.http_parser);
	consoleLog("\x1b[93m V8...............: \x1b[0m" + process.versions.v8);
	consoleLog("\x1b[93m UV...............: \x1b[0m" + process.versions.uv);
	consoleLog("\x1b[93m zlib.............: \x1b[0m" + process.versions.zlib);
	consoleLog("\x1b[93m Ares.............: \x1b[0m" + process.versions.ares);
	consoleLog("\x1b[93m Modules..........: \x1b[0m" + process.versions.modules);
	consoleLog("\x1b[93m OpenSSL..........: \x1b[0m" + process.versions.openssl);
	consoleLog("\x1b[93m Arch.............: \x1b[0m" + process.arch);
	consoleLog("\x1b[93m Platform.........: \x1b[0m" + os.platform());
};

var portInUse = function () {
	console.log("\n\x1b[1;42m Port " + port + " in use. Chose a diffrent port \x1b[0m");
};

//-- HTTP Server for redirect
var serverRequest = function (req, res) {
	if (req.method == "GET") {
		content.presenter(req, res, siteCache, etagCache, apiUrl);
	} else {
		console.log("\x1b[1;41m " + req.method + "\x1b[0m", req.url);
		res.writeHead(404, { 'Content-Type': 'text/plain'});
		res.end("Only allows GET");
	}
};

//-- start listener based on config
if (process.env.NODE_ENV == "dev" || process.env.PORT !== undefined) {
	var server = http.createServer(function (req, res) { serverRequest(req, res); }).listen(port);
} else {
	if (cluster.isMaster) {
		//-- console summary
		serverInfo();
		// start clusters
		for (var i = 1; i <= clusterForks; i++) { cluster.fork(); }
		cluster.on("exit", function(worker, code, signal) { var exitCode = worker.process.exitCode; consoleLog("worker " + worker.process.pid + " died (" + exitCode + "). restarting..."); cluster.fork(); });
		cluster.on('listening', function(worker, address) { consoleLog("Worker " + worker.process.pid + " listening  on " + address.port); });
	} else {
		// Workers can share any TCP connection, In this case its a HTTP server
		var server = http.createServer(function (req, res) { serverRequest(req, res); }).listen(port);
	}
}