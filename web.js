var express = require("express");
var http = require("http");
var async = require("async");

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
  async.parallel([
      function(cb) {
        sapdata(cb, "calories", 1, "2013-08-30", "2013-08-31");
      },
      function(cb) {
        sapdata(cb, "distance", 1, "2013-08-30", "2013-08-31");
      },
      function(cb) {
        sapdata(cb, "steps", 1, "2013-08-30", "2013-08-31");
      }
    ],
    function(err, results) {
      res.send(results);
    });
});

function startKeepAlive() {
  setInterval(function() {
    var options = {
      host: 'fitscore.herokuapp.com',
      port: 80,
      path: '/'
    };
    http.get(options, function(res) {
      res.on('data', function(chunk) {
        try {
          // optional logging... disable after it's working
          // console.log("HEROKU RESPONSE: " + chunk);
        } catch (err) {
          console.log(err.message);
        }
      });
    }).on('error', function(err) {
        console.log("Error: " + err.message);
    });
  }, 60 * 30 * 1000); // load every 20 minutes
}

startKeepAlive();

var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Listening on " + port);
});

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
      cb(null, store);
    })
    .on("error", function(e) {
      cb("error");
    });
  });
};
