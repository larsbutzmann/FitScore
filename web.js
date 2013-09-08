var express = require("express");
var runkeeper = require('runkeeper-js');
var http = require("http");
var async = require("async");
var crypto = require("crypto");

var app = express();
app.use(express.logger());

app.configure(function() {
  app.set('views', __dirname + '/site/views');
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + '/site'));
  app.use(express.methodOverride());
  // app.use(app.router);
  //Show all errors in development
  // app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.get('/', function (req, res) {
  res.render('index');
});

app.get("/score", function(req, res) {
  async.parallel({
      calories: function(cb) {
        sapdata(cb, "calories", req.query.userId, req.query.date, req.query.date);
      },
      steps: function(cb) {
        sapdata(cb, "steps", req.query.userId, req.query.date, req.query.date);
      }
    },
    function(err, results) {
      var activityScore = calculateStepScore(results.steps);
      var calories = getCalories(req.query.userId, req.query.date);
      var caloriesForUser = getCaloriesForUser(req.query.userId);
      var foodScore = (caloriesForUser - Math.abs(calories - caloriesForUser)) / caloriesForUser * 10;
      var sleepScore = getSleepScore(req.query.userId, req.query.date);
      resultObject = {
        scores: {
          foodScore: foodScore,
          activityScore: activityScore,
          sleepScore: sleepScore
        },
        absoluteValues: {
          calories: calories,
          steps: results.steps,
          sleep: getSleep(req.query.userId, req.query.date)
        }
      };
      res.send(resultObject);
    });
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
	
	var aggregateDataPerTimeframe = function(data, startDate, endDate) {
		var res = { duration : 0, distance : 0, calories : 0 };
		for(i = 0; i < data.length; i++) {
			if (new Date(data[i].start_time).getTime() >= new Date(startDate).getTime() && new Date(data[i].start_time).getTime() <= new Date(endDate).getTime()) {
				res.duration += data[i].duration;
				res.distance += data[i].total_distance;
				res.calories += data[i].total_calories;
			}
		}
		return res;
	}
	
	var client = new runkeeper.HealthGraph(options);
	
	if (request.query.metric == "weight") {
		client.apiCall("GET", "application/vnd.com.runkeeper.WeightSetFeed+json", "/weight?pageSize=100", function(err, reply) {
			if(err) { console.log(err); }
			if(reply.items.length > 0) {
				for (i = 0; i < reply.items.length; i++) {
				//request.query.startDate && 
					if (new Date(reply.items[i].timestamp).toDateString() == new Date(request.query.startDate).toDateString())
					response.send(reply.items[i].weight + "");
				}
				response.send(reply.items[0].weight + " sadad");
			} else {
				response.send("0");
			}
		});
	}
	else if (request.query.metric == "sleep") {
		client.apiCall("GET", "application/vnd.com.runkeeper.SleepSetFeed+json","/sleep?pageSize=1", function(err, reply) {
			if(err) { console.log(err); }
			if(reply.items.length > 0) {
				response.send(reply.items);
				response.send(reply.items[0].total_sleep + "");
			} else {
				response.send("0");
			}
		});
	}
	else if (request.query.metric == "active") {
		client.fitnessActivityFeed(function(err, reply) {
			if(err) { console.log(err); }
			if(reply.items.length > 0) {
				response.send(aggregateDataPerTimeframe(reply.items, "2013-08-03", "2013-08-31"));
			} else {
				response.send({ duration : 0, distance : 0, calories : 0 });
			}
		});
	}
	else response.send("try:	/weight /sleep /active ");
});

var calculateStepScore = function(steps) {
  var max_steps = 10000;
  return Math.min(steps, max_steps) / max_steps * 10;
};

// FIXME
var getCalories = function(userId, date) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(userId.toString());
  md5sum.update(date.toString());
  var number = parseInt(md5sum.digest('hex'), 16);
  var calories = number % 2000 + 1000;
  return calories;
};

// FIXME
var getCaloriesForUser = function(userId) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(userId.toString());
  var number = parseInt(md5sum.digest('hex'), 16);
  var calories = number % 500 + 1500;
  return calories;
};

var getSleep = function(userId, date) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(userId.toString());
  md5sum.update(date.toString());
  var number = parseInt(md5sum.digest('hex'), 16);
  var sleep = number % 7 + 5;
  return sleep;
};

var getSleepScore = function(userId, date) {
  return Math.min(getSleep(userId, date), 8) / 8 * 10;
};

var sapdata = function(cb, dataName, userId, startDate, endDate) {
  var store = '';
  var url = "http://fitbitreaduser:FitBit123@shatechcrunchhana.sapvcm.com:8000/fitbit/services/";
  url += dataName + "Sum.xsjs";
  url += "?userSurrId=" + userId;
  url += "&startDate=" + startDate;
  url += "&endDate=" + endDate;

  http.get(url, function(resp) {
    resp.on("data", function(chunk) {
      store += chunk;
    })
    .on("end", function() {
      var jsonRes = JSON.parse(store);
      var number = jsonRes[dataName];
      cb(null, number);
    })
    .on("error", function(e) {
      cb("error");
    });
  });
};
