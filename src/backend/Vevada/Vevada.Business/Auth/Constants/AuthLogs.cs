using Microsoft.Extensions.Logging;

namespace Vevada.Business.Auth.Constants;

public static partial class AuthLogs
{
    [LoggerMessage(Level = LogLevel.Warning, Message = "Login failed for {Email}: {Reason}")]
    public static partial void LogLoginFailed(this ILogger logger, string email, string reason);

    [LoggerMessage(Level = LogLevel.Warning, Message = "Registration failed for {Email}: {Reason}")]
    public static partial void LogRegistrationFailed(this ILogger logger, string email, string reason);

    [LoggerMessage(Level = LogLevel.Error, Message = "Transaction rolled back during registration for {Email} due to an unexpected error.")]
    public static partial void LogRegistrationTransactionFailed(this ILogger logger, Exception ex, string email);

    [LoggerMessage(Level = LogLevel.Warning, Message = "Unauthorized access attempt for email {Email}. User lacks required roles.")]
    public static partial void LoginAccessDenied(this ILogger logger, string email);
}
