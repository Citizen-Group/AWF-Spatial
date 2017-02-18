/**
 * GPS Module Proxy
 * This code emulates very roughly a GPS sensor.
 * Proxy development code. Not for production.
 */

var gps = function() {

    var exportedValues = {
        lat: 0,
        lat_dir: "Z",
        long: 0,
        long_dir: "Z"
	};
	module.exports = exportedValues;

	// Start of Module
    console.log('GPS Module Started. Waiting for connection');
    console.log('GPS Connection Established');

    setHeader
    exportedValues.lat = 4500.1234567;
    exportedValues.lat_dir = "Z";
    exportedValues.long = -7535.1234567;
    exportedValues.long_dir = "Z";

}();
