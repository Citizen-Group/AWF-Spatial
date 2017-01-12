var http = require('http'); // Baked into node.js, EXPRESS Framework can replace this.
var Pool = require('pg').Pool;
var querystring = require('querystring');
var url = require('url');
var fs = require('fs');
var gps = require('./gpsmodule.js');

// by default the pool will use the same environment variables
// as psql, pg_dump, pg_restore etc:
// https://www.postgresql.org/docs/9.5/static/libpq-envars.html

// you can optionally supply other values
var config = {
  host: 'localhost',
  user: 'postgres',
  password: 'admin',
  database: 'AWF'
};

process.on('unhandledRejection', function(e) {
  console.log(e.message, e.stack)
});

function processPost(request, response, callback) {
    var queryData = "";

    if(typeof callback !== 'function') return null;

    if(request.method == 'POST') {
	request.on('data', function(data) {
            queryData += data;

	// Protects against buffer overflow. 1e6 (1000000B ~ 1MB)
            if(queryData.length > 1e6) {
                queryData = "";
                response.writeHead(413, {'Content-Type': 'text/plain'}).end();
                request.connection.destroy();
            }
        });

        request.on('end', function() {
            request.post = querystring.parse(queryData);
            callback();
        });

    } else {
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end();
    }
}

var pool = new Pool(config);

// Start GPS Tracking
gps;

// SERVER START
var server = http.createServer(function(req, res) {

	var onError = function(err) {
	console.log(err.message, err.stack);
	res.writeHead(500, {'content-type': 'text/plain'});
	res.end('An error occurred');
  };

	// If GET
	if (req.method === 'GET') {
	res.setHeader('Access-Control-Allow-Origin', '*')

	var url_parts = url.parse(req.url,true);
	console.log("GET Incoming:")
	console.log(url_parts.query);
	
	if (url_parts == 'undefined') {
	// Problem

	} else { 

// GET CHOICES
		if (url_parts.query.id)
		{
			USER_ID = url_parts.query.id;
			console.log(url_parts.query.id);

			// Formulate and mail out our query
			pool.query('SELECT * FROM unit_lookup WHERE pk_uid =' + USER_ID, function(err, result)  handle an error from the query
				if(err) return onError(err);

				res.writeHead(200, {'content-type': 'text/plain'});{

                    //

				var temp = "";

				for (let i of result.rows) {
					temp += 'ID: '+ i.pk_uid +' is a ' + i.name;
				};
	
				res.end(temp);

				console.log(result.rowCount + ' rows were received');
			 });
	 } // IF ID
	else if (url_parts.query.geo)
	 {
			var content = fs.readFileSync("./geo.geojson");
		  console.log("Sending GEO");
		  res.writeHead(200, "OK", {'Content-Type': 'text/plain'});
		  res.end(content);
	
	 }// IF GEO

	 else if (url_parts.query.mobile)
	 {
			Mobile_UserID = url_parts.query.mobile;
		  console.log("Sending Mobile Data");
var dataa = JSON.stringify({lat: gps.lat, long: gps.long});
		  res.writeHead(200, "OK", {'Content-Type': 'application/json'});
		  res.end(dataa);
	
	 }// IF Mobile
  else{
    res.writeHead(200, "OK", {'Content-Type': 'text/html'});
		res.end(gps.lat + "," + gps.long);
	}
 } // ELSE for Undefined
} // IF GET

// On incoming message
 if(req.method === 'POST') {

   processPost(req, res, function() {
    console.log("POST BODY: ");
    console.log(req.post);
    // Use request.post here
    USER_ID = req.post;
    res.writeHead(200, "OK", {'Content-Type': 'text/plain'});
		res.end("<h1>" + gps.lat + "</h1>");
   })
};

}); // SERVER

server.listen(3001, function() {
   console.log('server is listening on 3001')
});

