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
    queue.shift(); // pop()
    jsons[(+period['id'] - 1)]['expired_time'] = period['end_time'];
    result.push(period);
  }

  jsons = jsons.sort(function(nxt, pre) {
    return pre['id'] < nxt['id'];
  });
  return result;
}

var result = getExecQueue(jsons);

visualize('#chart', jsons, result);

