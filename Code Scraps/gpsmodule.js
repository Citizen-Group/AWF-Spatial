/**
 * GPS Module
 * Code for mobile sensing using the Share GPS APP.
 * This is development code. Not for production.
 *
 * Expected input is a NEMA String over TCP.
 *
 * To use this module, include it into a Node Project
 * using. var gps = require('gps');
 *
 * Dependancys:
 * - net: Encapsulation for socket connection to mobile
 * - node-nema: GPS nema code parser
 *
 * Update the config to
 */


var gps = function() {
    // REQUIRES
	var net = require('net');
	var nmea = require('node-nmea');

	// Global Objects
    var client = new net.Socket();

    // Configuration
    var config = {
        IP_C: '192.168.2.22',
        PORT_C: '6000',
        HEARTBEAT_INTERVAL: 2000
    };

    var exportedValues = {
        lat: 0,
        lat_dir: "Z",
        long: 0,
        long_dir: "Z"
	};
	module.exports = exportedValues;

	// Start of Module
    console.log('GPS Module Started');

    /**
     * Connect provides the initial connection. Then creates
     * a 2 second heartbeat to display in the node terminal.
     */
	client.connect(config.PORT_C, config.IP_C, function() {
		console.log('GPS Connection Established');
		setInterval(function(){
		console.log("Heartbeat");
		}, config.HEARTBEAT_INTERVAL);
	});

    /**
     * On Data responds to incoming data from the GPS Sensor
     * connection.
     */
	client.on('data', function(imcommingData) {

	    // Incomming data is a full NEMA string. Break up the data by line.
		var data = imcommingData.toString('utf8');
		data = data.split('\r\n');

		// For each line in the NEMA iterate.
		for (let i in data) {
		    // We only want the GPRMC String at the moment.
			if (data[i].includes('$GPRMC')) {
			    // Parse it into sections.
				var RMCA = data[i].split('$');
				var internal_values = RMCA[1].split(',');

				// As long as we don't have missing/half data. Parse the line.
				if (internal_values[3] === " ") {

				} else {
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
