using MediatR;
using Vevada.Business.Common;

namespace Vevada.Business.Auth.Commands;

public record LogoutCommand(int UserId) : IRequest<HandlerResult<bool>>;
