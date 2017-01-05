function csv2jsons(csv) {
  var csvrows = csv.split('\n'),
    json,
    jsons = [],
    keys,
    values;
  keys = csvrows[0].split(',');
  for(var i = 1; i < csvrows.length; i++) {
    if(csvrows[i].length == 0)
      continue;
    json = '{';
    values = csvrows[i].split(',');
    for(var j = 0; j < keys.length; j++) {
      json += '"'+keys[j]+'":'+values[j];
      if(j+1 < keys.length)
        json += ',';
    }
    json += '}';
    jsons.push(JSON.parse(json));
  }
  return jsons;
}

