'use strict';
var jsons = csv2jsons(data);

function getExecQueue(jsons) {
  /*
   * jsons: {
   *   'id': integer,
   *   'arrival_time': integer,
   *   'remain_time': integer,
   *   'priority': integer,
   *   'expired_time': integer
   * }
   */
  // clone JSON
  var queue = [], result = [];
  var processes = JSON.parse(JSON.stringify(jsons));
  var pre_time = 0, cur_time = 0; // check time

  // 對 arrival_time 遞增排序
  processes = processes.sort(function(nxt, pre) {
    if(nxt['arrival_time'] == pre['arrival_time']) {
      // priority 小的優先
      return pre['priority'] <= nxt['priority'];
    }
    return pre['arrival_time'] < nxt['arrival_time'];
  });

  for(var i = 0; i < processes.length; i++) {
    cur_time = processes[i]['arrival_time'];
    if(queue.length == 0) {
      // 進來第一個程序
      pre_time = cur_time;
    }
    else {
      // 檢查 queue 裡面程序是否執行完了？
      while(queue.length > 0
          && pre_time + queue[0]['remain_time'] <= cur_time) {
        var period = JSON.parse('{}');

        // 可以被執行完的程序
        period['id'] = queue[0]['id'];
        period['start_time'] = pre_time;
        pre_time += queue[0]['remain_time']; // update
        period['end_time']   = pre_time;
        period['priority']   = queue[0]['priority'];
        queue.shift(); // pop()
        jsons[(+period['id'] - 1)]['expired_time'] = period['end_time'];
        result.push(period);
      }
      if(queue.length > 0 && pre_time < cur_time) {
        var period = JSON.parse('{}');

        period['id'] = queue[0]['id'];
        period['start_time'] = pre_time;
        period['end_time']   = cur_time;
        queue[0]['remain_time'] -= cur_time - pre_time;
        period['priority']   = queue[0]['priority'];
        jsons[(+period['id'] - 1)]['expired_time'] = period['end_time'];
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
    period['priority']   = queue[0]['priority'];
    queue.shift(); // pop()
    jsons[(+period['id'] - 1)]['expired_time'] = period['end_time'];
    result.push(period);
  }

  jsons = jsons.sort(function(nxt, pre) {
    return pre['id'] < nxt['id'];
  });
  return result;
}

// 還有 bug
function fillWaitingInternals(schedule, ref) {
  /*
   * schedule: [{
   *   'id': integer,
   *   'start_time': integer,
   *   'end_time': integer
   * }]
   */
  // clone JSON and sort 'id'
  var q = [];
  for(var i = 0; i < schedule.length; i++) {
    q.push(schedule[i]);
  }
  q = q.sort(function(nxt, pre) {
    if(pre['id'] == nxt['id']) {
      return pre['start_time'] <= nxt['start_time'];
    }
    return pre['id'] < nxt['id'];
  });

  var maxi = q.length;
  for(var i = 0, period = -1; i < maxi; i++) {
    if(period == -1 || period['id'] != q[i]['id']) {
      // 正要處理這個 'id' 的 process
      if(ref[q[i]['id'] - 1]['arrival_time'] < q[i]['start_time']) {
        q.push({
          'id':         q[i]['id'],
          'start_time': ref[q[i]['id'] - 1]['arrival_time'],
          'end_time':   q[i]['start_time'],
          'priority':   0
        });
      }
    }
    else if(period['id'] == q[i]['id']) {
      if(period['end_time'] < q[i]['start_time']) {
        q.push({
          'id':         q[i]['id'],
          'start_time': period['end_time'],
          'end_time':   q[i]['start_time'],
          'priority':   0
        });
      }
    }
    period = q[i];
  }
  return q;
}

// not sure
function countWaitingTime(processes) {
  // sum ['priority']=0
  console.log(processes);
  var waitingTime = 0;
  for(var i = 0; i < processes.length; i++) {
    waitingTime += (processes[i]['expired_time'] - processes[i]['arrival_time'] - processes[i]['remain_time']);
    console.log(waitingTime);
  }
  return waitingTime;
}

var result = getExecQueue(jsons);
result = fillWaitingInternals(result, jsons); // 還有 bug
console.log(countWaitingTime(jsons)); // not sure

visualize('chart', jsons, result);

