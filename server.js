var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var PORT = 3000;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// start sync db and app
app.listen(PORT, function() {
	console.log("Listening on PORT " + PORT);
});
