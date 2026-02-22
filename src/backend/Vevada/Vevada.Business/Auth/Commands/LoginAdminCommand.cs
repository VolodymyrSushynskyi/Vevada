using MediatR;
using Vevada.Business.Auth.DTOs;
using Vevada.Business.Common;

namespace Vevada.Business.Auth.Commands;

public record LoginAdminCommand : IRequest<HandlerResult<AuthResponseDto>>
{
    public string Email { get; init; } = null!;
    public string Password { get; set; } = null!;
}
