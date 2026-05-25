using MediatR;
using Vevada.Business.Common;
using Vevada.Business.Products.DTOs;

namespace Vevada.Business.Products.Queries;

public record GetCatalogQuery(int Page = 1, int PageSize = 10) : IRequest<HandlerResult<PagedResponse<CatalogProductDto>>>;
