/**
 * GPS TEST - Server side test code for gps-module
 * Paired with GPS-Test.html for running on the client.
 */

var http = require('http');
var gps = require('../gps-module');
var url = require('url');

// SERVER START
var server = http.createServer(function(req, res) {

	var onError = function(err) {
        console.log(err.message, err.stack);
        res.writeHead(500, {'content-type': 'text/plain'});
        res.end('An error occurred');
    };

    // Start GPS Tracking
    gps;
    //var gps = {
    //    lat:800000,
    //    long:550000
   // }

    /**
     * Upon reciving a get request for geo, this code responds
     * with the freshest known data from the gps module
     */
    if (req.method === 'GET') {
        res.setHeader('Access-Control-Allow-Origin', '*');

        var url_parts = url.parse(req.url, true);

        console.log("GET Incoming:");
        console.log(url_parts.query);

        if (url_parts == 'undefined') {
            // Problem
            console.log("Blank Get");
        } else {
            if (url_parts.query.geo) {
                console.log("Sending GPS Data");
                var data = JSON.stringify({lat: gps.lat, long: gps.long});
                res.writeHead(200, "OK", {'Content-Type': 'application/json'});
                res.end(data);
            }
        }
    }

}); // SERVER

server.listen(3001, function() {
   console.log('server is listening on 3001')
});

