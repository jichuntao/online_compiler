var http = require('http');
var url = require('url');
var path = require('path');
var util = require('util');

var acc = 100;
http.createServer(function (req, res) {
    acc++;
    if (req.method == 'POST') {
        var postData = '';
        req.setEncoding('utf8');
        req.on('data', function (postDataChunk) {
            postData += postDataChunk;
        });
        req.on('end', function () {
            req.removeAllListeners();
            handler(req, res, postData);
            postData = '';
        });
    }
    else if (req.method == 'GET') {
        handler(req, res, '');
    }
}).listen(9128);


function handler(req, res, data) {
    var rf = restful(req.url);
    try {
        require('./' + rf.command).exe(req, res, rf, data);
        
    } catch (err) {
        console.log(err);
        res.writeHead(404);
        res.end();
    }
    
    return 0;
}
function restful(urlstr) {

    var ret = {};
    var urlObj = url.parse(urlstr, true);
    ret.pathname = urlObj.pathname;
    ret.query = urlObj.query;
    ret.pathname = path.normalize(ret.pathname);
    ret.pathname = (ret.pathname == '/') ? ret.pathname = '/index_diyso60.html' : ret.pathname;
    if (path.extname(ret.pathname) == '') {
        ret.command = path.basename(ret.pathname);
    } else {
        ret.command = 'static';
        ret.pathname = path.join('./static_file/', ret.pathname);
        ret.extname = path.extname(ret.pathname);
    }
    //console.log(ret);
    return ret;
}
console.log('Server running');