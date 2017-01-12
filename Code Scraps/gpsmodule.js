var gps = function() {

	var net = require('net');
	var nmea = require('node-nmea');
	IP_C = '192.168.2.22';
	PORT_C = '6000';

	var client = new net.Socket();
	var buf = new Buffer(Math.pow(2,16));

	var exportedValues = {
	lat: 0,
	lat_dir: "Z",
	long: 0,
	long_dir: "Z"
	};

	module.exports = exportedValues;

	console.log(exportedValues);

	client.connect(PORT_C, IP_C, function() {
		console.log('GPS Connection Established');

		setInterval(function(){
		console.log("Heartbeat");
		},2000);
	});

	client.on('data',function(imp) {
		var data = imp.toString('utf8');
		data = data.split('\r\n');
			
		for (let i in data)
		{
			if (data[i].includes('$GPRMC'))
			{
				var RMCA = data[i].split('$');
				var internal_values = RMCA[1].split(',');

				if (internal_values[3] === " ")
				{
				}
				else
				{
					console.log("lat: " + internal_values[3]+internal_values[4]);
					exportedValues.lat = internal_values[3];
					exportedValues.lat_dir = internal_values[4];

					console.log("long: " + internal_values[5]+internal_values[6]);
					exportedValues.long = internal_values[5];
					exportedValues.long_dir = internal_values[6];
				}
			}
		}
	});
}();
