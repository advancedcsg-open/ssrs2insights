/*jslint node: true*/
"use strict";

var https = require('https');
var myConfig = require('config').Insights;


function lengthInUtf8Bytes(str) {
  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
  var m = encodeURIComponent(str).match(/%[89ABab]/g);
  return str.length + (m ? m.length : 0);
}

exports.send = function (recordset, callback) {
  var data = JSON.stringify(recordset),
    options = {
      hostname: myConfig.hostname,
      port: '443',
      path: myConfig.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': lengthInUtf8Bytes(data),
        'X-Insert-Key': myConfig.insertKey
      }
    },
    req = https.request(options, function (res) {
      var data = '';

      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        data += "" + chunk;
      });
      res.on('end', function () {
        if (data === '{"success":true}') {
          callback(false);
        } else {
          console.error('Insights send failed: ' + data);
          callback(true);
        }
      });
    });

  req.on('error', function (e) {
    console.error('Problem with request: ' + e.message);
    callback(e);
  });

  req.write(data);
  req.end();
};
