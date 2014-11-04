/*jslint node: true */
var https = require('https');
var myConfig = require('config').Insights;

exports.send = function(recordset) {
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

  console.log('Sending to New Relic');
  var req = https.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      if (res.statusCode != '200') {
        console.error('STATUS: ' + res.statusCode);
        console.info('BODY: ' + chunk);
      }
    });
  });

  req.on('error', function(e) {
    console.error('Problem with request: ' + e.message);
  });

  req.write(data);
  req.end();
};
