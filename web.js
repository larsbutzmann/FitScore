var express = require("express");
var runkeeper = require('runkeeper-js');
var app = express();
app.use(express.logger());

app.get('/', function(request, response) {
  response.send('Hello World!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

app.get('/runkeeper', function(request, response) {

	var options = exports.options = {
		client_id : "7444a58b752f4cb5adc0dec149ff8f0d",
		client_secret : "1dff3cec6e2249d6a7050d4c660679d6",
		auth_url : "https://runkeeper.com/apps/authorize",
		//access_token : "ed226bafcbea43d3992219613f13c532",
		access_token : "ff2a54e7fe4042149f6a189300e7b1a9",
		access_token_url : "https://runkeeper.com/apps/token",
		api_domain : "api.runkeeper.com"
	};
	
	var responseObject = {
		calories_per_month : 0,
		distance_per_month : 0,
		activity_index_per_month : 0,
		average_sleep_length_per_month : 0,
		average_weight_per_month : 0,
		calories_today : 0,
		distance_today : 0,
		activity_index_today : 0,
		sleep_length_today : 0
	};
	
	function aggregateDataPerTimeframe(
	
	var client = new runkeeper.HealthGraph(options);
	
	// client.fitnessActivityFeed(function(err, reply) {
		// if(err) { console.log(err); }
		// bla = reply;
	// });
	
	client.apiCall("GET", "application/vnd.com.runkeeper.WeightSetFeed+json", "/weight?pageSize=100", function(err, reply) {
		if(err) { console.log(err); }
		response.send(reply);
	});
	
	client.apiCall("GET", "application/vnd.com.runkeeper.SleepSetFeed+json", "/sleep?pageSize=100", function(err, reply) {
		if(err) { console.log(err); }
		response.send(reply);
	});
	
});