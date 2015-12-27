var sqlite3 = require('sqlite3').verbose();
var databaseFile='../keymap.db';
var db = new sqlite3.Database(databaseFile);
var defaultKeymap=[[],[[[["KC_ESC"],["KC_F1"],["KC_F2"],["KC_F3"],["KC_F4"],["KC_F5"]],[["KC_GRV"],["KC_1"],["KC_2"],["KC_3"],["KC_4"],["KC_5"],["KC_6"],["KC_7"],["KC_8"],["KC_9"],["KC_0"],["KC_MINS"],["KC_EQL"],["KC_BSPC"],["KC_INS"]],[["KC_TAB"],["KC_Q"],["KC_W"],["KC_E"],["KC_R"],["KC_T"],["KC_Y"],["KC_U"],["KC_I"],["KC_O"],["KC_P"],["KC_LBRC"],["KC_RBRC"],["KC_BSLS"],["KC_DEL"]],[["KC_CAPS"],["KC_A"],["KC_S"],["KC_D"],["KC_F"],["KC_G"],["KC_H"],["KC_J"],["KC_K"],["KC_L"],["KC_SCLN"],["KC_QUOT"],["KC_ENT"]],[["KC_LSFT"],["KC_Z"],["KC_X"],["KC_C"],["KC_V"],["KC_B"],["KC_N"],["KC_M"],["KC_COMM"],["KC_DOT"],["KC_SLSH"],["KC_RSFT"],["KC_UP"]],[["KC_LCTRL"],["KC_LGUI"],["KC_LALT"],["KC_SPC"],["KC_RALT"],["KC_FN",[1,[1]]],["KC_RCTRL"],["KC_DOWN"],["KC_RGHT"],["KC_RGHT"]]],[[["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"]],[["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"]],[["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"]],[["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"]],[["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"]],[["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"],["KC_TRNS"]]]],"diyso72","1.2","bin"];
//console.log(JSON.stringify(defaultKeymap));
db.serialize(function() {
  db.run("delete from keymaps where key='diyso72'");
  db.run("insert into keymaps values('diyso72','diyso72','"+JSON.stringify(defaultKeymap)+"')");

});

db.close();