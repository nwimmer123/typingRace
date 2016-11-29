var express = require('express');
var app = express();
var html = require('html');

// serve static files from public folder
app.use('/',express.static(__dirname + '/public'));

/**********
 * ROUTES *
 **********/

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/index.html');
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});