using MediatR;
using Vevada.Business.Auth.DTOs;
using Vevada.Business.Common;

namespace Vevada.Business.Auth.Commands;

public record RegisterClientCommand : IRequest<HandlerResult<AuthResponseDto>>
{
    public string Email { get; init; } = null!;
    public string Password { get; init; } = null!;
    public string FirstName { get; init; } = null!;
    public string LastName { get; init; } = null!;
    public string PhoneNumber { get; init; } = null!;
}
