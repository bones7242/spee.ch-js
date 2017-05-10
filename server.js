// load dependencies
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
// set port
var PORT = 3000;
// initialize express
var app = express();
// configure epress
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// require in routes
require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);
// start server
app.listen(PORT, function() {
	console.log("Listening on PORT " + PORT);
});
