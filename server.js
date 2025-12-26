var express = require('express');

var app = express();

// Configure CORS for Trello.com integration
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://trello.com");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("*", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Feedback Link Replacer Power-Up is listening on port ' + listener.address().port);
});
