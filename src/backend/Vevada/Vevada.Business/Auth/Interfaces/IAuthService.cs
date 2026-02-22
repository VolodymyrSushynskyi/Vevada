using Vevada.Business.Auth.DTOs;
using Vevada.Business.Auth.Models;

namespace Vevada.Business.Auth.Interfaces;

public interface IAuthService
{
    Task<IEnumerable<string>> GetUserPermissions(string email, params string[] roles);
    Task<AuthResponseDto> LoginAsync(string email, string password);
    Task<AuthResponseDto> RegisterClientAsync(RegisterClientModel model);
    Task<bool> LogoutAsync(int userId);
}
