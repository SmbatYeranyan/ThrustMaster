# ThrustMaster
Human Interface Driver to control ThrustMaster JoyStick series using NodeJS on a RaspberryPi / Linux.

Simple inilialization:
```javascript
var tM = require('./lib/thrustLib');

tM.thrustMaster().init({
	finalControls:function(data){
		console.log("Any button press",data);
	},
	button5: function(data){
		console.log("button5");

	}

});
```

Currently supporting the following inputs:
```javascript
[
  "finalControls",
	"r1",
	"l1",
	"l3",
	"button5",
	"button6",
	"button7",
	"button8",
	"r2",
	"l2",
]
```

