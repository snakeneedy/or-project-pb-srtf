function autoData(seed) {
  /*
   * seed: {
   *   number:       integer
   *   arrival_time: integer
   *   remain_time:  integer
   * }
   */
  var data = 'id,arrival_time,remain_time,priority,expired_time\n';
  for(var i = 0; i < +seed['number']; i++) {
    data += (i+1) +',';
    data += Math.floor(+seed['arrival_time'] * Math.random()) +',';
    data += Math.floor(+seed['remain_time'] * Math.random()) +',';
    data += (Math.floor(5 * Math.random()) + 1) +',';
    data += '-1\n';
  }
  return data;
}
var data = autoData({
  number:       20,
  arrival_time: 50,
  remain_time:  75
});
console.log(data);
//var data = 'id,arrival_time,remain_time,priority,expired_time\n'
//+ '1,4,22,4,-1\n'
//+ '2,42,4,1,-1\n'
//+ '3,53,12,1,-1\n'
//+ '4,13,17,1,-1\n'
//+ '5,86,15,5,-1\n'
//+ '6,38,5,4,-1\n'
//+ '7,53,14,5,-1\n'
//+ '8,44,22,2,-1\n'
//+ '9,91,16,3,-1\n'
//+ '10,74,0,1,-1\n'
//+ '11,72,4,1,-1\n'
//+ '12,55,4,3,-1\n'
//+ '13,76,15,3,-1\n'
//+ '14,80,20,2,-1\n'
//+ '15,77,19,2,-1\n'
//+ '16,95,16,2,-1\n'
//+ '17,53,14,2,-1\n'
//+ '18,2,9,1,-1';

// hsl(  0, 100%, 50%) // Red
// hsl( 60, 100%, 50%) // Yellow
// hsl(120, 100%, 50%) // Green
// hsl(180, 100%, 50%) // Cyan
// hsl(240, 100%, 50%) // Blue

