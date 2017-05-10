var path = require('path');
var axios = require('axios');

// routes to export
module.exports = function(app){
	app.get("/:claim", function(req, res){
    	var claim = req.params.claim;
		if (claim === "coconuts"){
			res.sendFile(path.join(__dirname, '../public', 'coconuts.jpg'));
		} else {
			// make a call to the daemon
			axios.post('http://localhost:5279/lbryapi', {
					method: "resolve",
					params: {
						uri: claim
					}
				}
			).then(function (response) {
				console.log("success");
				console.log(response.data);
				res.send(response.data);
			}).catch(function(error){
				console.log(error);
				res.send(error);
			})
			
		}
		
	});

	app.use("*", function(req, res){
    	//res.sendFile('index.html');
		res.sendFile(path.join(__dirname, '../public', 'index.html'));
	});
}