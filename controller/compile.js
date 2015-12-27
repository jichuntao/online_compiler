var express = require('express');
var router = express.Router();
var fs = require('fs');
var compiler_queue = require('./compiler_queue.js');
var datahandler = require('./data_handler.js');
var config = require('./config.json');
var events = require('events');
var create_keymap = require('./create_keymap.js');

var emitter = new events.EventEmitter();
var keymapDic = config.keymapDic;
//var configDic = config.configDic;

//register events
emitter.on('create_keymap_file', createKeymapFile);
emitter.on('push_compiler_queue', pushCompilerQueue);

router.post('/', function (req, res) {
    var ret = {};

    var dataRet = datahandler.handle(req.body.layout);
    dataRet.ip = req.ip;
    if (dataRet.status == 'error') {
        ret.status = 'error';
        ret.msg = dataRet.msg;
        ret.ip = dataRet.ip;
        return returnErrResult(res, ret);
    }

    emitter.emit('create_keymap_file', res, dataRet);

});


function createKeymapFile(res, dataRet) {
    var ret = {};
    var keymapFile = keymapDic + dataRet.key + '.c';

    //check keymap.c file cache
    fs.exists(keymapFile, function (exists) {
        if (!exists || true) {
            //create and write ketmap.c file
            var kbtRet = create_keymap.create(dataRet.jsonData, dataRet.type);
            if (kbtRet.status == 'error') {
                ret.status = 'error';
                ret.msg = kbtRet.msg;
                ret.ip = dataRet.ip;
                return returnErrResult(res, ret);
            }
            fs.writeFile(keymapFile, kbtRet.keymap_Data, function (err) {
                if (err) {
                    ret.status = 'error';
                    ret.msg = err;
                    ret.ip = dataRet.ip;
                    return returnErrResult(res, ret);
                }
                emitter.emit('push_compiler_queue', res, dataRet);
            });
        }
        else {
            emitter.emit('push_compiler_queue', res, dataRet);
        }
    });
}

function pushCompilerQueue(res, dataRet) {
    var obj = {};
    obj.key = dataRet.key;
    obj.keyboardType = dataRet.keyboardType;
    obj.type = dataRet.type;
    obj.filetype = dataRet.filetype;
    compiler_queue.push_queue(obj, function (ret) {
        if (ret.status == 'error') {
            ret.ip = dataRet.ip;
            returnErrResult(res, ret);
        }
        returnResult(res, ret, dataRet);
    });
}

function returnResult(res, ret, dataRet) {
    var str = '';
    str += getNowTime() + '-' + dataRet.ip + '-' + ret.path;
    str += '\n\n';
    fs.appendFileSync(config.logDic + 'compile.log', str, 'utf8');
    res.end(JSON.stringify(ret));
}

function returnErrResult(res, ret) {
    var str = '';
    str += getNowTime() + '-' + ret.ip + '-' + JSON.stringify(ret.msg);
    str += '\n\n';
    fs.appendFileSync(config.logDic + 'error.log', str, 'utf8');
    res.end(JSON.stringify(ret));
}

function getNowTime() {
    return new Date().getTime();
}

module.exports = router;
