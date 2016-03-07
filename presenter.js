"use strict";

var fs = require("fs");
var mime = require("mime");
var async = require('async');
var crypto = require('crypto');
var zlib = require('zlib');
var packageInfo = require('./package.json');
var staticEXT = [".html", ".js",".css",".json",".xml",".map",".ttf",".woff",".png",".gif",".jpg",".swf",".swz",".ico",".svg", ".eot", ".pdf"];

var jsFiles = [
];

var cssFiles = [
];

exports.presenter = function (processRequest, processResponse, siteCache, etagCache, apiUrl) {
	//-- get language
	var lang = processRequest.headers["accept-language"] !== undefined ? processRequest.headers["accept-language"].toLowerCase() : "en-us";
	if (lang.length == 2 || lang.length > 5) {
		if (lang.length > 5) { lang = lang.substring(0,5); }	
		if (lang == "en") { lang = "en-us"; }
		if (lang == "hu") { lang = "hu-hu"; }
	}
	//-- default to english for unsupport languages
	if (!lang.startsWithAny(["en-us","hu-hu"])) { lang = "en-us"; }
	//-- vars
	var requestHost = processRequest.headers.host == undefined ? "" : processRequest.headers.host.toLowerCase();
	var requestReferer = processRequest.headers.referer;
	var requestHttpVersion = processRequest.httpVersion;
	var relativePath = processRequest.url;
	var requestMethod = processRequest.method;

	//-- override default routing
	if (relativePath.startsWith("/")) { relativePath = relativePath.substring(1); }
	if (relativePath.substring(0,1) == "?") { relativePath = ""; }
	if (relativePath === "") {
		var token = getCookie("TOKEN");
		if (token === "0" || token === null || token === "") {
			console.log("LOGIN", token, relativePath);
			relativePath = "login-static/login.html";
		} else {
			console.log("APP", token, relativePath);
			relativePath = "index.html";	
		}
	}
	if (relativePath.indexOf("?") > 0) { relativePath = relativePath.substring(0,relativePath.indexOf("?")); }
	//-- load default if no extention
	if (mime.lookup(relativePath) == "application/octet-stream") { relativePath = "index.html"; }
	if (relativePath.indexOf(".map") > 0) {
		console.log("\x1b[1;44m REMAP \x1b[0m " + relativePath);
		switch (relativePath) {
			case "angular-messages.min.js.map":
				relativePath = "node_modules/angular-messages/angular-messages.min.js.map";
				break;
			case "node_modules/jquery/dist/jquery.min.js.map":
				relativePath = "node_modules/jquery/dist/jquery.min.map";
				break;
			case "node_modules/traceur/bin/traceur.js.map":
				relativePath = "blank.txt";
				break;
			case "underscore-min.map":
				relativePath = "node_modules/underscore/underscore-min.map";
				break;
		}
	}
	//-- process file request
	if (relativePath == "3rdparty.js") {
		processResponse.writeHead(200, { "Content-Type": "application/javascript" });
		async.map(jsFiles, fs.readFile, function(err, data) {
			if(err) {
            console.log("ERROR 3rdparty.js: ", err);
            processResponse.end(err);
         } else {
				for (var f = 0; f < data.length; f++) {
					processResponse.write(data[f]);
					processResponse.write("\n\n");
				}
            //-- HACK: to fix webshim a.swap issue
            processResponse.write("\n\n");
            processResponse.write(`
               jQuery.swap = function( elem, options, callback, args ) {\n
                  var ret, name, old = {};\n
                  for ( name in options ) {\n
                           old[ name ] = elem.style[ name ];\n
                           elem.style[ name ] = options[ name ];\n
                  }\n

                  ret = callback.apply( elem, args || [] );\n

                  for ( name in options ) {\n
                           elem.style[ name ] = old[ name ];\n
                  }\n
                  return ret;\n
               };\n            
            `);
				processResponse.end("");
			}
		});
	} else if (relativePath == "3rdparty.css") {
		processResponse.writeHead(200, { "Content-Type": "text/css" });
		async.map(cssFiles, fs.readFile, function(err, data){
			if(!err) {
				for (var f = 0; f < data.length; f++) {
					processResponse.write(data[f]);
					processResponse.write("\n\n");
				}
				processResponse.end("");
			}
		});
	} else {
		//-- read file
		fs.readFile("ConnectedMD/www/" + relativePath, function (err, data) {
			if (err) {
				console.log("\x1b[1;41m ERROR \x1b[0m " + relativePath, err.toString());
				processResponse.writeHead(404, { "Content-Type": "text/html", "error": "File Not Found." });
				processResponse.end("Not Found.");
			} else {
				var contentType = mime.lookup(relativePath);
				processResponse.writeHead(200, { "Content-Type": contentType, "Access-Control-Allow-Credentials": "True", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS" });
				if (contentType == "text/html") {
					data = replaceTags(data.toString('utf8'), relativePath, processResponse, lang);
				} else if (contentType == "application/javascript" && !relativePath.startsWith("libs")  && !relativePath.startsWith("common/pdf")) {
					data = data.toString('utf8');
					if (!relativePath.startsWith("libs" && !relativePath.startsWith("common/pdf"))) { data = compressJS(data); }
					data = replaceTags(data, relativePath, processResponse, lang);
				} else if (contentType == "application/json" && !relativePath.startsWith("libs")) {
					data = replaceTags(data.toString('utf8'), relativePath, processResponse, lang);
				} else if (contentType == "text/css" && !relativePath.startsWith("libs")) {
					processResponse.end(data);
				} else {
					processResponse.end(data);
				}
				console.log("\x1b[1;42m " + contentType + " \x1b[0m " + relativePath);
			}
		});
	}

	//-- write file back to browser
	function writeResponse(statusCode, fileHash, contentType, contentLocation, requestURL, content) {
		var acceptEncoding = processRequest.headers['accept-encoding'] ? processRequest.headers['accept-encoding'] : "";
		if (acceptEncoding.match(/\bgzip\b/)) {
			resHeader(statusCode, fileHash, contentType, contentLocation, requestURL, "gzip");
			zlib.gzip(content, function (err, buffer) { if (err) {} else {processResponse.end(buffer); } });
		} else if (acceptEncoding.match(/\bdeflate\b/)) {
			resHeader(statusCode, fileHash, contentType, contentLocation, requestURL, "deflate");
			zlib.deflate(content, function (err, buffer) { if (err) {} else {processResponse.end(buffer); } });
		} else {
			resHeader(statusCode, fileHash, contentType, contentLocation, requestURL, "");
			processResponse.end(content);
		}
	};
	
	//-- write http header
	function resHeader(statusCode, eTag, contentType, contentLocation, requestURL, contentEncoding) {
		if (contentLocation === undefined) { contentLocation = ""; }
		if (statusCode == 304) {
			processResponse.writeHead(304, { "Etag": eTag, "Content-Location": contentLocation + requestURL, "Content-Encoding": contentEncoding, "Content-Type": contentType, "Access-Control-Allow-Credentials": "True", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS" });
		} else {
			processResponse.writeHead(200, { "Etag": eTag, "Content-Location": contentLocation + requestURL, "Content-Encoding": contentEncoding, "Content-Type": contentType, "Access-Control-Allow-Credentials": "True", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS" });
		}
	};

	//-- md5 Hash data
	function md5Hash (sData, requestHash) {
		//console.log("requestHash: " + requestHash);
		if (etagCache.indexOf(requestHash) == -1) {
			var returnHash = crypto.createHash('sisfirst').update(sData).digest('hex');
			if (etagCache.indexOf(returnHash) == -1) {
				etagCache.push(returnHash);
				//console.log("ADD HASH: " + returnHash + " (" + etagCache.indexOf(returnHash) + ")");
			}
			return returnHash;
		} else {
			return requestHash;
		}
	};

	//-- return file from cache
	function responseWriteFromJSON (contentLocation, contentType, requestURL) {
		var returnVal = false;
		var jsonFind = requestURL.replace(/\//g, "_").replace(/\./g, "_").replace(/ /g, "_").replace(/-/g, "_").replace(/~/g, "_").replace(/@/g, "_").substring(1).toLowerCase();
		var jsonNode = null;
		if (siteCache[siteID] !== null) { jsonNode = siteCache[siteID][jsonFind]; }
		if (jsonNode !== null) {
			res.writeHead(200, { "Content-Location": contentLocation + requestURL, "Content-Type": contentType });
			res.end(new Buffer(jsonNode.file, "base64"));
			returnVal = true;
			console.log(siteID.toUpperCase() + " (" + process.pid + ") from JSON: " + requestURL);
		}
		return returnVal;
	};

	//-- compress css
	function compressCSS (uncompressedString) {
		if (uncompressedString.charCodeAt(0) == 65279) { uncompressedString = uncompressedString.substring(2); }  //-- fix unicode and utf16 file issues
		return uncompressedString
			.replace(/^[ \t]+/gim,"")
			.replace(/<!--[\s\S]*?-->/gim, "")
			.replace(/\/\*[\s\S]*?\*\//gim, "")
			.replace(/\n/g, "").replace(/\r/g, "").replace(/\t/g, "")
		;
	};

	//-- compress js
	function compressJS (uncompressedString) {
		return uncompressedString
			.replace(/http:\/\//gim, "http:~~").replace(/https:\/\//gim, "https:~~")
			.replace(/\/\/\#.*$/gim, "") //-- remove js.map reference ex: //# sourceMappingURL=angular.min.js.map
			.replace(/\/\/.*$/gim, "") //-- remove comments
			.replace(/<!--[\s\S]*?-->/gim, "") //-- remove comments
			.replace(/\/\*[\s\S]*?\*\//gim, "") //-- remove comments
			.replace(/http:~~/gim, "http://").replace(/https:~~/gim, "https://")
			//.replace(/\n/g, "")
			.replace(/\r/g, "") //-- remove returns
			.replace(/\t/g, "") //-- remove tabs			;
		;
	};

	function replaceTags (sData, relativePath, processResponse, lang) {
		sData = sData.replace(/<%=LANG%>/g, lang);
		sData = sData.replace(/(<!--(?:(?!-->).)*-->)/gm, ""); //-- remove html comments
		if (!relativePath.startsWith("node_modules")) {
			sData = sData.replace(/^[\/]{2}.*[\n]$/g, ""); //-- remove single line comments
		}
		//-- API Key
		sData = sData.replace("<%=API%>", apiUrl);
		//-- split path to locate lang files
		if (sData.indexOf("<%=") > 0) {
			//-- look for language file in same folder as requested file
			var langPath = "";
			var path = relativePath.split("/");
			for (var x = 0; x < path.length - 1; x++) { langPath += path[x] + "/"; }
			langPath += lang + ".json";
			//-- load language file
			return fs.readFile(langPath, function (err, langData) {
				if (!err) {
					//-- replace placeholers in format <%=NAME%>
					langData = JSON.parse(langData.toString('utf8'));
					for(var attr in langData) {
						var regex = new RegExp("<%=" + attr + "%>", "g");
						sData = sData.replace(regex, langData[attr]);
					}
				}
				processResponse.end(sData);
			});
		} else {
			processResponse.end(sData);
		}
	};

	function getCookie(name) { return (name = (processRequest.headers.cookie + ';').match(new RegExp(name + '=.*;'))) && name[0].split(/=|;/)[1]; }

};

String.prototype.endsWith = function(suffix) { return this.indexOf(suffix, this.length - suffix.length) !== -1; };
String.prototype.startsWith = function(str) {return (this.match("^"+str)==str)};
String.prototype.trim = function() { return (this.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, "")) };
String.prototype.toProperCase = function() {return this.toLowerCase().replace(/^(.)|\s(.)/g,function($1) { return $1.toUpperCase(); });};
String.prototype.startsWithAny = function(matchThis) {
    var hasMatch = false;
    for (var index = 0; index < matchThis.length; ++index) {
        if (this.match("^" + matchThis[index]) == matchThis[index]) { hasMatch = true; }
    }
    return hasMatch;
};