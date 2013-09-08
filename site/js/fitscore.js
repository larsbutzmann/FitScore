$(function () {

  $(function() {
    $( "#slider" ).slider({
      min: 0,
      max: 10,
      step: 1,
      value: 10,
      slide: function( event, ui ) {
        $("#slide-val").text(ui.value);
        updateData();
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

    pane: {
      size: '75%'
    },

    xAxis: {
      categories: ["Sleep", "Activity", "Distance", "Weight"],
      tickmarkPlacement: 'on',
      lineWidth: 0
    },

    yAxis: {
      gridLineInterpolation: 'polygon',
      lineWidth: 0,
      min: 0,
      max: 100
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
      color: '#FFA800',
      name: 'User 1',
      data: [65,59,90,81],
      pointPlacement: 'on'
    }]
  });

  function updateData() {
    var user1 = generateData();
    var chart = $('#container').highcharts();
    chart.series[0].setVisible(false);
    chart.series[0].setData(user1, true);
    chart.series[0].setVisible(true, true);
  }

});

function shuffle(o) {
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

function _log(text) {
  return console.log(text);
}

function generateData() {
  for (var a=[],i=0;i<4;++i) {
    a[i] = Math.floor((Math.random()*100)+1);
  }
  return a;
}