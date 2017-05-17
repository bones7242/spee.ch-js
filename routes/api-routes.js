var path = require('path');
var axios = require('axios');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var lbryApi = require('../helpers/lbryApi.js');

module.exports = function(app){
	// route to publish a new claim
	app.post("/publish", multipartMiddleware, function(req, res){
		// receive the request 
		console.log(">> POST request on /publish");
		console.log(">> req.files:", req.files)
		console.log(">> req.body:", req.body)
		// publish the file on LBRY
		var publishObject = {
			"method":"publish", 
			"params": {
				"name": req.body.title,
				"file_path": req.files.file.path,
				"bid": 0.1,
				"metadata":  {
					"description": req.body.description,
					"title": req.body.title,
					"author": req.body.author,
					"language": req.body.language,
					"license": req.body.license,
					"nsfw": req.body.nsfw.value
				}
			}
		};
		console.log(">> publishObject:", publishObject)
		lbryApi.publishClaim(publishObject, res)
	});
	// route to return claim list in json
	app.get("/claim_list/:claim", function(req, res){
		var claim = req.params.claim;
		// make a call to the daemon
		axios.post('http://localhost:5279/lbryapi', {
				method: "claim_list",
				params: {
					name: claim
				}
			}
		).then(function (response) {
			console.log("success");
			res.send(response.data);
		}).catch(function(error){
			console.log(error.data);
			res.send(error.data);
		})
	});
}