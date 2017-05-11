// load dependencies
var path = require('path');
var axios = require('axios');

// helper function to filter an array of claims for only free, public claims
function filterForFreePublicClaims(claimsListArray){
	//console.log(">> filterForFreePublicClaims, claimsListArray:", claimsListArray);
	if (!claimsListArray) {
		return null;
	};
	var freePublicClaims = claimsListArray.filter(function(claim){
		return (((claim.value.stream.metadata.license.indexOf('Public Domain') != -1) || (claim.value.stream.metadata.license.indexOf('Creative Commons') != -1)) &&
		(!claim.value.stream.metadata.fee || claim.value.stream.metadata.fee === 0)); 
	});
	return freePublicClaims;
}
// helper function to decide if a claim is free and public
function isFreePublicClaim(claim){
	console.log(">> isFreePublicClaim, claim:", claim);
	if ((claim.value.stream.metadata.license === 'Public Domain' || claim.value.stream.metadata.license === 'Creative Commons') &&
		(!claim.value.stream.metadata.fee || claim.value.stream.metadata.fee.amount === 0)) {
		return true;	 
	} else {
		return false;
	}
}
// helper function to order a set of claims
function orderTopClaims(claimsListArray){
	console.log(">> orderTopClaims, claimsListArray:");
	claimsListArray.sort(function(claimA, claimB){
		if (claimA.amount === claimB.amount){
			return (claimA.height > claimB.height);
		} else {
			return (claimA.amount < claimB.amount);
		}
	})
	return claimsListArray;
}

module.exports = {
	serveClaimBasedOnNameOnly: function(claimName, res){
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
			var freePublicClaims = filterForFreePublicClaims(response.data.result.claims);
			// return early if no free, public claims were found
			if (!freePublicClaims || (freePublicClaims.length === 0)){
				res.sendFile(path.join(__dirname, '../public', 'noClaims.html'));
				return;
			}
			// order the claims
			var orderedPublcClaims = orderTopClaims(freePublicClaims);
			// create the uri for the first (selected) claim 
			console.log(">> ordered free public claims", orderedPublcClaims);
			var freePublicClaimUri = "lbry://" + orderedPublcClaims[0].name + "#" + orderedPublcClaims[0].claim_id;
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
	},
	serveClaimBasedOnUri: function(uri, res){  
		/* 
		NOTE: need to make pass the URI through a test to see if it is free and public
		*/
		console.log(">> your uri:", uri);
		// fetch the image to display
		axios.post('http://localhost:5279/lbryapi', {
				method: "get",
				params: {
					uri: uri
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
	},
	serveAllClaims: function(claimName, res){
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
			var freePublicClaims = filterForFreePublicClaims(response.data.result.claims);
			// return early if no free, public claims were found
			if (!freePublicClaims || (freePublicClaims.length === 0)){
				res.sendFile(path.join(__dirname, '../public', 'noClaims.html'));
				return;
			}
			console.log(">> Number of free public claims:", freePublicClaims.length);
			// order the claims
			var orderedPublicClaims = orderTopClaims(freePublicClaims);
			/*
			 NOTE: add code to display a page of all these claims 
			*/
			res.send(orderedPublicClaims);
		}).catch(function(error){
			console.log(">> /c/ error:", error);
			res.send(error);
		})
	}
}
