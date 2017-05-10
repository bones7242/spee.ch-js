var path = require('path');
var axios = require('axios');

function filterForFreePublicClaims(claimsListArray){
	if (!claimsListArray) {
		return null;
	};
	var freePublicClaims = claimsListArray.filter(function(claim){
		return ((claim.value.stream.metadata.license === 'Public Domain' || claim.value.stream.metadata.license === 'Creative Commons') &&
		(!claim.value.stream.metadata.fee || claim.value.stream.metadata.fee === 0)); 
	});
	return freePublicClaims;
}

// routes to export
module.exports = function(app){
	// route to fetch one free public claim 
	app.get("/:claim", function(req, res){
    	var claim = req.params.claim;
		// make a call to the daemon to get the claims list 
		axios.post('http://localhost:5279/lbryapi', {
				method: "claim_list",
				params: {
					name: claim
				}
			}
		).then(function (response) {
			console.log("claim_list success");
			//filter the claims for free, public claims 
			var freePublicClaims = [];
			freePublicClaims = filterForFreePublicClaims(response.data.result.claims);
			//'get' the images to display them.
			axios.post('http://localhost:5279/lbryapi', {
					method: "get",
					params: {
						uri: freePublicClaims[0].name
					}
				}
			).then(function (getResponse) {
				console.log("'get claim' success...");
				console.log(getResponse.data);
				console.log("dl path =", getResponse.data.result.download_path)
				// return the claim we got 
				res.sendFile(getResponse.data.result.download_path);
			}).catch(function(getError){
				console.log(getError.data);
				res.send(getError.data);
			})
		}).catch(function(error){
			console.log(error.data);
			res.send(error.data);
		})
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
			printClaimIdFromClaimsList(response.data.result.claims);
			res.send(response.data);
		}).catch(function(error){
			console.log(error.data);
			res.send(error.data);
		})
	});
	// route to fetch a claim by uri
	app.get("/get/:name", function(req, res){
    	var name = req.params.name;
		//'get' the image to display them.
		axios.post('http://localhost:5279/lbryapi', {
				method: "get",
				params: {
					uri: name
				}
			}
		).then(function (getResponse) {
			console.log("'get claim' success...");
			console.log(getResponse.data);
			console.log("dl path =", getResponse.data.result.download_path)
			// return the claim we got 
			res.sendFile(getResponse.data.result.download_path);
		}).catch(function(getError){
			console.log(getError.data);
			res.send(getError.data);
		})
	});

	app.use("/", function(req, res){
    	//res.sendFile('index.html');
		res.sendFile(path.join(__dirname, '../public', 'index.html'));
	});
}