/*jslint node: true */
var https = require('https');
var myConfig = require('config').Insights;

function send(recordset) {
    console.dir(recordset);

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

    console.dir(options);

    if (true) {
        return;
    } else {
        console.log('Sending to New Relic');
        var req = https.request(options, function(res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                console.log('BODY: ' + chunk);
            });
        });

        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });

        req.write(data);
        req.end();
    }
}
