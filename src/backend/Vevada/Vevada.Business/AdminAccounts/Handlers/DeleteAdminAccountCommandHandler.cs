using MediatR;
using Microsoft.AspNetCore.Identity;
using Vevada.Business.AdminAccounts.Commands;
using Vevada.Business.Common;
using Vevada.Data.Entities;

namespace Vevada.Business.AdminAccounts.Handlers;

public class DeleteAdminAccountCommandHandler : IRequestHandler<DeleteAdminAccountCommand, HandlerResult<bool>>
{
    private readonly UserManager<User> _userManager;

    public DeleteAdminAccountCommandHandler(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    public async Task<HandlerResult<bool>> Handle(DeleteAdminAccountCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.Id.ToString());

        if (user == null)
        {
            return HandlerResult<bool>.Failure("Account not found.");
        }

        var isSuperAdmin = await _userManager.IsInRoleAsync(user, "SuperAdmin");
        if (isSuperAdmin)
        {
            return HandlerResult<bool>.Failure("Cannot delete a SuperAdmin account.");
        }

        var result = await _userManager.DeleteAsync(user);

        if (!result.Succeeded)
        {
            return HandlerResult<bool>.Failure("Failed to delete the account.");
        }

        return HandlerResult<bool>.Success(true);
    }
}
