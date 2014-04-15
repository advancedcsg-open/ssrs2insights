/* jslint node: true */
var sql = require('mssql');

// config for DB connection
var dbConfig = require('config').Database;
console.log('Configurning DB connection');
var config = {
    user: dbConfig.user,
    password: dbConfig.password,
    server: dbConfig.server,
    database: dbConfig.database
};

function getReports() {
    'use strict';

    var retVal = null;

    // get where clause - using config file for the time being
    var dbWhere = 'where LogEntryId > ' + dbConfig.lastProcessed;

    console.log('Establishing DB connextion');
    var conn = new sql.Connection(config, function (err) {
        // check for error
        if (err) {
            console.error(err.stack);
        } else {
            console.log('Gathering reports run...');

            // get the data
            var request = new sql.Request(conn);
            request.query('SELECT \'extranet-rep\' AS appName, * FROM dbo.InsightsExecutionLog ' + dbWhere, function (err, recordset) {
                // check for error
                if (err) {
                    console.error(err.stack);
                } else {
                    retVal = recordset;
                }
            });
        }
    });

    return retVal;
}

