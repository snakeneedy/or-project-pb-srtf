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

