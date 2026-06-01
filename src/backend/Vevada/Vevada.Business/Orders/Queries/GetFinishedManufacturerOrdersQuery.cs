using MediatR;
using Vevada.Business.Common;
using Vevada.Business.Orders.DTOs;

namespace Vevada.Business.Orders.Queries;

public record GetFinishedManufacturerOrdersQuery(int AdminId) : IRequest<HandlerResult<List<OrderDto>>>;
