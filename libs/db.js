/* jslint node: true */
var sql = require('mssql');

// config for DB connections
var dbConfig = require('config').Database;
var dbConfigAccount = require('config').DatabaseAccounts;
var config = {
  user: dbConfig.user,
  password: dbConfig.password,
  server: dbConfig.server,
  database: dbConfig.database
};
var configAccount = {
  user: dbConfigAccount.user,
  password: dbConfigAccount.password,
  server: dbConfigAccount.server,
  database: dbConfigAccount.database
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
            dbConfig.lastProcessed.set(recordset[recordset.length - 1].LogEntryId);
            //dbConfig.lastProcessed = recordset[recordset.length - 1].LogEntryId;
            getAccount(recordset, function(data){
              console.log(data[0].user + ' - ' + data[0].account);
              insights.send(data);
            });
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
    var conn = new sql.Connection(configAccount, function(err) {
      // check for error
      if (err) {
        console.error('DB connection failed: ' + err.stack);
        callback(err);
      } else {
        // get the data
        var request = new sql.Request(conn);
        request.query(dbConfigAccount.command + '\'' + record.user + '\'', function (err, accountset) {
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
    if (err) {
      console.error("Account retrieval failed: " + err.stack);
    } else {
      console.info("Account retrieval completed for " + result.length + " events.");
      processed(result);
    }
  });
}
