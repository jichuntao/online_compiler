
function class1()
{
	this.fun1=function (){
		console.log('class1 fun1');
		fun4();
	}
	this.fun2=function(){
		console.log('class1 fun2');
	}
	var fun3 =function(){
		console.log('class1 fun3');
	};
	function fun4()
	{
		console.log('class1 fun4');
	}
}
var ss = new class1();
ss.fun1();