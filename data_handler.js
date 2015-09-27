var fs = require('fs');
var config = require('./config.json');
var keyboardToType = config.keyboardToType;
var keymapDic = config.keymapDic;
var configDic = config.configDic;
var dataLen = config.dataLen;
var filetypes = config.filetypes;

function handle(data)
{
	var ret={};
	var json;
	try{
		json=JSON.parse(data);
	}
	catch(e){
		ret.status='error';
		ret.msg='JSON error:'+e;
		return ret;
	}
	if(json.length != dataLen){
		ret.status='error';
		ret.msg='data length error';
		return ret;
	}
	var keyboardType = json[2];
	if(!keyboardToType[keyboardType]){
		ret.status='error';
		ret.msg='keyboard type error';
		return ret;
	}
	var filetype = json[4];
	if(!filetypes[filetype]){
		filetype = 'hex';
	}

	ret.status='ok';
	ret.key = MD5(data);
	ret.jsonData=json;
	ret.keyboardType=keyboardType;
	ret.type = keyboardToType[keyboardType];
	ret.filetype = filetype;
	return ret;
}

function MD5(strs) {
    var crypto = require('crypto');
    var md5 = crypto.createHash('md5');
    md5.update(strs);
    var result = md5.digest('hex');
    return result.toUpperCase();
}

exports.handle=handle;