var tM = require('./lib/thrustLib');

tM.thrustMaster().init({
	finalControls:function(data){
		console.log("Any button press",data);
	},
	button5: function(data){
		console.log("button5");

	},	
	dial: function(data){
		console.log("dial", data);

	}

});
