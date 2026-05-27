namespace Vevada.Business.AdminAccounts.DTOs;

public record AdminAccountListItemDto(
    int Id,
    string FirstName,
    string LastName,
    string Email,
    string Role
);
