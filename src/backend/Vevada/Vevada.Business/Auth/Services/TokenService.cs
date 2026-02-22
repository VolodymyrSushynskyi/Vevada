using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Vevada.Business.Auth.Interfaces;
using Vevada.Data.Entities;

namespace Vevada.Business.Auth.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;
    private readonly UserManager<User> _userManager;

    public TokenService(IConfiguration configuration, UserManager<User> userManager)
    {
        _configuration = configuration;
        _userManager = userManager;
    }

    public async Task<string> GenerateAccessTokenAsync(User user)
    {
        var missingConfigMessage = (string setting) => $"Missing {setting} in jwt configuration";

        var jwtSettings = _configuration.GetSection("JwtSettings");

        var key = Encoding.ASCII.GetBytes(jwtSettings["Key"] ?? 
            throw new InvalidOperationException(missingConfigMessage("Key")));
        var issuer = jwtSettings["Issuer"] ?? 
            throw new InvalidOperationException(missingConfigMessage("Issuer"));
        var audience = jwtSettings["Audience"] ??
            throw new InvalidOperationException(missingConfigMessage("Audience"));
        var expireMinutesStr = jwtSettings["ExpireMinutes"] ??
            throw new InvalidOperationException(missingConfigMessage("ExpireMinutes"));

        var roles = await _userManager.GetRolesAsync(user);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.UserName ?? throw new InvalidOperationException("User doesn't have a username")),
            new Claim(ClaimTypes.Email, user.Email ?? throw new InvalidOperationException("User doesn't have an email")),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(double.Parse(expireMinutesStr)),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = issuer,
            Audience = audience
        };

        var tokenHandler = new JsonWebTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return token;
    }

    public string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];

        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);

        return Convert.ToBase64String(randomNumber);
    }

    public static string ComputeHash(string input)
    {
        var bytes = Encoding.UTF8.GetBytes(input);

        var hash = SHA256.HashData(bytes);

        return Convert.ToBase64String(hash);
    }

    public async Task<ClaimsPrincipal?> GetPrincipalFromExpiredTokenAsync(string token)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var key = Encoding.ASCII.GetBytes(jwtSettings["Key"] ??
            throw new InvalidOperationException("Missing Key in jwt configuration"));

        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false,
            ValidateIssuer = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateLifetime = false
        };

        var tokenHandler = new JsonWebTokenHandler();

        var result = await tokenHandler.ValidateTokenAsync(token, tokenValidationParameters);

        if (!result.IsValid)
        {
            return null;
        }

        if (result.SecurityToken is JsonWebToken jwt 
            && !jwt.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
        {
            throw new SecurityTokenException("Invalid token algorithm");
        }

        if (result.ClaimsIdentity == null)
        {
            return null;
        }

        return new ClaimsPrincipal(result.ClaimsIdentity);
    }
}
