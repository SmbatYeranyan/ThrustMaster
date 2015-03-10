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

			var zAxis = data[8]

			var xAxis = data[3]
			
			var yAxis = data[5]
			var trim = trimmers(trim, data);

			var rePack = calculateAxis(zAxis, yAxis, xAxis, data);
			zAxis = rePack.z;
			xAxis = rePack.x;
			yAxis = rePack.y;
			var finalControls = {thrust:thrust, zAxis: zAxis, xAxis: xAxis,yAxis: yAxis}
			if (trim !== 0){
				finalControls.trim = trim;				
			}

				
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

			if (data[2] !== 255){
				if (callback['dial']){
					callback['dial'](data[2]);
				}
			}
			
		
		});
		function trimmers(trim, data){
			trim = data[9];
			if (trim > 128){
				trim = Math.abs(( trim - 128 ));
			}else{
				if (trim < 128){
					trim = trim - 128;
				}
				
			}
			if (trim == 128){
				trim = 0;
			}
			return trim;

		}

		function calculateAxis(zAxis, yAxis, xAxis, data){
			zAxis = data[8]
			if (zAxis > 128){
				zAxis = Math.abs(( zAxis - 128 ));
			}else{
				if (zAxis < 128){
					zAxis = zAxis - 128;
				}
				
			}
			if (zAxis == 128){
				zAxis = 0;
			}


			xAxis = data[3]
			switch(data[4]){
				case 0:
					xAxis = -Math.abs((510 - xAxis)) 
				break;					
				case 1:
					xAxis = -Math.abs((255 - xAxis))
				break;					
				case 2:
					xAxis = Math.abs(xAxis) 
				break;					
				case 3:
					xAxis = Math.abs(xAxis + 255)
				break;
			}
		

			yAxis = data[5]
			switch(data[6]){
				case 0:
					yAxis = Math.abs((510 - yAxis)) 
				break;					
				case 1:
					yAxis = Math.abs((255 - yAxis))
				break;					
				case 2:
					yAxis = -Math.abs(yAxis) 
				break;					
				case 3:
					yAxis = -Math.abs(yAxis + 255)
				break;
			}
			return {y:yAxis, x:xAxis, z:zAxis};
		}

	};
	this.init = init;
}
thrustMaster.prototype.__proto__ = events.EventEmitter.prototype;

exports.thrustMaster = function(){
  return new thrustMaster();
}
