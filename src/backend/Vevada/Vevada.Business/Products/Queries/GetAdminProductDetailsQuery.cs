using MediatR;
using Vevada.Business.Common;
using Vevada.Business.Products.DTOs;

namespace Vevada.Business.Products.Queries;

public record GetAdminProductDetailsQuery(Guid Id) : IRequest<HandlerResult<AdminProductDetailsDto>>;
