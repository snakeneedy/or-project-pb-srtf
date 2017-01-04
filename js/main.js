var processes = csv2jsons(data);

// 對 arrival_time 遞增排序
processes = processes.sort(function(nxt, pre) {
  if(nxt['arrival_time'] == pre['arrival_time']) {
    // priority 小的優先
    return pre['priority'] <= nxt['priority'];
  }
  return pre['arrival_time'] < nxt['arrival_time'];
});

// 對每個程序處理
for(var i = 0; i < processes.length; i++) {
  // TODO: 跟序列所有的程序比較
  // 最優先 && 剩餘時間最少 -> 先做
}

