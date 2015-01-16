/*jslint node: true*/
"use strict";

// Module dependencies.
var db = require('./libs/db');
var insights = require('./libs/insights');

process.stdin.resume();

// regular process ssrs report run events
db.getReports(insights);
var interval = setInterval(function () {
    db.getReports(insights);
  }, 180000);

function graceful() {
  clearInterval(interval);
  process.exit(0);
}

process.on('SIGINT', graceful);
process.on('SIGTERM', graceful);
