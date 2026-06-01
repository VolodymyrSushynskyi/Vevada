using MediatR;
using Vevada.Business.Common;
using Vevada.Business.Orders.DTOs;

namespace Vevada.Business.Orders.Queries;

public record GetManufacturerActiveOrdersQuery(int AdminId) : IRequest<HandlerResult<List<OrderDto>>>;
