using Vevada.Business.Common;

namespace Vevada.Business.AdminAccounts.DTOs;

public record AdminAccountListResponse(
    List<TabCountDto> Counts,
    PagedResponse<AdminAccountListItemDto> TableData
);
