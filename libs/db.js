/* jslint node: true */
var sql = require('mssql');

// config for DB connection
var dbConfig = require('config').Database;
var config = {
  user: dbConfig.user,
  password: dbConfig.password,
  server: dbConfig.server,
  database: dbConfig.database
};

exports.getReports = function(insights) {
  'use strict';

  // get where clause - using config file for the time being
  var dbWhere = 'where LogEntryId > ' + dbConfig.lastProcessed;
  var conn = new sql.Connection(config, function (err) {
    // check for error
    if (err) {
      console.error(err.stack);
    } else {
      console.info('Gathering reports run since LogEntryId: ' + dbConfig.lastProcessed);

      // get the data
      var request = new sql.Request(conn);
      request.query('SELECT TOP 100 \'' + dbConfig.appName + '\' AS appName, * FROM dbo.InsightsExecutionLog ' + dbWhere, function (err, recordset) {
        // check for error
        if (err) {
          console.error(err.stack);
        } else {
          if (recordset.length > 0) {
            console.info('Processing ' + recordset.length + ' SSRS report executions');
            dbConfig.lastProcessed = recordset[recordset.length - 1].LogEntryId;
            insights.send(recordset);
          }
        }
      });
    }
  });
};

