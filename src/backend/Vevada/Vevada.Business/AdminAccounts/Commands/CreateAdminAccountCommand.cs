using MediatR;
using Vevada.Business.Common;

namespace Vevada.Business.AdminAccounts.Commands;

public record CreateAdminAccountCommand(
    string Email,
    string FirstName,
    string LastName,
    string Password,
    string Role
) : IRequest<HandlerResult<int>>;
