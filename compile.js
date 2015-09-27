var fs = require('fs');
var compiler_queue = require('./compiler_queue.js');
var datahandler = require('./data_handler.js');
var config = require('./config.json');
var events = require('events');
var emitter = new events.EventEmitter();
var keymapDic = config.keymapDic;
var configDic = config.configDic;

//register events
emitter.on('create_keymap_file', createKeymapFile);
emitter.on('push_compiler_queue', pushCompilerQueue);

//web server call
function exe(req, res, rf, data) 
{
	var ret={};

	//check data md5 keyboard_type gzip
	var dataRet = datahandler.handle(data);
	dataRet.ip = getClientIp(req);
	if(dataRet.status=='error'){
		ret.status='error';
		ret.msg=dataRet.msg;
		ret.ip=dataRet.ip;
		return returnErrResult(res,ret);
	}
	
	emitter.emit('create_keymap_file', res ,dataRet);
}

function createKeymapFile(res,dataRet)
{
	var ret = {};
	var keymapFile = keymapDic + dataRet.key +'.c';

	//check keymap.c file cache
	fs.exists(keymapFile, function (exists) {
		if(!exists || true){
			//create and write ketmap.c file
			var kbt=require('./'+dataRet.type+'/create_keymap.js');
			var kbtRet=kbt.create_keymap_file( dataRet.jsonData);
			if(kbtRet.status=='error'){
				ret.status='error';
				ret.msg=kbtRet.msg;
				ret.ip=dataRet.ip;
				return returnErrResult(res,ret);
			}
			fs.writeFile(keymapFile,kbtRet.keymap_Data,function(err){
				if(err){
					ret.status=='error';
					ret.msg=err;
					ret.ip=dataRet.ip;
					return returnErrResult(res,ret);
				}
				emitter.emit('push_compiler_queue',res ,dataRet);
			});
		}
		else{
			emitter.emit('push_compiler_queue', res ,dataRet);
		}
	});
}

function pushCompilerQueue(res,dataRet)
{
	var obj={};
	obj.key = dataRet.key;
	obj.keyboardType = dataRet.keyboardType;
	obj.type = dataRet.type;
	obj.filetype = dataRet.filetype;
	compiler_queue.push_queue(obj,function(ret){
		if(ret.status=='error'){
			ret.ip = dataRet.ip;
			returnErrResult(res,ret);
		}
		returnResult(res,ret,dataRet);
	});
}

function returnResult(res,ret,dataRet)
{
	var str='';
	str+=getNowTime()+'-'+dataRet.ip+'-'+ret.path;
	str+='\n\n';
	fs.appendFileSync('./log/compile.log',str,'utf8');
	res.end(JSON.stringify(ret));
}

function returnErrResult(res,ret)
{
	var str='';
	str+=getNowTime()+'-'+ret.ip+'-'+JSON.stringify(ret.msg);
	str+='\n\n';
	fs.appendFileSync('./log/error.log',str,'utf8');
	res.end(JSON.stringify(ret));
}

function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
}

function getNowTime(){
	return new Date().getTime();
}

exports.exe=exe;