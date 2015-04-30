var sqlite3 = require('sqlite3').verbose();
var databaseFile='keymap.db';
var datahandler = require('./data_handler.js');
var db;

function exe(req,res,rf,data)
{
  var ret={};
  var action;
  if(rf.query.action){
    action = rf.query.action;
    if(action=='get')
    {
      var key=rf.query.khash;
      if(!key){
          ret.status='error';
          ret.msg='khash not null';
          return returnResult(res,ret);
      }
      getKeymapBykhash(key,function(err,data){
        if(err){
          ret.status='error';
          ret.msg=err;
        }else{
          ret.status='success';
          ret.khash=data.key;
          ret.keymap=data.keymap;
        }
        return returnResult(res,ret);
      });
    }
    else if(action=='set')
    {
      var dataRet = datahandler.handle(data);
      if(dataRet.status=='error'){
        ret.status='error';
        ret.msg=dataRet.msg;
        return returnResult(res,ret);
      }
      setKeymap(dataRet,function(err){
        if(err){
          console.log(err);
        }
      });
      ret.status='success';
      ret.khash=dataRet.key;
      return returnResult(res,ret);
    }
    else{
      ret.status='error';
      ret.msg='args error';
      return returnResult(res,ret);
    }
  }
  else{
    ret.status='error';
    ret.msg='args error';
    return returnResult(res,ret);
  }
}

openDatabase();

function returnResult(res,ret)
{
  res.end(JSON.stringify(ret));
}

function openDatabase()
{
  db = new sqlite3.Database(databaseFile); 
  db.once('close',onDbCloseFun);
}

function onDbCloseFun()
{
  openDatabase();
}

function setKeymap(obj,cb)
{
  try{
    var sql="insert into keymaps values('"+obj.key+"','"+obj.keyboardType+"','"+JSON.stringify(obj.jsonData)+"')";
    db.serialize(function() {
      db.run(sql,function(err){
          if(err){
            return cb(err.toString());
          }
          return cb(null);
        });
    });
  }catch(e){
    return cb(e.toString());
  }
}

function getKeymapBykhash(khash,cb)
{
  if(checkInput(khash)){
    return cb('illegal character',null);
  }
  try{
    var sql="select * from keymaps where key = '"+khash+"'";
    db.serialize(function() {
      db.all(sql,function(err,res){
          if(err){
            return cb(err.toString(),null);
          }
          if(res.length>0){
            return cb(null,res[0]);
          }
          else{
            return cb('Not found keymap',null);
          }
        });
    });
  }
  catch(e){
    return cb(e.toString(),null);
  }
}

function checkInput(str) {
  var pattern = /^[\w\u4e00-\u9fa5]+$/gi;
  if(pattern.test(str))
  {
      return false;
  }
  return true;
}


exports.exe=exe;
