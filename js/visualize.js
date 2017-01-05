/* visualize.js
 *
 * Each datum's format:
 * {
 *   'id': string,
 *   'start_time': string,
 *   'end_time': string
 * }
 */

// hsl(  0, 100%, 50%) // Red
// hsl( 60, 100%, 50%) // Yellow
// hsl(120, 100%, 50%) // Green
// hsl(180, 100%, 50%) // Cyan
// hsl(240, 100%, 50%) // Blue
var fillcolors = ['gray', 'red', 'yellow', 'green', 'cyan', 'blue'];

function visualize(target, ref, data) {
  /* all below are integers
   * ref: index + 1 = id
   * { 'id', 'arrival_time', 'priority', 'expired_time' }
   * data:
   * { 'id', 'start_time', 'end_time' }
   */
  var d = data.sort(function(nxt, pre) {
    if(pre['id'] == nxt['id']) {
      return pre['start_time'] <= nxt['start_time'];
    }
    return pre['id'] < nxt['id'];
  });

  var dataPoints = [];
  for(var i = 0; i < d.length; i++) {
    dataPoints.push({
      x: d[i]['id'],
      y: [d[i]['start_time'], d[i]['end_time']],
      color: fillcolors[d[i]['priority']]
    });
  }
  dataPoints = dataPoints.sort(function(nxt, pre) {
    if(pre['x'] == nxt['x']) {
      return pre['start_time'] < nxt['start_time'];
    }
    return pre['x'] < nxt['x'];
  });
  var chart = new CanvasJS.Chart(target, {
    title: {
      text: "Process Schedule"
    },
    axisY: {
      title: 'Time',
      includeZero: false,
      interval: 10,
      valueFormatString: "#0.##"
    },
    axisX: {
      title: 'Process ID',
      valueFormatString: "#0.##",
      interval: 1
    },
    data: [{
      type: "rangeBar",
      yValueFormatString: "#0.##",
      dataPoints: dataPoints
    }]
  });
  chart.render();
}

function showDataTable(domId, data) {
  /*
   * order:
   * id,priority,arrival_time,remain_time,expired_time'
   */
  var table = document.getElementById(domId);
  for(var i = data.length - 1; i >= 0; i--) {
    var tr = document.createElement('tr');
    tr.innerHTML += '<td>'+ data[i]['id'] + '</td>';
    tr.innerHTML += '<td>'+ data[i]['priority'] + '</td>';
    tr.innerHTML += '<td>'+ data[i]['arrival_time'] + '</td>';
    tr.innerHTML += '<td>'+ data[i]['remain_time'] + '</td>';
    tr.innerHTML += '<td>'+ data[i]['expired_time'] + '</td>';
    table.appendChild(tr);
  }
}

