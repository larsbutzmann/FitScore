var ctx = document.getElementById("myChart").getContext("2d");

var options = {};
var data = {
  labels : ["Sleep","Activity","Distance","Weight"],
  datasets : [
    {
      fillColor : "rgba(220,220,220,0.5)",
      strokeColor : "rgba(220,220,220,1)",
      pointColor : "rgba(220,220,220,1)",
      pointStrokeColor : "#fff",
      data : [65,59,90,81]
    },
    {
      fillColor : "rgba(151,187,205,0.5)",
      strokeColor : "rgba(151,187,205,1)",
      pointColor : "rgba(151,187,205,1)",
      pointStrokeColor : "#fff",
      data : [28,48,40,19]
    }
  ]
};

var chart = new Chart(ctx).Radar(data,options);
