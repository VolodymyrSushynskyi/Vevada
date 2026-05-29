using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Storage;
using Vevada.Business.AdminAccounts.Commands;
using Vevada.Business.Common;
using Vevada.Data;
using Vevada.Data.Entities;

namespace Vevada.Business.AdminAccounts.Handlers;

public class CreateAdminAccountCommandHandler : IRequestHandler<CreateAdminAccountCommand, HandlerResult<int>>
{
    private readonly UserManager<User> _userManager;
    private readonly VevadaDbContext _dbContext;

    public CreateAdminAccountCommandHandler(UserManager<User> userManager, VevadaDbContext dbContext)
    {
        _userManager = userManager;
        _dbContext = dbContext;
    }

    public async Task<HandlerResult<int>> Handle(CreateAdminAccountCommand request, CancellationToken cancellationToken)
    {
        using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);

        try
        {
            var user = new User
            {
                UserName = request.Email,
                Email = request.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                EmailConfirmed = true
            };

            var createResult = await _userManager.CreateAsync(user, request.Password);
            if (!createResult.Succeeded)
            {
                var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
                return HandlerResult<int>.Failure($"Account creation failed: {errors}");
            }

            var roleResult = await _userManager.AddToRoleAsync(user, request.Role);
            if (!roleResult.Succeeded)
            {
                var errors = string.Join(", ", roleResult.Errors.Select(e => e.Description));
                return HandlerResult<int>.Failure($"Role assignment failed: {errors}");
            }

            var adminDetails = new AdminDetails
            {
                UserId = user.Id,
                FirstName = request.FirstName,
                LastName = request.LastName
            };

            await _dbContext.AdminDetails.AddAsync(adminDetails, cancellationToken);
            await _dbContext.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            return HandlerResult<int>.Success(user.Id);
        }
        catch (Exception)
        {
            if (transaction.GetDbTransaction().Connection != null)
            {
                await transaction.RollbackAsync(cancellationToken);
            }

            throw;
        }
    }
}
