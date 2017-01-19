var http = require('http');
var Pool = require('pg').Pool;
var querystring = require('querystring');
var url = require('url');
var fs = require('fs');

// you can optionally supply other values
var config = {
  host: '192.168.0.103',
  user: 'postgres',
  password: ' ',
  database: 'postgres'
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
        //response.writeHead(405, {'Content-Type': 'text/plain'});
        //response.end();
}
}

var pool = new Pool(config);

// SERVER START
var server = http.createServer(function(req, res) {

	var onError = function(err) {
	console.log(err.message, err.stack);
	//res.writeHead(500, {'content-type': 'text/plain'});

 	};

	// If GET
	if (req.method === 'GET') {
        res.setHeader('Access-Control-Allow-Origin', '*')

        var url_parts = url.parse(req.url, true);
        console.log("GET Incoming:");
        console.log(url_parts.query);

        if (url_parts == 'undefined') {
            // Problem
        } else {
            if (url_parts.pathname == '/building') {
                console.log("building");
                BOUNDING_X1 = url_parts.query.X1;
                BOUNDING_Yl = url_parts.query.Y1;
                BOUNDING_X2 = url_parts.query.X2;
                BOUNDING_Y2 = url_parts.query.Y2;
                console.log('X1, Y1: ' + url_parts.query.X1 + ',' + url_parts.query.Y1);
                console.log('X2, Y2: ' + url_parts.query.X2 + ',' + url_parts.query.Y2);

                // Formulate and mail out our query
                pool.query(
                    'SELECT building, way ' +
                    'FROM planet_osm_polygon ' +
                    'WHERE building is not null AND ' +
                    'way && ST_Transform(ST_MakeEnvelope('
                    + BOUNDING_X1 + ',' + BOUNDING_Yl + ','
                    + BOUNDING_X2 + ',' + BOUNDING_Y2 + ', 4326), 3857);',
                    function (err, result) {
                        //Handle an error from the query

                        if (err) return onError(err);
                        console.log(result.rowCount + ' rows were received');
                    }
                );
            }
        }
        res.writeHead(200, {'content-type': 'text/plain'});
        res.end('Post');

    }
}); // SERVER

server.listen(3001, function() {
   console.log('server is listening on 3001')
});

