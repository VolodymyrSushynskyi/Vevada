using MediatR;
using Vevada.Business.Auth.DTOs;
using Vevada.Business.Common;

namespace Vevada.Business.Auth.Commands;

public class RefreshTokenCommand : IRequest<HandlerResult<AuthResponseDto>>
{
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
}
