using MediatR;
using Vevada.Business.Common;
using Vevada.Business.Orders.DTOs;

namespace Vevada.Business.Orders.Queries;

public record GetActiveOrdersQuery(int UserId) : IRequest<HandlerResult<List<OrderDto>>>;
