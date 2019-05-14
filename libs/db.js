const sql = require('mssql');

class Db {
  constructor (insights) {
    this.insights = insights
    this.config = require('config')
  }
  
  // config for DB connections
  async getAccount (recordset) {
    try {
      const records = recordset.map(record => {
        const conn = await sql.connect(this.config.DatabaseAccounts)
        const result = await sql.query(config.App.accountCommand + '\'' + record.user.replace("'", "''"))
        if (result.length > 0) record.account = result[0].account
        else record.account = 'System'
        return record
      })
      await this.insights.send(records)
      this.config.App.lastProcessed = records[records.length - 1].LogEntryId
    } catch(error) {
      console.error('Error retrieving account information for ' + record.user + ': ' + error.stack);
    }
  }

  async getReports () {
    try {
      const dbWher = 'where LogEntryId > ' + lastProcessed
      const conn = await sql.connect(this.config.Database)
      const request = await conn.request()
            .query('SELECT TOP 200 *, \'' + config.App.appName + '\' AS appName FROM dbo.InsightsExecutionLog ' + dbWher)
      if (recordset.length > 0) getAccount(recordset)
    } catch(err) {
      console.error(err.stack);
    }
  }
}
