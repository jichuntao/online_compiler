var fs = require('fs');
var compiler_queue = require('./compiler_queue.js');
var datahandler = require('./data_handler.js');
var config = require('./config.json');
var events = require('events');
var emitter = new events.EventEmitter();
var keyboardArr = config.keyboardArr;
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
	if(dataRet.status=='error'){
		ret.status='error';
		ret.msg=dataRet.msg;
		return returnResult(res,ret);
	}
	
	emitter.emit('create_keymap_file', res ,dataRet);
}

function createKeymapFile(res,dataRet)
{
	var ret = {};
	var keymapFile = keymapDic + dataRet.key +'.c';

	//check keymap.c file cache
	fs.exists(keymapFile, function (exists) {
		if(!exists){
			//create and write ketmap.c file
			var kbt=require('./'+dataRet.keyboardType+'/create_keymap.js');
			var kbtRet=kbt.create_keymap_file( dataRet.jsonData);
			if(kbtRet.status=='error'){
				ret.status='error';
				ret.msg=kbtRet.msg;
				return returnResult(res,ret);
			}
			fs.writeFile(keymapFile,kbtRet.keymap_Data,function(err){
				if(err){
					ret.status=='error';
					ret.msg=err;
					return returnResult(res,ret);
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
	compiler_queue.push_queue(obj,function(ret){
		if(ret.status=='error'){
			//todo log
			fs.writeFile('err.log',JSON.stringify(ret),function (err) {
			});
		}
		//res.statusCode = 302;
		//res.setHeader("Location", "/"+ret.path);
		//res.end();
		res.end(JSON.stringify(ret));
	});
}

function returnResult(res,ret)
{
	res.end(JSON.stringify(ret));
}

exports.exe=exe;