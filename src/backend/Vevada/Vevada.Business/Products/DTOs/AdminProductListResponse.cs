using Vevada.Business.Common;

namespace Vevada.Business.Products.DTOs;

public record AdminProductListResponse(
    List<TabCountDto> Counts,
    PagedResponse<AdminProductListItemDto> TableData
);
