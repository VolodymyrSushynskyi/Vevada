using MediatR;
using Vevada.Business.AdminAccounts.DTOs;
using Vevada.Business.Common;

namespace Vevada.Business.AdminAccounts.Queries;

public record GetAdminAccountsQuery(
    int Page = 1,
    int PageSize = PagedResponse<object>.DefaultPageSize,
    string? Role = null
) : IRequest<HandlerResult<AdminAccountListResponse>>;
