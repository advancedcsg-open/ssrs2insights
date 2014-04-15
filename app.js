/* jslint node: true */

// Module dependencies.
var express = require('express');
var routes = require('./routes');
var db = require('./libs/db');
var insights = require('./libs/insights');
var http = require('http');
var path = require('path');

// express config
var app = express();

// all environments
app.set('port', process.env.PORT || 3010);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(require('morgan')('dev'));
app.use(require('body-parser')());
app.use(require('method-override')());
app.use(require('serve-static')(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(require('errorhandler')());
}

// default routes
app.get('/', routes.index);

// start web server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// regular process ssrs report run events
db.getReports(insights);
var interval = setInterval(function () {
    db.getReports(insights);
  }, 30000);

