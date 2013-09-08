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

var distance = function(cb) {
  var store = '';
  console.log("Sending");
  http.get("http://fitbitreaduser:FitBit123@shatechcrunchhana.sapvcm.com:8000/fitbit/services/calories.xsjs?userSurrId=4", function(resp) {
    resp.on("data", function(chunk) {
      store += chunk;
    })
    .on("end", function() {
      cb(null, store);
    })
    .on("error", function(e) {
      cb("error");
      console.log("Got error: " + e.messsage);
    });
  });
};

