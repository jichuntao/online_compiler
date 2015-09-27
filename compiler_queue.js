var exec = require('child_process').exec;
var fs = require('fs');
var events = require('events');
var config = require('./config.json');
var emitter = new events.EventEmitter();
var make_child;
var queue=[];
var busy = false;
var makeData;

//const
var keymapDic = config.keymapDic;
var configDic = config.configDic;
var hexDic = config.hexDic;
var binDic = config.binDic;

//register events
emitter.on('start_exec', start_exec);
emitter.on('end_exec', end_exec);
emitter.on('callback', callback);

function push_queue(data,cb)
{
	data.cb=cb;
	queue.push(data);
	process.nextTick(tick);
}

function tick()
{
	if(busy || queue.length==0){
		return;
	}
	busy = true;
	makeData = queue.shift();
	emitter.emit('start_exec');
}

// core events
function start_exec()
{
	var key = makeData.key;
	var type= makeData.type;
	var exec_commad='make -f Makefile.'+type+' ';
	exec_commad +='KEYMAP='+keymapDic+key+'.c ';
	//exec_commad +='CONF='+configDic+key+'.h ';
	exec_commad +='HEXFILE='+hexDic+key+'.hex ';
	exec_commad +='BINFILE='+binDic+key+'.bin';
	make_child = exec(exec_commad,function (err, stdout, stderr) {
   		emitter.emit('end_exec',key, err, stdout)
	});
}

function end_exec(key,err,stdout)
{
	var ret = {};
	if(err){
		ret.status = 'error';
		ret.msg = err.toString();
	}else if(get_last_line(stdout)=='--------end'){
		ret.status = 'success';
		ret.path = key;
	}else{
		ret.status = 'error';
		ret.msg = stdout;
	}

	emitter.emit('callback', ret);
}

function callback(ret)
{
	if(ret.status=='success'){
		ret.path += '.'+makeData.filetype;
	}
	busy = false;
	var cb = makeData.cb;
	cb(ret);
	makeData= null;
	process.nextTick(tick);
}

//utils
function get_last_line(strs)
{
	var strArr = strs.split('\n');
	return strArr[strArr.length-2];
}


exports.push_queue=push_queue;