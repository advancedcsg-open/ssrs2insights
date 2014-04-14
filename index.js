/* jslint node: true */
var db = require('./db');
var insights = require('./insights');

var interval = setInterval(function () {
    insights.send(db.getReports());
}, 60000);
