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
var fillcolors = ['red', 'yellow', 'green', 'cyan', 'blue'];

function visualize(target, ref, data) {
  /* all below are integers
   * ref: index + 1 = id
   * { 'id', 'arrival_time', 'priority', 'expired_time' }
   * data:
   * { 'id', 'start_time', 'end_time' }
   */
  //console.log(JSON.stringify(data));
  var unitWidth = 5,
    unitHeight = 20;

  var d = data.sort(function(nxt, pre) {
    if(pre['id'] == nxt['id']) {
      return pre['start_time'] <= nxt['start_time'];
    }
    return pre['id'] < nxt['id'];
  });
  //var tmp_id = -1, tmp_start_time = -1;
  //for(var i = 0; i < d.length; i++) {
  //  if(tmp_id == -1) tmp_id = d[i]['id'];
  //  if(tmp_end_time == -1) tmp_end_time = d[i]['end_time'];
  //}

  var svg = d3.select(target).append('svg')
    .attr('width', 5000)
    .attr('height', ref.length * unitHeight);
  var x, y, width, height;
  for(var i = 0; i < data.length; i++) {
    x = data[i]['start_time'] * unitWidth;
    y = (data[i]['id'] - 1) * unitHeight;
    width = (data[i]['end_time'] - data[i]['start_time']) * unitWidth;
    height = unitHeight;
    //console.log('('+ x +','+ y +') ('+ width + ','+ height +')');
    svg.append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('width', width)
      .attr('height', height)
      .style('fill', fillcolors[+ref[(+data[i]['id'] - 1)]['priority'] - 1])
      .style('stroke', '#000')
      .style('stroke-width', 1);
  }
}

