using Vevada.Business.Common;

namespace Vevada.Business.Products.DTOs;

public record AdminProductListResponse(
    ProductTabCountsDto Counts,
    PagedResponse<AdminProductListItemDto> TableData
);
