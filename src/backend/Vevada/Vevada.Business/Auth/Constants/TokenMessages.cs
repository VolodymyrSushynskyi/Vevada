namespace Vevada.Business.Auth.Constants;

public static class TokenMessages
{
    public static Func<string, string> MissingClaim = (string claim) => $"Missing claim: {claim}";
    public const string InvalidTokenAlgorithm = "Invalid token algorithm";
}
