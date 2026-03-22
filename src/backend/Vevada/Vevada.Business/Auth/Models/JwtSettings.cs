namespace Vevada.Business.Auth.Models;

public class JwtSettings
{
    public const string SectionName = "JwtSettings";

    public required string Key { get; set; }
    public required string Issuer { get; set; }
    public required string Audience { get; set; }
    public required double ExpireMinutes { get; set; }
}
