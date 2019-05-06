/*jslint node: true*/
"use strict";

const https = require('https');
const myConfig = require('config').Insights;


function lengthInUtf8Bytes(str) {
  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
  const m = encodeURIComponent(str).match(/%[89ABab]/g);
  return str.length + (m ? m.length : 0);
}

exports.send = function (recordset, callback) {
  const data = JSON.stringify(recordset),
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
    const req = https.request(options, (res) => {
      const data = '';

      res.setEncoding('utf8');

      res.on('data', (chunk) => {
        data += "" + chunk;
      });

      res.on('end', (d) => {
        const res = JSON.parse(data);
        if (res.success) {
          callback(false);
        } else {
          console.error('Insights send failed: ' + data);
          callback(true);
        }
      });
    });

  req.on('error', (e) => {
    console.error('Problem with request: ' + e.message);
    callback(e);
  });

  req.write(data);
  req.end();
};
