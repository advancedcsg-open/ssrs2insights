/*jslint node: true */
var https = require('https');
var myConfig = require('config').Insights;

exports.send = function(recordset, callback) {
  var data = JSON.stringify(recordset);
  var options = {
    hostname: myConfig.hostname,
    port: '443',
    path: myConfig.path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Insert-Key': myConfig.insertKey
    }
  };

  console.info('Sending to New Relic');
  var req = https.request(options, function(res) {
    var data = '';

    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      data += '' + chunk;
    });
    res.on('end', function() {
      if (res.status == 200) {
        callback(false);
      } else {
        console.error('Insights send failed: ' + data);
        callback(true);
      }
    });
  });

  req.on('error', function(e) {
    console.error('Problem with request: ' + e.message);
    callback(e);
  });

  req.write(data);
  req.end();
};
