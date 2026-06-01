using MediatR;
using Vevada.Business.Common;
using Vevada.Business.Orders.DTOs;

namespace Vevada.Business.Orders.Queries;

public record GetAvailableManufacturerOrdersQuery() : IRequest<HandlerResult<List<OrderDto>>>;
