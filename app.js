/* jslint node: true */

// Module dependencies.
var db = require('./libs/db');
var insights = require('./libs/insights');

// regular process ssrs report run events
db.getReports(insights);
var interval = setInterval(function () {
    db.getReports(insights);
  }, 30000);

