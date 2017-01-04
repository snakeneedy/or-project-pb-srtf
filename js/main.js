var processes = csv2jsons(data);
var queue = [];
var result = [];

for(var i = 0; i < processes.length; i++)
  document.getElementById('debug').innerHTML += JSON.stringify(processes[i]) +'<br/>';

document.getElementById('debug').innerHTML += '<hr/>';

// 對 arrival_time 遞增排序
processes = processes.sort(function(nxt, pre) {
  if(nxt['arrival_time'] == pre['arrival_time']) {
    // priority 小的優先
    return pre['priority'] <= nxt['priority'];
  }
  return pre['arrival_time'] < nxt['arrival_time'];
});

for(var i = 0; i < processes.length; i++)
  document.getElementById('debug').innerHTML += JSON.stringify(processes[i]) +'<br/>';

var start_time = 0,
    end_time = 0;
// 對每個程序處理
for(var i = 0; i < processes.length; i++) {
  var peroid = JSON.parse('{}');
  start_time = end_time;
  end_time = processes[i]['arrival_time'];
  //console.log(':'+ start_time +' -> '+ end_time);

  // TODO: 跟序列所有的程序比較
  // 最優先 && 剩餘時間最少 -> 先做
  queue.push(processes[i]);
  queue = queue.sort(function(nxt,pre) {
    if(pre['priority'] == nxt['priority']) {
      return pre['remain_time'] <= nxt['remain_time'];
    }
    return pre['priority'] < nxt['priority'];
  });

  queue[0]['remain_time'] -= (end_time - start_time);
  if(queue[0]['remain_time'] <= 0) {
    end_time += queue[0]['remain_time'];
    peroid['id'] = queue[0]['id'];
    queue.shift();
  }
  else {
    peroid['id'] = queue[0]['id'];
  }
  peroid['start_time'] = start_time;
  peroid['end_time']   = end_time;
  if(peroid['id'] == 2) {
    console.log('id: '+ peroid['id'] +', s: '+ start_time + ', e: '+ end_time);
  }
  result.push(peroid);
}

while(queue.length > 0) {
  var peroid = JSON.parse('{}');
  start_time = end_time;
  end_time += queue[0]['remain_time'];

  peroid['id'] = queue[0]['id'];
  peroid['start_time'] = start_time;
  peroid['end_time'] = end_time;
  queue.shift();
  result.push(peroid);
}

document.getElementById('debug').innerHTML += '<hr/>';

//console.log(result);
for(var i = 0; i < result.length; i++)
  document.getElementById('debug').innerHTML += JSON.stringify(result[i]) +'<br/>';

