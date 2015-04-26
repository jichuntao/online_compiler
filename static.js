
var sys = require('sys'),
	http = require('http'),
	url = require('url'),
	path = require('path'),
	fs = require('fs');

function exe(req,res,rf,data)
{
    var filename = rf.pathname;
	fs.exists(filename, function(exists) {  
		if(!exists) {  
			res.writeHead(404, { "Content-Type": "text/plain" });  
		    res.write("404 Not Found\n");  
		    res.end();  
		    return;  
		}  
		fs.readFile(filename, "binary", function(err, file) {  
			if(err) {  
				res.writeHead(500, { "Content-Type": "text/plain" });  
				res.write(err + "\n");  
				res.end();  
				return;  
			}
			var contentType='text/html';
			if(Filetypes[rf.extname]){
				contentType=Filetypes[rf.extname];
			}
			res.writeHead(200, { 'Content-Type': contentType , 'Content-Length':file.length});  
			res.write(file, "binary");  
			res.end();  
		});  
	});  
}
var Filetypes = {
   ".css": "text/css",
   ".gif": "image/gif",
   ".html": "text/html",
   ".ico": "image/x-icon",
   ".jpeg": "image/jpeg",
   ".jpg": "image/jpeg",
   ".js": "text/javascript",
   ".json": "application/json",
   ".pdf": "application/pdf",
   ".png": "image/png",
   ".txt": "text/plain",
   ".xml": "text/xml",
   ".swf": "application/x-shockwave-flash",
   ".wav": "audio/x-wav",
   ".wma": "audio/x-ms-wma",
   ".wmv": "video/x-ms-wmv",
   ".svg": "image/svg+xml",
   ".hex": "application/octet-stream"
};
exports.exe=exe;
