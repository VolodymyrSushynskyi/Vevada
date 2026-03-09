using Microsoft.AspNetCore.Identity;
using Vevada.Data.Entities.Base;

namespace Vevada.Data.Entities;

public class User : IdentityUser<int>, IEntity
{
    public string? RefreshTokenHash { get; set; }
    public DateTimeOffset? RefreshTokenExpiryTime { get; set; }
    public ClientDetails? ClientDetails { get; set; }
    public bool IsAdminUser { get; set; }
}
