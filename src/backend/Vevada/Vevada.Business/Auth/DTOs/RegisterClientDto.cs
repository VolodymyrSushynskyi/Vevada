using System.ComponentModel.DataAnnotations;

namespace Vevada.Business.Auth.DTOs;

public record RegisterClientDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? FirstName { get; set; } = string.Empty;
    public string? LastName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
}
