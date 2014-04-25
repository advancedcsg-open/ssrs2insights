ssrs2insights
=============

Upload SSRS report execution events to New Relic Insights

## Configuration

To configure the application in the config directory copy default_blank.yaml to default.yaml. Once complete update the following values

### Database
- [DATABASE IP OR ADDRESS] replaced with the server address of the SSRS database (where the ReportServer database is housed). For example '192.168.1.1'.
- [DATABASE USER NAME] replaced with database user name
- [DATABASE USER PASSWORD] replaced with password for database user
- [APPNAME TO IDENTIFY EVENTS IN INSIGHTS] replaced with the unique application name for this instance of SSRS, for example 'Production'.

### Insights
- [NEW RELIC ACCOUNT NUMBER] replaced with your New Relic account number.
- [NEW RELIC INSIGHTS INSERT API KEY] replaced with the insert key generated from Insights.
- [NEW RELIC APP ID] replaced with the Application ID for the associated application being monitored in New Relic RPM.

### Deploy InsightsExecutionLog.sql
Using the tool of your choice, execute the script sql/InsightsExecutionLog.sql in the ReportServer database on the server specified above.
