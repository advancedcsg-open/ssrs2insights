/*jslint node: true*/
"use strict";

// Module dependencies.
const db = require('./libs/db');
const insights = require('./libs/insights');

process.stdin.resume();

// regular process ssrs report run events
db.getReports(insights);
const interval = setInterval(() => {
    db.getReports(insights);
  }, 60000);

function graceful() {
  clearInterval(interval);
  process.exit(0);
}

process.on('SIGINT', graceful);
process.on('SIGTERM', graceful);
