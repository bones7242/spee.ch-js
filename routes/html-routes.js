// load dependencies
var path = require('path');
var lbryApi = require('../helpers/lbryApi.js');

// routes to export
module.exports = function(app){
	// route to fetch one free public claim 
	// app.get("/favicon.ico", function(req, res){
	// 	console.log(">> GET request on favicon.ico");
	// 	res.sendFile(path.join(__dirname, '../public', 'favicon.ico'));
	// });
	// route to fetch one free public claim 
	app.get("/:name/all", function(req, res){
    	var name = req.params.name;
		console.log(">> GET request on /" + name + " (all)");
		lbryApi.serveAllClaims(name, res);
	});
	// route to fetch one free public claim 
	app.get("/:name/:claim_id", function(req, res){
    	var uri = "lbry://" + req.params.name + "#" + req.params.claim_id;
		console.log(">> GET request on /" + uri);
		lbryApi.serveClaimBasedOnUri(uri, res);
	});
	// route to fetch one free public claim 
	app.get("/:name", function(req, res){
    	var name = req.params.name;
		console.log(">> GET request on /" + name)
		lbryApi.serveClaimBasedOnNameOnly(name, res);
	});
	// route for the home page
	app.get("/", function(req, res){
		res.sendFile(path.join(__dirname, '../public', 'index.html'));
	});
	// a catch-all route if someone visits a page that does not exist
	app.use("*", function(req, res){
		res.sendFile(path.join(__dirname, '../public', 'fourOhfour.html'));
	});
}