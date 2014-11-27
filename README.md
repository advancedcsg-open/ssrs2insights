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
- [NEW RELIC ACCOUNT ID] replaced with your New Relic account ID, which you'll find in your insights.newrelic.com/accounts/ACCOUNT_ID URL when logged-in.
- [NEW RELIC INSIGHTS INSERT KEY] replaced with the [insert key generated from Insights](https://docs.newrelic.com/docs/insights/new-relic-insights/adding-querying-data/inserting-custom-events#register).
- [NEW RELIC APM APP ID] replaced with the Application ID for the associated application being monitored in New Relic APM. You can find your App ID(s) by executing a query like this in your Insights account, then choosing the correct Application ID:

`SELECT count(*) FROM Transaction FACET appId SINCE 1 week ago`

### Deploy InsightsExecutionLog.sql
Using the tool of your choice, execute the script sql/InsightsExecutionLog.sql in the ReportServer database on the server specified above.
