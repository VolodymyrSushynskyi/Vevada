using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.AdminAccounts.Commands;
using Vevada.Business.Common;
using Vevada.Data;
using Vevada.Data.Entities;

namespace Vevada.Business.AdminAccounts.Handlers;

public class DeleteAdminAccountCommandHandler : IRequestHandler<DeleteAdminAccountCommand, HandlerResult<bool>>
{
    private readonly UserManager<User> _userManager;
    private readonly VevadaDbContext _dbContext;

    public DeleteAdminAccountCommandHandler(UserManager<User> userManager, VevadaDbContext dbContext)
    {
        _userManager = userManager;
        _dbContext = dbContext;
    }

    public async Task<HandlerResult<bool>> Handle(DeleteAdminAccountCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.Id.ToString());

        if (user == null)
        {
            return HandlerResult<bool>.Failure("Account not found.");
        }

        var isAdminAccount = await _dbContext.AdminDetails
            .AnyAsync(ad => ad.UserId == user.Id, cancellationToken);

        if (!isAdminAccount)
        {
            return HandlerResult<bool>.Failure("The specified user is not an administrative account.");
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
