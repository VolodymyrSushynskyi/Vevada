using System.Security.Claims;
using Vevada.Data.Entities;

namespace Vevada.Business.Auth.Interfaces;

public interface ITokenService
{
    Task<string> GenerateAccessTokenAsync(User user);
    string GenerateRefreshToken();
    Task<ClaimsPrincipal?> GetPrincipalFromExpiredTokenAsync(string token);
}
