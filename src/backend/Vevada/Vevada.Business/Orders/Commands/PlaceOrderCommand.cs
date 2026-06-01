using MediatR;
using Vevada.Business.Common;

namespace Vevada.Business.Orders.Commands;

public record PlaceOrderCommand(int UserId) : IRequest<HandlerResult<int>>;
