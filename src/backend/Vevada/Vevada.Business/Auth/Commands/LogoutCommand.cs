using MediatR;
using Vevada.Business.Common;

namespace Vevada.Business.Auth.Commands;

public record LogoutCommand : IRequest<HandlerResult<bool>>
{
    public int UserId { get; init; }
}
