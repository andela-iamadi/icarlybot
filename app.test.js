
var hellobot = require('./improvbot');
var appends = require('./helpers');
var querystring = require('querystring');
var express = require('express');
var url = require('url');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 8080;


// body parser middleware
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/', function (req, res) {
var url_parts = url.parse(req.url, true);
var query = url_parts.query;
	console.log("improv bot logging at home" + querystring.stringify(url_parts.query));
	res.status(200).send('Hello ' + query.user_name);
});

app.post('/hello', function (req, res, next) {
var url_parts = url.parse(req.url, true);
var query = url_parts.query;
    console.log(JSON.stringify(req.body));
	console.log("improv bot logging " + querystring.stringify(query) + "for url " + querystring.stringify(req.body.message));
	// var userName = "there"
	var t = new appends();
	var channel = {};
	var user = {};
	var resp = t.routeReq(channel, user, query.message);
	console.log("the response: " + resp);
	res.status(200).send(resp);
});

app.post('/msg', function (req, res, next) {
	console.log("improv bot logging " + req.body.user_name);
	var userName = req.body.user_name;
	// var userName = "there"
	var botPayload = {
		text : 'Hello, ' + userName + '!'
	};

	// avoid infinite loop
	if (userName !== 'slackbot') {
		return res.status(200).json(botPayload);
	} else {
		return res.status(200).end();
	}
});
// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});

app.listen(port, function () {
  console.log('Slack bot listening on port ' + port);
});
