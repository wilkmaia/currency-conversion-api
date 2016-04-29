var express = require( "express" );
var request = require( "request" );

var app = express();
var base = "BRL";
var options = [ "USD", "CAD", "GBP", "EUR", "ARS", "MYR", "JPY" ];
var PORT = 9980;

var conv = {};

app.get( '/getEverything', function( req, res ){
	o = options[0];
	
	options.forEach( function( o ){
		request( "https://www.google.com/finance/converter?a=1&from="+ o +"&to=" + base,
		function( er, response, body ){ // response function
			responseGetEverything( parseFloat( response.body.split( "<span class=bld>" )[1] ), res, o );
		});
	});
});

function responseGetEverything( val, res, o )
{
	conv[o] = val;
	if( Object.keys( conv ).length == options.length ) // All requests done
	{
		res.end( JSON.stringify( conv ) );
	}
}


app.get( '/getCustomConversion', function( req, res ){
	var f = req.query.from;
	var t = req.query.to;
	
	request( "https://www.google.com/finance/converter?a=1&from="+ f +"&to=" + t,
	function( er, response, body ){ // response function
		res.end( parseFloat( response.body.split( "<span class=bld>" )[1] ).toString() );
	});
});

var server = app.listen( PORT, function() {
	var host = server.address().address;
	var port = server.address().port;
	
	console.log( "Currency converter app listening at http://%s:%s", host, port );
});