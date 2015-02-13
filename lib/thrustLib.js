var HID = require('node-hid');
var events = require('events');
function thrustMaster(){
	events.EventEmitter.call(this);
	var self = this;

	var init = function(callback){
		var devices = HID.devices();
		var device;
		console.log("dasdas",devices);
		var boolBreak = false;
		devices.forEach(function(dev){
			if (!boolBreak){
				if (dev.productId ==45320){
					device = new HID.HID(dev.path);
					console.log(device);
					boolBreak= true;
				}

			}
		});
		device.on("data", function(data) {
			var thrust = Math.abs(data[7] - 255);
			var yaw = data[8];
			var redAlertButton = Math.abs(data[16]);
			var finalControls = {thrust:thrust, yaw: yaw}
			
				if (callback['finalControls']){
					callback['finalControls'](finalControls);
				}
				if (data[0]){
					switch(data[0]){
						case 1:
							if (callback['r1']){
								callback['r1'](finalControls);
							}
							break;					
						case 2: 
							if (callback['l1']){
								callback['l1'](finalControls);
								
							}
							break;	
						case 8:
							if (callback['l3']){
								callback['l3'](finalControls);
							}
							break;	
						case 16:
							if (callback['button5']){
								callback['button5'](finalControls);
							}
							break;					
						case 32:
							if (callback['button6']){
								callback['button6'](finalControls);
							}
							break;
						case 64:
							if (callback['button7']){
								callback['button7'](finalControls);
							}
							break;				
						case 128:
							if (callback['button8']){
								callback['button8'](finalControls);
							}
							break;
					}
				}	


				if (data[1]){
					switch(data[1]){
						case 241:
							if (callback['r2']){
								callback['r2'](finalControls);
							}
						break;					
						case 242:
							if (callback['l2']){
								callback['l2'](finalControls);
							}
							break;

					}
				}
				
		
		});

	};
	this.init = init;
}
thrustMaster.prototype.__proto__ = events.EventEmitter.prototype;

exports.thrustMaster = function(){
  return new thrustMaster();
}
