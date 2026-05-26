using MediatR;
using Vevada.Business.Common;
using Vevada.Business.Products.DTOs;
using Vevada.Data.Constants;

namespace Vevada.Business.Products.Queries;

public record GetAdminProductsQuery(
    int Page = 1,
    int PageSize = PagedResponse<object>.DefaultPageSize,
    ProductStatus? Status = null
) : IRequest<HandlerResult<AdminProductListResponse>>;
