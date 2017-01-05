'use strict';
var jsons = csv2jsons(data);

function getSchedultBySRTF(jsons) {
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
        //console.log(JSON.stringify({
        //  'id':         q[i]['id'],
        //  'start_time': ref[q[i]['id'] - 1]['arrival_time'],
        //  'end_time':   q[i]['start_time'],
        //  'priority':   0
        //}));
      }
      period = q[i];
    }
    else if(period['id'] == q[i]['id']) {
      if(period['end_time'] < q[i]['start_time']) {
        q.push({
          'id':         q[i]['id'],
          'start_time': period['end_time'],
          'end_time':   q[i]['start_time'],
          'priority':   0
        });
        //console.log(JSON.stringify({
        //  'id':         q[i]['id'],
        //  'start_time': period['end_time'],
        //  'end_time':   q[i]['start_time'],
        //  'priority':   0
        //}));
        period = q[i];
      }
      else if(period['end_time'] == q[i]['start_time']) {
        // 合併碎片
        period['end_time'] = q[i]['end_time'];
        q[i]['priority'] = (-1); // q[i] 等待刪除
        if(i + 1 >= maxi || period['id'] != q[i + 1]['id'] || period['end_time'] != q[i + 1]['start_time']) {
          q.push({
            'id':         period['id'],
            'start_time': period['start_time'],
            'end_time':   period['end_time'],
            'priority':   period['priority']
          });
          //period = -1;
        }
      }
    }
  }
  // 刪除 q[i]['priority'] = (-1);
  q = q.sort(function(nxt, pre) {
    if(pre['priority'] != -1 && nxt['priority'] != -1) {
      if(pre['id'] == nxt['id']) {
        return pre['start_time'] <= nxt['start_time'];
      }
      return pre['id'] < nxt['id'];
    }
    return pre['priority'] == -1 && nxt['priority'] != -1;
  });
  while(q.length > 0 && q[0]['priority'] == -1) {
    q.shift();
  }
  return q;
}

function countWaitingTime(processes) {
  // sum ['priority']=0
  var waitingTime = 0, plus;
  for(var i = 0; i < processes.length; i++) {
    //console.log('i: '+ i +', '+ JSON.stringify(processes[i]));
    plus = processes[i]['expired_time'] - processes[i]['arrival_time'] - processes[i]['remain_time'];
    //console.log('plus: '+ plus);
    waitingTime += plus;
  }
  return waitingTime;
}

function getSchedultBySJF(jsons) {
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
    if(i == 0) {
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
        return jsons[pre['id'] - 1]['remain_time']
            <= jsons[nxt['id'] - 1]['remain_time']
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
} // getSchedultBySJF

showDataTable('data-table', jsons);

var result,
    waitingTime;

result = fillWaitingInternals(getSchedultBySRTF(jsons), jsons);
//result = getSchedultBySRTF(jsons);
waitingTime = countWaitingTime(jsons);
console.log('SRTF: '+ waitingTime);
visualize('chart-srtf', jsons, result, {
  title: 'SRTF: '+ waitingTime + ' unit time'
});

result = fillWaitingInternals(getSchedultBySJF(jsons), jsons);
//result = getSchedultBySJF(jsons);
waitingTime = countWaitingTime(jsons);
console.log('SJF: '+ waitingTime);
visualize('chart-sjf', jsons, result, {
  title: 'SJF: '+ waitingTime + ' unit time'
});

