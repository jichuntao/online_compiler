
function exe(req,res,rf,data)
{
	var key=rf.query.key;
	console.log(key);
	var ret='[[0,0,0,0,0],[[[["KC_ESC"],["KC_1"],["KC_2"],["KC_3"],["KC_4"],["KC_5"],["KC_6"],["KC_7"],["KC_8"],["KC_9"],["KC_0"],["KC_MINS"],["KC_EQL"],["KC_BSPC"]],[["KC_TAB"],["KC_Q"],["KC_W"],["KC_E"],["KC_R"],["KC_T"],["KC_Y"],["KC_U"],["KC_I"],["KC_O"],["KC_P"],["KC_LBRC"],["KC_RBRC"],["KC_BSLS"]],[["KC_CAPS"],["KC_A"],["KC_S"],["KC_D"],["KC_F"],["KC_G"],["KC_H"],["KC_J"],["KC_K"],["KC_L"],["KC_SCLN"],["KC_QUOT"],["KC_ENT"]],[["KC_LSFT"],["KC_Z"],["KC_X"],["KC_C"],["KC_V"],["KC_B"],["KC_N"],["KC_M"],["KC_COMM"],["KC_DOT"],["KC_SLSH"],["KC_RSFT"]],[["KC_LCTRL"],["KC_LGUI"],["KC_LALT"],["KC_SPC"],["KC_RALT"],["KC_RGUI"],["KC_FN",[1,[1]]],["KC_RCTRL"]]],[[["KC_GRV"],["KC_F1"],["KC_F2"],["KC_F3"],["KC_F4"],["KC_F5"],["KC_F6"],["KC_F7"],["KC_F8"],["KC_F9"],["KC_F10"],["KC_F11"],["KC_F12"],["KC_DEL"]],[[""],[""],["KC_UP"],[""],[""],[""],["KC_CALC"],[""],["KC_INS"],[""],["KC_PSCR"],["KC_SLCK"],["KC_PAUS"],[""]],[[""],["KC_LEFT"],["KC_DOWN"],["KC_RGHT"],[""],[""],[""],[""],[""],[""],["KC_HOME"],["KC_PGUP"],[""]],[[""],[""],["KC_APP"],["KC_LED_IN"],["KC_LED_TOGGLE"],["KC_LED_DE"],["KC_VOLD"],["KC_VOLU"],["KC_MUTE"],["KC_END"],["KC_PGDN"],[""]],[[""],[""],[""],["KC_FN",[2,[2,1]]],[""],[""],[""],[""]]],[[[""],[""],[""],[""],[""],[""],[""],["KC_P7"],["KC_P8"],["KC_P9"],[""],["KC_PMNS"],[""],[""]],[[""],[""],[""],[""],[""],[""],[""],["KC_P4"],["KC_P5"],["KC_P6"],[""],["KC_PENT"],[""],[""]],[[""],[""],[""],[""],[""],[""],[""],["KC_P1"],["KC_P2"],["KC_P3"],["KC_PPLS"],["KC_PAST"],[""]],[[""],[""],[""],[""],[""],[""],[""],["KC_P0"],["KC_PCMM"],["KC_PDOT"],["KC_PSLS"],[""]],[[""],[""],[""],["KC_FN",[3,[2,1]]],[""],[""],[""],[""]]]],"epbt60","1.2"]';
	res.writeHead(200);  
	res.write(ret);  
	res.end(); 
}

exports.exe=exe;
