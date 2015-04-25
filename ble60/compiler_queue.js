var exec = require('child_process').exec;
var fs = require('fs');
var events = require('events');
var emitter = new events.EventEmitter();
var make_child;
var queue=[];
var result={};
var busy = false;
var 

//const
var keymapDic = './keymap/keymap_';
var configDic = './keymap/config_';
var hexDic = './static_file/';

//register events
emitter.on('start_exec', start_exec);
emitter.on('end_exec', end_exec);
emitter.on('exec_success', exec_success);
emitter.on('exec_failed', exec_failed);

function push_queue(data)
{
	queue.push(data);
	setTimeout(tick,0);
}

function tick()
{
	if(busy || queue.length==0){
		return;
	}
	var key = queue.shift();
	busy = true;		
	emitter.emit('start_exec', key);
}

// core events
function start_exec(key)
{
	var exec_commad='make -f Makefile_epbt ';
	exec_commad +='KEYMAP='+keymapDic+key+'.c ';
	exec_commad +='CONF='+configDic+key+'.h ';
	exec_commad +='HEXFILE='+hexDic+key+'.hex';
	make_child = exec(exec_commad,function (err, stdout, stderr) {
   		emitter.emit('end_exec', key, err, stdout)
	});
}

function end_exec(key,err,stdout)
{
	var ret = {};
	if(err){
		ret.type = 'failed';
		ret.result = err.toString();
	}else if(get_last_line(stdout)=='--------end'){
		ret.type = 'success';
		ret.result = '';
	}else{
		ret.type = 'failed';
		ret.result = stdout;
	}

	result[key] = ret;

	if(ret.type == 'failed'){
		emitter.emit('exec_failed', key , ret);
	}else{
		emitter.emit('exec_success', key);
	}
}

function exec_success(key)
{
	busy = false;
	console.log(0);
	setTimeout(tick,0);
}

function exec_failed(key,obj)
{
	writeLog(key ,obj);
	busy = false;
	setTimeout(tick,0);
}

//utils
function get_last_line(strs)
{
	var strArr = strs.split('\n');
	return strArr[strArr.length-2];
}

function writeLog(key , obj)
{
	fs.appendFile('./log/'+key+'.log', JSON.stringify(obj), function (err) {});
}

exports.push_queue=push_queue;