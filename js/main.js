var processes = csv2jsons(data);
var queue = [];
var result = [];

//// debug
for(var i = 0; i < processes.length; i++)
  document.getElementById('debug').innerHTML += JSON.stringify(processes[i]) +'<br/>';
//// debug
document.getElementById('debug').innerHTML += '<hr/>';

// 對 arrival_time 遞增排序
processes = processes.sort(function(nxt, pre) {
  if(nxt['arrival_time'] == pre['arrival_time']) {
    // priority 小的優先
    return pre['priority'] <= nxt['priority'];
  }
  return pre['arrival_time'] < nxt['arrival_time'];
});

var pre_time = 0, cur_time = 0; // check time
for(var i = 0; i < processes.length; i++) {
  cur_time = processes[i]['arrival_time'];
  if(queue.length == 0) {
    // 進來第一個程序
    pre_time = cur_time;
  }
  else {
    // 檢查 queue 裡面程序是否執行完了？
    while(queue.length > 0 && pre_time + queue[0]['remain_time'] <= cur_time) {
      var period = JSON.parse('{}');
      // 可以被執行完的程序
//      console.log('[finish] pre_time: '+ pre_time +', cur_time: '+ cur_time +', queue[0]: '+ JSON.stringify(queue[0]));
      period['id'] = queue[0]['id'];
      period['start_time'] = pre_time;
      pre_time += queue[0]['remain_time']; // update
      period['end_time']   = pre_time;
      queue.shift(); // pop()
      console.log('period: '+ JSON.stringify(period));
      result.push(period);
//      console.log('      -> pre_time: '+ pre_time +', cur_time: '+ cur_time);
    }
    if(queue.length > 0 && pre_time < cur_time) {
      var period = JSON.parse('{}');
//      console.log('[ing] pre_time: '+ pre_time +', cur_time: '+ cur_time +', queue[0]: '+ JSON.stringify(queue[0]));
      period['id'] = queue[0]['id'];
      period['start_time'] = pre_time;
      period['end_time']   = cur_time;
      queue[0]['remain_time'] -= cur_time - pre_time;
      console.log('period: '+ JSON.stringify(period));
      result.push(period);
      pre_time = cur_time; // update
    }
  }
  queue.push(processes[i]);
  queue.sort(function(nxt, pre) {
    if(pre['priority'] == nxt['priority']) {
      return pre['remain_time'] <= nxt['remain_time'];
    }
    return pre['priority'] < nxt['priority'];
  });
}

pre_time = cur_time; // update
while(queue.length > 0) {
  var period = JSON.parse('{}');
  // 可以被執行完的程序
  period['id'] = queue[0]['id'];
  period['start_time'] = pre_time;
  pre_time += queue[0]['remain_time']; // update
  period['end_time']   = pre_time;
  queue.shift(); // pop()
  console.log('period: '+ JSON.stringify(period));
  result.push(period);
  //      console.log('      -> pre_time: '+ pre_time +', cur_time: '+ cur_time);
}

//// debug
//console.log(result);
for(var i = 0; i < result.length; i++)
  document.getElementById('debug').innerHTML += JSON.stringify(result[i]) +'<br/>';

