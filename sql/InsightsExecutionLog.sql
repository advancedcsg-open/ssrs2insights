USE ReportServer
GO

CREATE VIEW [dbo].[InsightsExecutionLog]
AS
SELECT
	'ProgressoReport' AS eventType,
	LogEntryId,
	InstanceName,
	COALESCE(C.Path, 'Unknown') AS ReportPath,
	UserName AS 'user',
	CASE(RequestType)
		WHEN 0 THEN 'Interactive'
		WHEN 1 THEN 'Subscription'
		ELSE 'Unknown'
	END AS RequestType,
	Format,
	CAST(Parameters AS varchar(4000)) AS Parameters,
	CASE(ReportAction)
		WHEN 1 THEN 'Render'
		WHEN 2 THEN 'BookmarkNavigation'
		WHEN 3 THEN 'DocumentMapNavigation'
		WHEN 4 THEN 'DrillThrough'
		WHEN 5 THEN 'FindString'
		WHEN 6 THEN 'GetDocumentMap'
		WHEN 7 THEN 'Toggle'
		WHEN 8 THEN 'Sort'
		ELSE 'Unknown'
	END AS ReportAction,
	TimeDataRetrieval,
	TimeProcessing,
	TimeRendering,
	TimeProcessing + TimeRendering + TimeDataRetrieval AS duration,
	CASE(Source)
		WHEN 1 THEN 'Live'
		WHEN 2 THEN 'Cache'
		WHEN 3 THEN 'Snapshot'
		WHEN 4 THEN 'History'
		WHEN 5 THEN 'AdHoc'
		WHEN 6 THEN 'Session'
		WHEN 7 THEN 'Rdce'
		ELSE 'Unknown'
	END AS Source,
	Status,
	ByteCount,
	[RowCount],
	DATEDIFF(second,{d '1970-01-01'},TimeStart) AS [timestamp]
FROM ExecutionLogStorage EL WITH(NOLOCK)
LEFT OUTER JOIN Catalog C WITH(NOLOCK) ON (EL.ReportID = C.ItemID)

