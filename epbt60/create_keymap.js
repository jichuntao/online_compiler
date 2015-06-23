var fs = require('fs');
var Config = require('./config.json');
var FnType = require('./fntype.json');
var numToStr=['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G'];
var row=Config.row;
var col=Config.col;
var kbType='EPBT60';

function create_keymap_file(data)
{
	var ret={};
	var keymap_Data='';
	var i,j,k;
	var layout=data[0];
	var layers=data[1];
	var fnArr=[];
	var matrix=handle_matrix(layout);
	if(checkError(matrix,layers)){
		ret.status='error';
		ret.msg='checkerror';
		return ret;
	}
	try
	{
		keymap_Data += '// Generated by Online_Complier\n';
		keymap_Data += '#include "../tmk_keyboard/keyboard/ble60/keymap_common.h"\n\n';
		keymap_Data += keymap_common(matrix);
		keymap_Data += keymap_layer(matrix,layers,fnArr);
		keymap_Data += keymap_speicalKey();
		keymap_Data += handleFunction(fnArr);
	}
	
	catch(e){
		ret.status='error';
		ret.msg='checkerror';
		return ret;
	}
	ret.keymap_Data=keymap_Data;
	return ret;
}

function handleFunction(fnArr)
{
	var ret='const uint16_t fn_actions[] PROGMEM = {\n\n';
	var fnOutArr=[];
	var on=['ON_PRESS','ON_RELEASE','ON_BOTH'];
	var mod=function(a1,a2,a3,a4){
		var mretArr=[];
		if(a1){
			mretArr.push('MOD_LCTL');
		}
		if(a2){
			mretArr.push('MOD_LSFT');
		}
		if(a3){
			mretArr.push('MOD_LALT');
		}
		if(a4){
			mretArr.push('MOD_LGUI');
		}
		return mretArr.join(' | ');
	};
	var i=0;
	for(i=0;i<fnArr.length;i++){
		var fn=fnArr[i];
		fnOutArr[i]={};
		if(typeof(fn)=='string'){
			fnOutArr[i].action=FnType.fntype_sp[fn].action;
			fnOutArr[i].args=cloneObj(FnType.fntype_sp[fn].args);
		}
		else if(typeof(fn)=='object'){
			var fncfg=FnType.fntype[fn[0]];
			var fndata=fn[1];
			fnOutArr[i].action=fncfg.action;
			fnOutArr[i].args=[];
			if(fncfg.type==0){
				fnOutArr[i].args=['KC_NO'];
			}
			else if(fncfg.type==1){
				fnOutArr[i].args[0]=fndata[0];
			}
			else if(fncfg.type==2){
				fnOutArr[i].args[0]=fndata[0]?fndata[0]:0;
				fnOutArr[i].args[1]=fndata[1]?on[fndata[1]]:on[1];
			}
			else if(fncfg.type==3){
				fnOutArr[i].args[0]=fndata[0]?fndata[0]:0;
				fnOutArr[i].args[1]=fndata[1]?fndata[1]:'KC_NO';
			}
			else if(fncfg.type==4){
				fnOutArr[i].args[0]=mod(fndata[0],fndata[1],fndata[2],fndata[3]);
			}
			else if(fncfg.type==5){
				fnOutArr[i].args[0]=mod(fndata[0],fndata[1],fndata[2],fndata[3]);
				fnOutArr[i].args[1]=fndata[4]?fndata[4]:'KC_NO';
			}
			else if(fncfg.type==6){
				fnOutArr[i].args[0]=on[fndata[0]];
			}
		}
		else{
			fnOutArr[i].action='ACTION_NO';
			fnOutArr[i].args=[];
		}
	}
	for(i=0;i<fnOutArr.length;i++){
		ret+=tableStr(4)+'['+i+'] = '+fnOutArr[i].action+'('+fnOutArr[i].args.join(' , ')+'),\n';
	}

	ret+='\n};\n';
	return ret;
}

function keymap_speicalKey()
{
	var ret='/* id for user defined function */\n';
	ret+='enum function_id {\n    SHIFT_ESC,\n};\n\n';
	ret+='#define MODS_CTRL_MASK  (MOD_BIT(KC_LSHIFT)|MOD_BIT(KC_RSHIFT))\n';
	ret+='void action_function(keyrecord_t *record, uint8_t id, uint8_t opt)\n{\n';
	ret+=tableStr(4)+'static uint8_t shift_esc_shift_mask;\n\n';
	ret+=tableStr(4)+'switch (id) {\n';
	ret+=tableStr(8)+'case SHIFT_ESC:\n';
	ret+=tableStr(12)+'shift_esc_shift_mask = get_mods()&MODS_CTRL_MASK;\n';
	ret+=tableStr(12)+'if (record->event.pressed) {\n';
	ret+=tableStr(16)+'if (shift_esc_shift_mask) {\n';
    ret+=tableStr(20)+'add_key(KC_GRV);\n';  
    ret+=tableStr(16)+'} else {\n';  
    ret+=tableStr(20)+'add_key(KC_ESC);\n';  
    ret+=tableStr(16)+'}\n';  
    ret+=tableStr(12)+'} else {\n';  
    ret+=tableStr(14)+'if (shift_esc_shift_mask) {\n';  
    ret+=tableStr(20)+'del_key(KC_GRV);\n';  
    ret+=tableStr(16)+'} else {\n';  
    ret+=tableStr(20)+'del_key(KC_ESC);\n'; 
    ret+=tableStr(16)+'}\n'; 
    ret+=tableStr(12)+'}\n'; 
    ret+=tableStr(12)+'send_keyboard_report();\n'; 
    ret+=tableStr(12)+'break;\n'; 
    ret+=tableStr(4)+'}\n'; 
    ret+='}\n\n'; 
    return ret;
}

