using Microsoft.Extensions.Logging;

namespace Vevada.Data.Constants;

public static partial class DataLogs
{
    [LoggerMessage(Level = LogLevel.Information, Message = "Applying database migrations...")]
    public static partial void LogApplyingMigrations(this ILogger logger);

    [LoggerMessage(Level = LogLevel.Information, Message = "Database migrations applied successfully.")]
    public static partial void LogMigrationsSuccess(this ILogger logger);

    [LoggerMessage(Level = LogLevel.Information, Message = "{SeederName} seeder started...")]
    public static partial void LogSeedingStarted(this ILogger logger, string seederName);

    [LoggerMessage(Level = LogLevel.Information, Message = "{SeederName} seeder completed. Updated {itemsUpdated} items.")]
    public static partial void LogSeedingCompleted(this ILogger logger, string seederName, int itemsUpdated);

    [LoggerMessage(Level = LogLevel.Critical, Message = "Database initialization failed during startup.")]
    public static partial void LogDatabaseInitializationFailed(this ILogger logger, Exception ex);
}
