/* jslint node: true */
var sql = require('mssql');

// config for DB connections
var config = require('config');
var lastProcessed = config.App.lastProcessed;

exports.getReports = function(insights) {
  'use strict';

  // get where clause - using config file for the time being
  var dbWhere = 'where LogEntryId > ' + lastProcessed;
  var conn = new sql.Connection(config.Database, function (err) {
    // check for error
    if (err) {
      console.error(err.stack);
    } else {
      console.info('Gathering reports run since LogEntryId: ' + lastProcessed);

      // get the data
      var request = new sql.Request(conn);
      request.query('SELECT TOP 100 *, \'' + config.App.appName + '\' AS appName FROM dbo.InsightsExecutionLog ' + dbWhere, function (err, recordset) {
        // check for error
        if (err) {
          console.error(err.stack);
        } else {
          if (recordset.length > 0) {
            console.info('Processing ' + recordset.length + ' SSRS report executions');
            getAccount(recordset, insights.send);
          }
        }
      });
    }
  });
};

function getAccount(recordset, processed){
  // loop record sets to get account
  var async = require('async');
  async.map(recordset, function(record, callback) {
    var conn = new sql.Connection(config.DatabaseAccounts, function(err) {
      // check for error
      if (err) {
        console.error('DB connection failed: ' + err.stack);
        callback(err);
      } else {
        // get the data
        var request = new sql.Request(conn);
        request.query(config.App.accountCommand + '\'' + record.user + '\'', function (err, accountset) {
          if (err) {
            console.error('Error retrieving account information for ' + record.user + ': ' + err.stack);
            callback(err);
          } else {
            if (accountset.length > 0) record.account = accountset[0].account;
            else record.account = 'System';

            callback(err, record);
          }
        });
      }
    });
  }, function(err, result){
    lastProcessed = recordset[recordset.length - 1].LogEntryId;
    if (err) {
      console.error("Account retrieval failed: " + err.stack);
    }
    processed(recordset, function(e){
      if (e) {
        console.error('Update to Insights failed');
      } else {
        config.App.lastProcessed = lastProcessed;
      }
    });
  });
}
