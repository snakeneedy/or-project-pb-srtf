function autoData(seed) {
  /*
   * seed: {
   *   number:       integer
   *   arrival_time: integer
   *   remain_time:  integer
   * }
   */
  var data = 'id,priority,arrival_time,remain_time,expired_time\n';
  for(var i = 0; i < +seed['number']; i++) {
    data += (i+1) +',';
    data += (Math.floor(5 * Math.random()) + 1) +',';
    data += Math.floor(+seed['arrival_time'] * Math.random()) +',';
    data += Math.floor(+seed['remain_time'] * Math.random()) +',';
    data += '-1\n';
  }
  return data;
}
//var data = autoData({
//  number:       10,
//  arrival_time: 25,
//  remain_time:  50
//});
//console.log(data);
//var data = 'id,priority,arrival_time,remain_time,expired_time\n'
//+ '1,8,22,4,-1\n'
//+ '2,42,4,2,-1\n'
//+ '3,53,12,2,-1\n'
//+ '4,4,19,5,-1\n'
//+ '5,7,17,5,-1\n';
//+ '20,3,14,25,-1\n'
//+ '19,2,49,34,-1\n'
//+ '18,5,20,62,-1\n'
//+ '17,1,44,61,-1\n'
//+ '16,1,15,58,-1\n'
//+ '15,3,13,59,-1\n'
//+ '14,1,27,58,-1\n'
//+ '13,5,32,64,-1\n'
//+ '12,4,3,39,-1\n'
//+ '11,2,38,52,-1\n'
//+ '10,3,46,16,-1\n'
//+ '9,3,33,14,-1\n'
//+ '8,3,6,34,-1\n'
//+ '7,5,7,35,-1\n'
//+ '6,4,30,5,-1\n'
//+ '5,5,34,51,-1\n'
//+ '4,3,37,45,-1\n'
//+ '3,2,28,42,-1\n'
//+ '2,4,18,15,-1\n'
//+ '1,5,42,67,-1\n';

// hsl(  0, 100%, 50%) // Red
// hsl( 60, 100%, 50%) // Yellow
// hsl(120, 100%, 50%) // Green
// hsl(180, 100%, 50%) // Cyan
// hsl(240, 100%, 50%) // Blue

