/* visualize.js
 *
 * Each datum's format:
 * {
 *   'id': string,
 *   'start_time': string,
 *   'end_time': string
 * }
 */

var fillcolors = ['gray', 'red', 'yellow', 'green', 'cyan', 'blue'];

function visualize(target, ref, data, textJson) {
  /* all below are integers
   * ref: index + 1 = id
   * { 'id', 'arrival_time', 'priority', 'expired_time' }
   * data:
   * { 'id', 'start_time', 'end_time' }
   * textJson: {
   *   'title': string
   * }
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
      text: textJson['title']
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
  var d = data.sort(function(nxt, pre) {
    return pre['id'] < nxt['id'];
  });
  var table = document.getElementById(domId);
  table.innerHTML = ('<th><td>Priority</td>'
    + '<td>Arrival Time</td>'
    + '<td>Execution Time</td></th>');
  for(var i = d.length - 1; i >= 0; i--) {
    var tr = document.createElement('tr');
    tr.innerHTML += '<td>'+ d[i]['id'] + '</td>';
    tr.innerHTML += '<td>'+ d[i]['priority'] + '</td>';
    tr.innerHTML += '<td>'+ d[i]['arrival_time'] + '</td>';
    tr.innerHTML += '<td>'+ d[i]['remain_time'] + '</td>';
    table.appendChild(tr);
  }
}

