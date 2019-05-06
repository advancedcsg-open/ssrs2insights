/*jslint node: true*/
"use strict";
const sql = require('mssql');

// config for DB connections
const config = require('config');
const lastProcessed = config.App.lastProcessed;

function getAccount(recordset, processed) {
  // loop record sets to get account
  const async = require('async');
  async.map(recordset, (record, callback) => {
    const conn = new sql.Connection(config.DatabaseAccounts, (err) => {
      // check for error
      if (err) {
        console.error('DB connection failed: ' + err.stack);
        callback(err);
      } else {
        // get the data
        const request = new sql.Request(conn);
        request.query(config.App.accountCommand + '\'' + record.user.replace("'", "''") + '\'', (err, accountset) => {
          if (err) {
            console.error('Error retrieving account information for ' + record.user + ': ' + err.stack);
            callback(err);
          } else {
            if (accountset.length > 0) {
              record.account = accountset[0].account;
            } else {
              record.account = 'System';
            }

            callback(err, record);
          }
        });
      }
    });
  }, (err, result) => {
    lastProcessed = recordset[recordset.length - 1].LogEntryId;
    if (err) {
      console.error("Account retrieval failed: " + err.stack);
    }
    processed(recordset, (e) => {
      if (e) {
        console.error('Update to Insights failed');
      } else {
        console.info("Successfully sent to Insights (%s)", lastProcessed);
        config.App.lastProcessed = lastProcessed;
      }
    });
  });
}

exports.getReports = (insights) => {
  // get where clause - using config file for the time being
  var dbWhere = 'where LogEntryId > ' + lastProcessed,
    conn = new sql.Connection(config.Database, (err) => {
      // check for error
      if (err) {
        console.error(err.stack);
      } else {
        // get the data
        var request = new sql.Request(conn);
        request.query('SELECT TOP 200 *, \'' + config.App.appName + '\' AS appName FROM dbo.InsightsExecutionLog ' + dbWhere, (err, recordset) => {
          // check for error
          if (err) {
            console.error(err.stack);
          } else {
            if (recordset.length > 0) {
              getAccount(recordset, insights.send);
            }
          }
        });
      }
    });
};
