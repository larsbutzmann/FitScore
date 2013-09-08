var express = require("express");
var app = express();
var http = require("http");
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

var fitbitUrl = "http://fitbitreaduser:FitBit123@shatechcrunchhana.sapvcm.com:8000/fitbit/services/distance.xsjs?userSurrId=11";

http.get(fitbitUrl, function(res) {
  console.log("Got response: " + res.statusCode);
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
}).on('error', function(e) {
  console.log("Got error: " + e.message);
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
