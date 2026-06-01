using MediatR;
using Vevada.Business.Common;
using Vevada.Business.Orders.DTOs;

namespace Vevada.Business.Orders.Queries;

public record GetOrderHistoryQuery(int UserId) : IRequest<HandlerResult<List<OrderDto>>>;
