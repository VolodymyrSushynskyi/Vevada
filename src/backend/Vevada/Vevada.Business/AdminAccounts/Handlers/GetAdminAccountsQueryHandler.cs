using MediatR;
using Microsoft.EntityFrameworkCore;
using Vevada.Business.AdminAccounts.DTOs;
using Vevada.Business.AdminAccounts.Queries;
using Vevada.Business.AdminAccounts.Validation;
using Vevada.Business.Common;
using Vevada.Data;

namespace Vevada.Business.AdminAccounts.Handlers;

public class GetAdminAccountsQueryHandler : IRequestHandler<GetAdminAccountsQuery, HandlerResult<AdminAccountListResponse>>
{
    private readonly VevadaDbContext _dbContext;

    public GetAdminAccountsQueryHandler(VevadaDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<HandlerResult<AdminAccountListResponse>> Handle(GetAdminAccountsQuery request, CancellationToken cancellationToken)
    {
        var baseQuery = _dbContext.Users.AsNoTracking()
            .Join(
                _dbContext.AdminDetails,
                user => user.Id,
                details => details.UserId,
                (user, details) => new { user, details }
            )
            .Join(
                _dbContext.UserRoles,
                combined => combined.user.Id,
                userRole => userRole.UserId,
                (combined, userRole) => new { combined.user, combined.details, userRole }
            )
            .Join(
                _dbContext.Roles,
                combined => combined.userRole.RoleId,
                role => role.Id,
                (combined, role) => new { combined.user, combined.details, role }
            )
            .Where(x => x.role.Name != "SuperAdmin" && x.role.Name != "Client");

        var dbRoleCounts = await baseQuery
            .GroupBy(x => x.role.Name)
            .Select(g => new { RoleName = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.RoleName!, x => x.Count, cancellationToken);

        var roleCounts = new List<TabCountDto>();

        var totalCount = dbRoleCounts.Values.Sum();
        roleCounts.Add(new TabCountDto("All", totalCount));

        foreach (var allowedRole in CreateAdminAccountValidationRules.AllowedRoles)
        {
            var count = dbRoleCounts.GetValueOrDefault(allowedRole, 0);
            roleCounts.Add(new TabCountDto(allowedRole, count));
        }

        var filteredQuery = baseQuery;
        var requestedRole = request.Role?.Trim();

        if (!string.IsNullOrWhiteSpace(requestedRole) && !requestedRole.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            var normalizedRequestedRole = requestedRole.ToUpperInvariant();
            filteredQuery = filteredQuery.Where(x => x.role.NormalizedName == normalizedRequestedRole);
        }

        var pagedTotalCount = await filteredQuery.CountAsync(cancellationToken);

        var accounts = await filteredQuery
            .OrderBy(x => x.details.LastName)
            .ThenBy(x => x.details.FirstName)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(x => new AdminAccountListItemDto(
                x.user.Id,
                x.details.FirstName,
                x.details.LastName,
                x.user.Email!,
                x.role.Name!
            ))
            .ToListAsync(cancellationToken);

        var pagedResponse = new PagedResponse<AdminAccountListItemDto>(accounts, pagedTotalCount, request.Page, request.PageSize);
        var finalResponse = new AdminAccountListResponse(roleCounts, pagedResponse);

        return HandlerResult<AdminAccountListResponse>.Success(finalResponse);
    }
}