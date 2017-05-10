// load dependencies
var path = require('path');
var axios = require('axios');
// helper function to filter an array of claims for only free, public claims
function filterForFreePublicClaims(claimsListArray){
	console.log(">> claimsListArray:", claimsListArray);
	if (!claimsListArray) {
		return null;
	};
	var freePublicClaims = claimsListArray.filter(function(claim){
		return ((claim.value.stream.metadata.license === 'Public Domain' || claim.value.stream.metadata.license === 'Creative Commons') &&
		(!claim.value.stream.metadata.fee || claim.value.stream.metadata.fee === 0)); 
	});
	return freePublicClaims;
}

function serveClaimBasedOnNameOnly(claimName, res){
	// make a call to the daemon to get the claims list 
	axios.post('http://localhost:5279/lbryapi', {
			method: "claim_list",
			params: {
				name: claimName
			}
		}
	).then(function (response) {
		console.log(">> Claim_list success");
		console.log(">> Number of claims:", response.data.result.claims.length)
		// return early if no claims were found
		if (response.data.result.claims.length === 0){
			res.sendFile(path.join(__dirname, '../public', 'noClaims.html'));
			return;
		}
		// filter the claims to return free, public claims 
		var freePublicClaims = [];
		freePublicClaims = filterForFreePublicClaims(response.data.result.claims);
		// return early if no free, public claims were found
		if (!freePublicClaims || (freePublicClaims.length === 0)){
			res.sendFile(path.join(__dirname, '../public', 'noClaims.html'));
			return;
		}
		console.log(">> free public claims", freePublicClaims);
		var freePublicClaimUri = freePublicClaims[0].name + "#" + freePublicClaims[0].claim_id;
		console.log(">> your free public claim uri:", freePublicClaimUri);
		// fetch the image to display
		axios.post('http://localhost:5279/lbryapi', {
				method: "get",
				params: {
					uri: freePublicClaimUri
				}
			}
		).then(function (getResponse) {
			console.log(">> 'get claim' success...");
			console.log(">> response data:", getResponse.data);
			console.log(">> dl path =", getResponse.data.result.download_path)
			// return the claim we got 
			res.sendFile(getResponse.data.result.download_path);
		}).catch(function(getError){
			console.log(">> /c/ 'get' error:", getError);
			res.send(getError);
		})
	}).catch(function(error){
		console.log(">> /c/ error:", error);
		res.send(error);
	})
}

function serveClaimBasedOnUri(claimUri){
	//
}

function serveAllClaims(claimName){
	// make a call to the daemon to get the claims list 
	axios.post('http://localhost:5279/lbryapi', {
			method: "claim_list",
			params: {
				name: claimName
			}
		}
	).then(function (response) {
		console.log(">> Claim_list success");
		console.log(">> Number of claims:", response.data.result.claims.length)
		// return early if no claims were found
		if (response.data.result.claims.length === 0){
			res.sendFile(path.join(__dirname, '../public', 'noClaims.html'));
			return;
		}
		// filter the claims to return free, public claims 
		var freePublicClaims = [];
		freePublicClaims = filterForFreePublicClaims(response.data.result.claims);
		// return early if no free, public claims were found
		if (!freePublicClaims || (freePublicClaims.length === 0)){
			res.sendFile(path.join(__dirname, '../public', 'noClaims.html'));
			return;
		}
		console.log(">> Number of free public claims:", freePublicClaims.length);
		res.send(freePublicClaims); // Note: add code to display a page of all these claims 
	}).catch(function(error){
		console.log(">> /c/ error:", error);
		res.send(error);
	})
}

// routes to export
module.exports = function(app){
	// route to fetch one free public claim 
	app.get("/favicon.ico", function(req, res){
		console.log(">> GET request on favicon.ico");
		res.sendFile(path.join(__dirname, '../public', 'favicon.ico'));
	});
	// route to fetch one free public claim 
	app.get("/:name/all", function(req, res){
    	var name = req.params.name;
		console.log(">> GET request on /" + name + " (all)");
		res.send("all claims");
	});
	// route to fetch one free public claim 
	app.get("/:name/:claim_id", function(req, res){
    	var uri = req.params.name + "#" + req.params.claim_id;
		console.log(">> GET request on /" + uri);
		res.send(uri);
	});
	// route to fetch one free public claim 
	app.get("/:name", function(req, res){
    	var name = req.params.name;
		console.log(">> GET request on /" + name)
		serveClaimBasedOnNameOnly(name, res);
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