function handleKey(key,fnArr)
{

	var pkey;
	if(key[0]==''){
		pkey='TRNS';
	}
	else if(key[0]=='KC_FN'){
		pkey='FN'+pushFnData(key[1],fnArr);
	}
	else if(FnType.fntype_sp[key[0]]){
		pkey='FN'+pushFnData(key[0],fnArr);
	}
	else{
		pkey=getkey(key[0]);
	}
	return pkey;
}

function pushFnData(fnData,fnArr)
{
	var ret=-1;
	for(var i=0;i<fnArr.length;i++){
		var obj = fnArr[i];
		if(JSON.stringify(obj)==JSON.stringify(fnData)){
			ret=i;
			break;
		}
	}
	if(ret==-1){
		ret = fnArr.length;
		fnArr.push(fnData);
	}
	if(ret>=32){
		ret = 0;
	}
	return ret;
}
function keymap_layer(matrix,layers,fnArr)
{
	var ret='const uint8_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {\n\n';
	var rows;
	var mlayers=[];
	var layer;
	var i,j,k;
	var keymapCommonArr=[];
	var rows;
	for(i=0;i<row;i++){
		keymapCommonArr[i]=[];
		for(j=0;j<col;j++){
			keymapCommonArr[i][j]=null;
		}
	}

	for(i=0;i<layers.length;i++)
	{
		layer=cloneObj(keymapCommonArr);
		for(j=0;j<layers[i].length;j++)
		{
			rows=layers[i][j];
			for(k=0;k<rows.length;k++)
			{
				var key=rows[k];
				var cfg=matrix[j][k];
				layer[cfg.r][cfg.c]=handleKey(key,fnArr);
			}
		}
		mlayers.push(layer);
	}
	for(i=0;i<mlayers.length;i++){
		ret += tableStr(4)+'/* Layer:'+i+' */\n';
		ret += tableStr(4)+'KEYMAP_'+kbType+'( \n';
		layer=mlayers[i];	
		for(j=0;j<layer.length;j++){
			ret += tableStr(8);
			rows=layer[j];
			for(k=0;k<rows.length;k++){
				var keystr='';
				if(rows[k]){
					keystr=rows[k];
				}else{
					keystr='';
				}
				if(j==(layer.length-1) && k==(rows.length-1) || !rows[k]){
					keystr+=''
				}else{
					keystr+=',';
				}
				ret += tableStr(6,keystr);
			}
			ret += '\\\n';
		}
		ret+=tableStr(8)+'),\n\n';
	}
	ret+='};\n\n';
	return ret;
}
function keymap_common(matrix)
{
	var ret='';
	var i,j;
	var keymapCommonArr=[];
	var rows;
	for(i=0;i<row;i++){
		keymapCommonArr[i]=[];
		for(j=0;j<col;j++){
			keymapCommonArr[i][j]=null;
		}
	}
	for(i=0;i<matrix.length;i++){
		rows=matrix[i];
 		for(j=0;j<rows.length;j++){
 			var kps=rows[j];
			keymapCommonArr[kps.r][kps.c]='K'+kps.r+numToStr[kps.c];
		}
	}
	ret += '#define KEYMAP_'+kbType+'( \\\n';
	for(i=0;i<keymapCommonArr.length;i++){
		ret += tableStr(4);
		rows=keymapCommonArr[i];
		for(j=0;j<rows.length;j++){
			ret+=tableStr(5,(rows[j]?rows[j]:tableStr(4))+(((i==(keymapCommonArr.length-1) && j==(rows.length-1)||!rows[j]))?'':','));
		}
		ret += '\\\n';
	}
	ret += ') { \\\n';
	for(i=0;i<keymapCommonArr.length;i++){
		ret += tableStr(4)+'{ ';
		rows=keymapCommonArr[i];
		for(j=0;j<rows.length;j++){
			if(j==(rows.length-1)){
				ret+=tableStr(9,'KC_'+(rows[j]?'##'+rows[j]:'NO'));
			}else{
				ret+=tableStr(10,'KC_'+(rows[j]?'##'+rows[j]:'NO')+',');
			}
		}
		ret+=(i==(keymapCommonArr.length-1) && j==(rows.length))?'}  \\\n':'}, \\\n';
	}
	ret += '}\n\n';
	return ret;
}
function checkError(matrix,layers)
{
	var ret=false;
	var i,j,k;
	for(i=0;i<layers.length;i++)
	{
		var layer=layers[i];
		for(j=0;j<layer.length;j++)
		{
			var r=layer[j];
			if(r.length!=matrix[j].length){
				ret=true;
				break;
			}
		}
	}
	return ret;
}
function handle_matrix(layout)
{
	var matrix=[];
	var i,j,k;
	var config_matrix=Config.matrix;
	var rows;
	for(i=0;i<config_matrix.length;i++){
		rows=config_matrix[i];
		matrix[i]=[];
		for(j=0;j<rows.length;j++){
			var keycfg=rows[j];
			if(keycfg.m==0){
				matrix[i].push(keycfg);
			}else{
				var sps=keycfg.s[layout[keycfg.m-1]];
				for(k=0;k<sps.length;k++){
					sps[k].m=keycfg.m;
					matrix[i].push(sps[k]);
				}
			}
		}
	}
	return matrix;
}

function getkey(key)
{
	return key.replace('KC_','');
}

function cloneObj(obj)
{
	var temp1=JSON.stringify(obj);
	var temp2=JSON.parse(temp1);
	return temp2;
}

function tableStr(len,str)
{
	var ret=str?str:'';
	for(var i=ret.length;i<len;i++){
		ret+=' ';
	}
	return ret;
}


exports.create_keymap_file=create_keymap_file;


