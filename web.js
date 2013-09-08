var express = require("express");
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
        foodScore: foodScore,
        activityScore: activityScore,
        sleepScore: sleepScore
      };
      res.send(resultObject);
    });
});

var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Listening on " + port);
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
}



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
