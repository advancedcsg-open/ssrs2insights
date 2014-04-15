/* jslint node: true */

// Module dependencies.
var express = require('express');
var routes = require('./routes');
var db = require('./libs/db');
var insights = require('./libs/insights');
var http = require('http');
var path = require('path');

var interval = setInterval(function () {
    insights.send(db.getReports());
}, 60000);
