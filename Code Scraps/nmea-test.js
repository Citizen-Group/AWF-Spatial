var nmea = require('node-nmea');

string = '$GPRMC,161006.425,A,7855.6020,S,13843.8900,E,154.89,84.62,110715,173.1,W,A*30'

console.log(nmea.parse(string));
