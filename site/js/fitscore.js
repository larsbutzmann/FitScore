$(function () {

  var dateMap = ["09-01-2013", "09-02-2013", "09-03-2013", "09-04-2013", "09-05-2013", "09-06-2013", "09-07-2013"];

  $(function() {
    $( "#slider" ).slider({
      min: 0,
      max: 6,
      step: 1,
      value: 6,
      change: function( event, ui ) {
        $("#slider-val").text(dateMap[ui.value]);
        updateData("11", dateMap[ui.value]);
      }
    });
  });

  $('#container').highcharts({
    chart: {
      polar: true,
      type: 'line'
    },
    title: {
      text: '',
      x: 0
    },
    colors: [
      "#FFA800"
    ],
    pane: {
      size: '75%'
    },
    xAxis: {
      categories: ["Food", "Activity", "Sleep", "Weight"],
      tickmarkPlacement: 'on',
      lineWidth: 0
    },
    yAxis: {
      gridLineInterpolation: 'polygon',
      lineWidth: 0,
      min: 0,
      max: 10,
      tickInterval: 2
    },
    tooltip: {
      shared: true,
      pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
    },
    legend: {
      enabled: false,
      align: 'right',
      verticalAlign: 'top',
      y: 70,
      layout: 'vertical'
    },
    series: [{
      name: 'User 1',
      data: [9.8, 7.6, 3.5, 7.4],
      pointPlacement: 'on'
    }]
  });

  function updateData(userId, date) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: "/score?userId=" + userId + "&date=" + date,
        success: function (data) {
          _log(data);
          var userData = [];
          for (var o in data["scores"]) {
            if (data["scores"][o] === null) {
              data["scores"][o] = 5;
            }
            userData.push(data["scores"][o]);
          }
          userData.push(7);
          _log(userData);
          var chart = $('#container').highcharts();
          chart.series[0].setVisible(false);
          chart.series[0].setData(userData, true);
          chart.series[0].setVisible(true, true);

          var sum = 0;
          for (var i = 0; i < userData.length; i++) {
            sum += userData[i];
          }
          _log(userData);
          var score = Math.round(sum/(userData.length+1) * 10) / 10;
          $("#score").text(score);
        }
    });
  }

});

function shuffle(o) {
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

function _log(text) {
  return console.log(text);
}
