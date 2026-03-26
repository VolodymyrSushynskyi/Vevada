namespace Vevada.Business.Auth.Constants;

public static class AuthMessages
{
    public const string EmailRequired = "Email is required.";
    public const string InvalidCredentials = "The email or password provided is incorrect.";
    public const string EmailTaken = "A user with this email already exists.";
    public const string UserNotFound = "The requested user could not be found.";
    public const string RoleAssignmentFailed = "User registration succeeded, but role assignment failed. Please contact support.";
    public const string TokenGenerationFailed = "A critical system error occurred while generating the session.";
}
