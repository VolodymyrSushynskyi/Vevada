using MediatR;
using Vevada.Business.Common;

namespace Vevada.Business.AdminAccounts.Commands;

public record DeleteAdminAccountCommand(int Id) : IRequest<HandlerResult<bool>>;
