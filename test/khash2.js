var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('keymap.db',function() {
  db.serialize(function() {
      db.all("select * from keymaps where key = 'default'",function(err,res){
        if(!err)
          console.log(res[0].keymap);
        else
          console.log(err);
      });
    });
});
