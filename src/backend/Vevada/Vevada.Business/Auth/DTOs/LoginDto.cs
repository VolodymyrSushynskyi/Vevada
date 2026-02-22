using System.ComponentModel.DataAnnotations;

namespace Vevada.Business.Auth.DTOs;

public record LoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
